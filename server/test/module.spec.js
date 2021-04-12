/**
 * @file 외부 모듈(라이브러리)와 관련된 테스트를 모아둔 것입니다.
 */

const Hangul = require('hangul-js');
const ExcelJs = require('exceljs');
const express = require('express');
const path = require('path');
const createAgent = require('supertest').agent;
const { expect } = require('chai');
const fs = require('fs');
const { clearDirectory } = require('./tool').default;

describe('modules', function () {
  // after('파일 제거', async function () {
  //   await clearDirectory('test/temp');
  // });
  describe('path and fs', function () {
    // eslint-disable-next-line mocha/no-setup-in-describe
    const pathed = path.resolve('test/temp');
    it('mkdir works', function (done) {
      this.skip();
      if (!fs.existsSync(pathed)) {
        fs.mkdir(pathed, function (err) {
          if (err) return done(err);
          return done();
        });
      } else {
        done(new Error(`${pathed}가 이미 존재해요.`));
      }
    });

    // console.log(path.join("test/upload-middlewares"));
    // console.log(fs.mkdir(path))
  });
  describe('express + exceljs', function () {
    it('exceljs 생성 + 파일 다운로드 + 파일 삭제 제대로 동작해야 함', async function () {
      const xlsxPath = 'test/temp/test.xlsx';
      const workbook = new ExcelJs.Workbook();
      workbook.creator = '영화배급협동조합 씨네소파';
      workbook.created = new Date(1985, 8, 30);
      workbook.modified = new Date();
      const sheet = workbook.addWorksheet('시트 1번');
      sheet.columns = [
        { header: 'Id', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'D.O.B.', key: 'DOB' },
        { header: '이것은 날짜입니다.', key: 'date' },
      ];
      sheet.addRows([{ id: 1, name: 'ho', DOB: 'powerman', date: new Date() }]);
      await workbook.xlsx.writeFile(xlsxPath);

      const app = express();
      // await fs.promises.writeFile(filepath, 'hello-world!');
      app.get('/download', (req, res) => {
        res.download(xlsxPath, (err) => {
          if (err) {
            console.error(err);
            res.send(404);
            return;
          }
          fs.unlink(xlsxPath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      });
      const agent = createAgent(app);
      const result = await agent.get('/download');
      // console.dir(result);
      const imsi = fs.readdirSync('test/temp');
      // console.dir(imsi);
      expect(result.status).to.equal(200);
      expect(imsi).to.be.empty;
      // console.log(result.headers);
      // console.log(result.text);
    });
  });
  describe('express', function () {
    it('download callback이 제대로 동작해야 함', async function () {
      const app = express();
      const filepath = 'test/temp/express-download-test.txt';
      await fs.promises.writeFile(filepath, 'hello-world!');
      app.get('/download', (req, res) => {
        res.download(filepath, (err) => {
          if (err) {
            console.error(err);
            res.send(404);
            return;
          }
          fs.unlink(filepath, (err) => {
            if (err) {
              console.log(err);
            }
          });
        });
      });
      const agent = createAgent(app);
      const result = await agent.get('/download');
      // console.dir(result);
      const imsi = fs.readdirSync('test/temp');
      // console.dir(imsi);
      expect(result.status).to.equal(200);
      expect(imsi).to.be.empty;

      // console.log(result.headers);
    });
  });
  before('파일 제거', async function () {
    await clearDirectory('test/temp');
  });
  describe('exceljs', function () {
    it('기본 동작 실험. 새로 만들어서 파일 만들기', function () {
      const workbook = new ExcelJs.Workbook();
      workbook.creator = '영화배급협동조합 씨네소파';
      // workbook.lastModifiedBy = 'Her';
      workbook.created = new Date(1985, 8, 30);
      workbook.modified = new Date();
      // workbook.lastPrinted = new Date(2016, 9, 27);
      const sheet = workbook.addWorksheet('시트 1번');
      sheet.columns = [
        { header: 'Id', key: 'id' },
        { header: 'Name', key: 'name' },
        { header: 'D.O.B.', key: 'DOB' },
        { header: '이것은 날짜입니다.', key: 'date' },
      ];
      sheet.addRows([{ id: 1, name: 'ho', DOB: 'powerman', date: new Date() }]);
      workbook.xlsx.writeFile('test/temp/test.xlsx');
    });
  });
  describe('hangul', function () {
    it('잘 동작하여야 함', function () {
      const result = Hangul.disassembleToString('안녕하십니까?');
      expect(result).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅣㅂㄴㅣㄲㅏ?');
    });
    it('잘 동작하여야 함 (공백 포함)', function () {
      const result = Hangul.disassembleToString('안녕하 십니까?');
      expect(result).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏ ㅅㅣㅂㄴㅣㄲㅏ?');
    });
    it('잘 동작하여야 함 (공백 포함한 뒤 공백 없애기)', function () {
      const result = Hangul.disassembleToString('안   녕 하 십 니까?');
      const resultNoSpace = result.replace(/ /g, '');
      expect(resultNoSpace).to.equal('ㅇㅏㄴㄴㅕㅇㅎㅏㅅㅣㅂㄴㅣㄲㅏ?');
    });
  });
});
