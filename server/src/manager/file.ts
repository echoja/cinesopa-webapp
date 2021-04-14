import fs from 'fs';
import path from 'path';
import type {
  CreatePdfOptions,
  PdfTemplateArgs,
  PdfTemplateName,
} from '@/typedef';
import { pdfOutputPath, pdfPugCompiledMap, pdfTemplateNames } from '@/typedef';
import fileUrl from 'file-url';
import puppeteer from 'puppeteer';
import { promisify } from 'util';
/**
 *
 * @param {string} fullpath
 */
export const removeFile = async (fullpath: string): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    fs.unlink(fullpath, (err) => {
      if (err) return reject(err);
      return resolve();
    });
  });

/** 파일이 존재할 때 삭제하고, 아니면 아무 일도 일어나지 않습니다. */
export const safeRemoveFile = async (
  fullpath: string,
): Promise<{ success: boolean; code: string }> => {
  if (fs.existsSync(fullpath)) {
    await fs.promises.unlink(fullpath);
    return { success: true, code: 'normal' };
  }
  return { success: false, code: 'file_not_exists' };
};

/**
 * dir 내에 있는 파일들을 얻습니다.
 */
export const getFiles = async (dir: string): Promise<string[]> =>
  new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) return reject(err);
      return resolve(files);
    });
  });

export const resizeOptionMap = new Map([
  ['file_preview', { width: 190, height: 190 }],
  ['featured', { width: 400, withoutEnlargement: true }],
  ['common', { width: 1300, withoutEnlargement: true }],
]);

/**
 * pdf 를 템플릿 기반으로 생성합니다.
 * @param name pdf 템플릿 이름
 * @param args pdf 템플릿에 들어갈 인수
 * @returns 생성된 pdf의 path
 */
export async function createPdf<T extends PdfTemplateName>(
  name: T,
  args: PdfTemplateArgs<T>,
  options: CreatePdfOptions = {},
): Promise<string> {
  const {
    htmlPath = path.resolve(pdfOutputPath, `${name}.html`),
    pdfPath = path.resolve(pdfOutputPath, `${name}.pdf`),
  } = options;
  const compile = pdfPugCompiledMap.get(name);
  if (!compile) return null;

  // html 파일 생성
  const html = compile(args);
  await fs.promises.writeFile(htmlPath, html);

  // 브라우저로 html 파일 열기
  const htmluri = fileUrl(htmlPath);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      // Required for Docker version of Puppeteer
      '--no-sandbox',
      '--disable-setuid-sandbox',
      // This will write shared memory files into /tmp instead of /dev/shm,
      // because Docker’s default for /dev/shm is 64MB
      '--disable-dev-shm-usage',
    ],
  });
  const page = await browser.newPage();
  await page.goto(htmluri, {
    waitUntil: 'networkidle0',
  });

  // pdf 버퍼로 만들기
  const pdf = await page.pdf({ format: 'a4' });

  await Promise.allSettled([
    // 브라우저 종료
    browser.close(),

    // pdf 파일로 저장하기
    fs.promises.writeFile(pdfPath, pdf),
  ]);
  return pdfPath;
}

export async function removePdf(name: PdfTemplateName): Promise<void> {
  const pdfPath = path.resolve(pdfOutputPath, `${name}.pdf`);
  const htmlPath = path.resolve(pdfOutputPath, `${name}.html`);
  await Promise.allSettled([safeRemoveFile(pdfPath), safeRemoveFile(htmlPath)]);
}

export function isPdfTemplateName(name: string): name is PdfTemplateName {
  return pdfTemplateNames.some((value) => value === name);
}

export default {
  removeFile,
  safeRemoveFile,
  getFiles,
  resizeOptionMap,
  createPdf,
  removePdf,
  isPdfTemplateName,
};
