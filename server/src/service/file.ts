import path from 'path';
import multer from 'multer';
// const { promisify } = require('util');
import { imageSize as sizeOf } from 'image-size';
import sharp from 'sharp';
import fs from 'fs';
import util from 'util';
import rateLimit from 'express-rate-limit';
import { numToKorean } from 'num-to-korean';

// require('@/typedef');
import {
  DBManager,
  FileManager,
  Fileinfo,
  ApplicationSearch,
  parseRestrictedArray,
  IFile,
  IApplication,
  PrintEstimateArgs,
  isJsonObject,
} from '@/typedef';
import { Handler, ErrorRequestHandler, IRouterHandler } from 'express';
import { makeApplicationExcel } from '@/manager/excel';
import {
  ApplicationTransportStatus,
  enumApplicationDocStatus,
  enumApplicationMoneyStatus,
  enumApplicationReceiptStatus,
  enumApplicationTransportStatus,
} from '@/db/schema/enum';
import { LeanDocument } from 'mongoose';
import moment from 'moment';
import { allSettledFiltered, aw, numberWithCommas } from '../util';
// const sizeOf = promisify(sizeOfCallbackBased);

class FileService {
  #db: DBManager;

  #file: FileManager;

  #dest: string;

  #uploadField: string;

  uploadMiddleware: (Handler | ErrorRequestHandler)[];

  uploadPublicMiddleware: (Handler | ErrorRequestHandler)[];

  getExcelMiddleware: (Handler | ErrorRequestHandler)[];

  getEstimateMiddleware: (Handler | ErrorRequestHandler)[];

  constructor(
    db: DBManager,
    file: FileManager,
    dest: string,
    uploadField: string,
  ) {
    this.#db = db;
    this.#file = file;
    this.#dest = dest;
    this.#uploadField = uploadField;

    // uploadMiddleware 초기화
    this.uploadMiddleware = [
      this.initMulterMiddleware(this.#dest, this.#uploadField),
      this.initMulterErrorHandler(),
      this.initCreateFileMiddleware(this.#db, this.#file),
    ];

    // public upload middleware 정의
    this.uploadPublicMiddleware = [
      rateLimit({
        windowMs: 1000,
        max: 1,
        message:
          '짧은 시간에 업로드가 너무 많이 요청되었습니다. 잠시 후 다시 시도해주세요.',
      }),
      rateLimit({
        windowMs: 1000 * 60 * 60 * 24,
        max: 50,
        message:
          '하루 업로드가 제한되었습니다. 문의사항으로 연락주시기 바랍니다.',
      }),
      this.initCheckUploadToken(),
      this.initPublicMulterMiddleware(this.#dest, this.#uploadField),
      this.initMulterErrorHandler(),
      this.initCreateFileMiddleware(this.#db, this.#file),
    ];

    this.getEstimateMiddleware = [this.initGetEstimateMiddleware()];

    // get excel middleware 정의
    this.getExcelMiddleware = [this.initGetExcelMiddleware()];

    // 만약 사이즈에 대한 폴더가 없으면 미리 만든다. need check
    [...this.#file.resizeOptionMap.keys()].forEach((sizeName) => {
      const folderPath = path.resolve(this.#dest, sizeName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
      }
    });
  }

  /**
   * 파일을 새롭게 생성하는 미들웨어 팩토리 함수
   * multer 이후에 오게 되면 req.file 로 파일 객체에 접근할 수 있음.
   * @param {DBManager} db
   * @param {FileManager} file
   * @returns {Handler}
   */
  initCreateFileMiddleware = (
    db: DBManager,
    file: FileManager,
  ): Handler => async (req, res, next) => {
    // console.log('# file service initCreateFileMiddleware called!');
    let fullpath = '';
    try {
      // console.log('# file service initCreateFileMiddleware');
      const fileinfo: Fileinfo = {};
      const { file: fileObj } = req;
      ['filename', 'mimetype', 'path', 'encoding', 'size'].forEach((key) => {
        fileinfo[key] = fileObj[key];
      });
      fullpath = fileObj.path;
      fileinfo.origin = fileObj.originalname;
      const fileRegex = /(.*?)(\.([0-9a-zA-Z]*)?)?$/;
      const [_1, label, _2, extension] = fileObj.originalname.match(fileRegex);
      fileinfo.extension = extension;
      fileinfo.label = label;
      fileinfo.alt = label;
      // console.log(fileinfo);
      // 이메일
      const email = req?.user?.email;
      if (email) fileinfo.owner = email;

      // public은 기본적으로 true 여야 함.
      fileinfo.public = true;

      // managed도 기본적으로 true 여야 함.
      fileinfo.managed = true;

      fileinfo.fileurl = `/upload/${fileObj.filename}`;

      // 만약 이미지일 경우 사이즈 지정
      if (fileObj.mimetype.startsWith('image')) {
        const dimensions = sizeOf(fileObj.path);
        fileinfo.width = dimensions.width;
        fileinfo.height = dimensions.height;
      }

      // db에 새롭게 저장
      await db.createFile(fileinfo, email);

      res.send({ message: 'success', file: fileinfo });
      // next();
    } catch (error) {
      next(error);
      await file.removeFile(fullpath);
      console.log(
        '파일 업로드 중 에러로 인해 중단하고 업로드했던 파일을 삭제했습니다.',
      );
      console.error(error);
    }
  };

  /**
   *
   * @param {string} dest
   * @param {string} uploadField
   * @returns {Handler}
   */
  initMulterMiddleware = (dest: string, uploadField: string): Handler =>
    multer({ dest }).single(uploadField);

  /**
   *
   * @param {string} dest
   * @param {string} uploadField
   * @returns {Handler}
   */
  initPublicMulterMiddleware = (dest: string, uploadField: string): Handler =>
    multer({ dest, limits: { fileSize: 10485760 } }).single(uploadField);

  initMulterErrorHandler = (): ErrorRequestHandler => {
    const handler = (err, req, res, next) => {
      if (err) {
        console.log('# file service initMulterErrorHandler called');
        console.log(err);
        next(err);
      }
    };
    return handler;
  };

  /**
   * 업로드 토큰을 검사합니다.
   */
  initCheckUploadToken = (): Handler =>
    aw(async (req, res, next) => {
      const { token } = req.query;
      // 토큰 파라미터가 설정되어 있지 않으면 오류
      if (typeof token !== 'string') {
        res.status(400).send('파라미터가 설정되어 있지 않습니다.');
        return;
      }
      const { isValidTTL, doc: tokenDoc } = await this.#db.getToken(
        token,
        'taxinfo_request',
      );
      // 토큰이 존재하지 않거나 시간이 문제가 있다면
      if (!tokenDoc || !isValidTTL) {
        res.status(404).send('토큰이 존재하지 않거나 유효시간에 도달했습니다.');
        return;
      }
      next();
    });

  createPrintEstimateArgs(
    doc: LeanDocument<IApplication>,
    address: string,
    phone: string,
  ): PrintEstimateArgs {
    const dateString = moment().tz('Asia/Seoul').format('yyyy-MM-DD');
    const tax = Math.round(doc.charge / 11);
    const supply = doc.charge - tax;
    const result: PrintEstimateArgs = {
      chiefName: '성송이',
      companyPlace: address,
      chiefPhone: phone,
      dateString,
      recipientCompanyName: doc.host,
      estimateContent: {
        1: {
          type: '영화',
          name: doc.film_title,
          standard: doc.format,
          count: '1EA',
          unitCostCommaed: numberWithCommas(supply),
          suppliedCostCommaed: numberWithCommas(supply),
        },
      },
      suppliedCostSumCommaed: numberWithCommas(supply),
      totalPriceCommaed: numberWithCommas(doc.charge),
      totalPriceHangul: `${numToKorean(doc.charge)}원정`,
    };
    return result;
  }

  initGetEstimateMiddleware = () =>
    aw(async (req, res, next) => {
      const { templateName, id } = req.params;

      // params 검사
      if (typeof id !== 'string') {
        res.status(400).send('파라미터가 설정되어 있지 않습니다.');
        return;
      }

      // 신청서 검사
      const appl = await this.#db.getApplication(parseInt(id, 10));
      if (!appl) {
        res.status(404).send('해당 신청서를 찾을 수 없습니다.');
        return;
      }
      if (!this.#file.isPdfTemplateName(templateName)) {
        res.status(404).send('잘못된 tempalte 이름입니다.');
        return;
      }

      // 옵션 가져오기 및 검사
      const options = await allSettledFiltered([
        this.#db.getSiteOption('address'),
        this.#db.getSiteOption('phone'),
      ]);
      if (options.length !== 2) {
        res.status(500).send('옵션을 가져오는 도중 에러가 발생했습니다.');
        return;
      }
      if (typeof options[0].value !== 'string') {
        res.status(404).send('잘못된 주소입니다.');
        return;
      }
      if (typeof options[1].value !== 'string') {
        res.status(404).send('잘못된 전화번호입니다.');
        return;
      }

      // pdf 생성
      const pdfPath = await this.#file.createPdf(
        templateName,
        this.createPrintEstimateArgs(appl, options[0].value, options[1].value),
      );
      const dateString = moment().tz('Asia/Seoul').format('yyyy-MM-DD');
      // res.download(pdfPath, `${appl.host}_견적서_${dateString}.pdf`);
      res.sendFile(pdfPath);
    });

  getFileMiddleware = aw(async (req, res, next) => {
    // console.log(req.params.filename);
    // 파일 이름이 주어지지 않을 경우 404
    const { filename } = req.params;
    // console.log('# file.js getFileMiddleware query');
    // console.log(req.params);
    if (!filename) {
      res.status(404).send();
      return;
    } // console.log(req.query);

    // 우선 파일 이름을 .으로 나누기.
    // const splitted = filename.split('.');
    // let fileNameNoExt = filename;

    // // 만약 확장자가 들어왔다면?
    // if (splitted.length >= 2) {
    //   // eslint-disable-next-line prefer-destructuring
    //   fileNameNoExt = splitted.slice(0, -1).join('.');
    // }

    // console.log(foundByFilename.path);
    // console.log(__dirname);
    const { size, action } = req.query;

    // 보내는 로직을 미리 정의해놓음.
    const sendFile = async (file: LeanDocument<IFile>) => {
      res.set('Content-Type', foundByFilename?.mimetype);
      // 사이즈가 있을 시 사이즈 기반으로 파일 경로 구함
      const abspath =
        typeof size === 'string'
          ? await this.resizeImage(file, size)
          : absPath(file?.path);

      // download 일 경우 다운로드 수행
      if (action === 'download') {
        res.download(abspath, file?.origin ?? file?.label ?? 'file');
      } else {
        res.sendFile(abspath);
      }
    };
    // 파일이름으로 찾기 시도. 찾을시 바로 보냄.
    const foundByFilename = await this.#db.getFile(filename);
    if (foundByFilename) {
      sendFile(foundByFilename);
      return;
    }

    // 옵션으로 파일 찾기 시도.
    const optionName = filename;
    const fileByOption = await this.#db.getFilebyOptionName(optionName);

    // 옵션이 주어진다면, 해당하는 파일 보내기.
    if (fileByOption) {
      sendFile(fileByOption);
      return;
    }

    // 해당하는 옵션의 파일도 존재하지 않는다면, 404
    res.status(404).send();
  });

  initGetExcelMiddleware = (): Handler =>
    aw(async (req, res, next) => {
      const {
        type,
        date_lte,
        date_gte,
        transport_status,
        doc_status,
        money_status,
        receipt_status,
        search,
      }: { [P in keyof ApplicationSearch]: string } & {
        type?: string;
      } = req.query;
      const date_lte_parsed = date_lte ? new Date(date_lte) : null;
      const date_gte_parsed = date_gte ? new Date(date_gte) : null;
      const transport_status_parsed = transport_status
        ? parseRestrictedArray(transport_status, enumApplicationTransportStatus)
        : null;
      const doc_status_parsed = doc_status
        ? parseRestrictedArray(doc_status, enumApplicationDocStatus)
        : null;
      const money_status_parsed = money_status
        ? parseRestrictedArray(money_status, enumApplicationMoneyStatus)
        : null;
      const receipt_status_parsed = receipt_status
        ? parseRestrictedArray(receipt_status, enumApplicationReceiptStatus)
        : null;

      if (type === 'application') {
        try {
          const docs = await this.#db.getApplications({
            date_gte: date_gte_parsed,
            date_lte: date_lte_parsed,
            transport_status: transport_status_parsed,
            doc_status: doc_status_parsed,
            money_status: money_status_parsed,
            receipt_status: receipt_status_parsed,
            search,
            page: 0,
            perpage: 1000,
          });
          const excelPath = await makeApplicationExcel(
            docs.list,
            path.resolve(__dirname, '../../temp'),
          );
          const download = util.promisify(res.download);
          await download.call(res, excelPath);
          await fs.promises.unlink(excelPath);
        } catch (error) {
          console.error(error);
          next(error);
        }
      }
    });

  // /**
  //  * Option Name 으로 파일을 얻어다주는 Middleware.
  //  */
  // getFileByNameMiddleware = aw(async (req, res, next) => {
  //   const { name } = req.params;

  //   // name 이 주어지지 않았을 경우
  //   if (!name) return res.status(404).send();

  // })

  async getFile(filename) {
    return this.#db.getFile(filename);
  }

  async getFiles() {
    return this.#db.getFiles();
  }

  /**
   * 이미지를 리사이즈하고 절대 경로를 반환합니다.
   * 파일이 이미지 파일이 아닐 경우 리사이즈를 진행하지 않고 원래 파일 경로를 보냅니다.
   * @param {Fileinfo} fileinfo
   * @param {string} size
   */
  async resizeImage(fileinfo, size) {
    const defaultPath = absPath(fileinfo.path);
    // 사이즈 변수가 제대로 안들어왔을 경우 바로 리턴.
    if (!size || typeof size !== 'string') {
      return defaultPath;
    }

    // 사이즈 변수가 미리 정의된 사이즈 중에 없을 때 바로 리턴.
    const resizeOption = this.#file.resizeOptionMap.get(size);
    if (!resizeOption) {
      return defaultPath;
    }

    // 만약 파일이 이미지가 아닐 경우 그냥 바로 리턴.
    if (!fileinfo.mimetype.startsWith('image')) {
      return defaultPath;
    }

    const splittedPath = defaultPath.split(path.sep);
    splittedPath.splice(splittedPath.length - 1, 0, size);
    const toPath = splittedPath.join(path.sep);

    // 이미 파일이 있다면, 파일 이름만 리턴.
    if (fs.existsSync(toPath)) {
      return toPath;
    }

    // 파일이 없다면 리사이즈 후 파일 이름 리턴.
    await sharp(defaultPath).resize(resizeOption).toFile(toPath);
    // console.log('# file.js resizeImage toPath');
    // console.log(toPath);
    return toPath;
  }

  /**
   *
   * @param {string} filename 실제 저장되는 파일 이름
   * @throws 파일이 db상 존재하지 않을 때
   */
  async removeFile(filename) {
    const toRemove = await this.#db.getFile(filename);
    if (!toRemove) throw Error(`파일이 존재하지 않습니다: ${filename}`);
    const fullpath = toRemove.path;
    await this.#db.removeFile(filename);
    await this.#file.removeFile(fullpath);
  }

  /**
   * 본래 있던 파일을 삭제하고 데이터베이스는 새로운 파일로 갱신합니다.
   * @param {string} origin 원래의 filename
   * @param {Fileinfo} replacement 바꿀 파일의 정보
   * @param {string} owner 소유자의 email
   */
  async replaceFile(origin, replacement, owner) {
    await this.#file.removeFile(origin);
    await this.#db.createFile(replacement, owner);
    await this.#db.removeFile(replacement.filename);
  }

  /**
   * 실제 파일은 존재하지만 db에서 추적되지 않는 파일을 얻습니다.
   * @returns {Promise<string[]>} filename 의 배열
   */
  async getUntrackedFiles(): Promise<string[]> {
    const dbFiles = await this.#db.getFiles();
    // console.log('# file.ts getUntractedFiles dbfiles');
    // console.log(dbFiles);
    const actualFilenames = await this.#file.getFiles(this.#dest);
    const untracked = actualFilenames.filter(
      (actualFilename) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        dbFiles.list.findIndex(
          (dbFile) => dbFile.filename === actualFilename,
        ) === -1,
    );
    return untracked;
  }
  /**
   * db 상 존재하지만 실제 파일이 없는 파일을 얻습니다. (아직 구현 안함)
   * @returns {Promise<string[]>} filename 의 배열
   */

  async getDangledFiles() {
    return [];
  }
}
// /** @type {DBManager} */
// let db;

// /** @type {FileManager} */
// let file;

// /** @type {string} */
// let dest;

// /** @type {string} */
// let uploadField;

// const file = require("../manager/file");
// /**
//  * 파일을 새로 만듭니다.
//  * @param {Express.Multer.File} fileinfo
//  */
// const newFile = async (fileinfo) => {};

// const
// const getFile = async (filename) => db.getFile(filename);

// const
// const getFiles = async () => db.getFiles();

// const makeMulter = () => {
//   return;
// };

export const absPath = (relative) =>
  path.resolve(__dirname, '../../', relative);

export default {
  make(dbManager, fileManager, deststr, uploadFieldstr) {
    return new FileService(dbManager, fileManager, deststr, uploadFieldstr);
    // console.log(path.join(dest));
    // return {
    //   getFile,
    //   getFiles,
    //   removeFile,
    //   replaceFile,
    //   getUntrackedFiles,
    //   getDangledFiles,
    //   uploadMiddleware: makeMulter(),
    //   getFileMiddleware,
    // };
  },

  // req.user로 유저 데이터 접근 가능
  // req.isAuthenticated() 로 지금 인증된 상태인지 확인 가능
  // key를 넣어서 업로드하는 것은 외부로 공개되지 않는 파일만 가능하다. params에서 권한을 설정할 수 있다.
  // 이 기능은 authenticated 되어야 한다.
  // uploadMiddleware(req, res, next) {
  //   if (req.isAuthenticated() && req.user.role === "ADMIN") {
  //     console.log(req.params);
  //     console.log(req.body);
  //     console.log(req.file);
  //     res.status(204).send();
  //   } else {
  //     res.send("not authenticated!");
  //   }
  // },
};
