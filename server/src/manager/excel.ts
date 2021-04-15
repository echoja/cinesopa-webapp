import { Applicationinfo, ApplicationSearch, IApplication } from '@/typedef';
import ExcelJs from 'exceljs';
import path from 'path';
import fs from 'fs';
import { LeanDocument } from 'mongoose';
import axios from 'axios';
import { asyncMap } from '@/util';
import moment from 'moment-timezone';
import http from 'http';
import https from 'https';
import { formatDiagnosticsWithColorAndContext } from 'typescript';

type ApplicationinfoNoOptional = {
  // priority 숫자가 낮은 게 왼쪽(먼저), 높은 게 오른쪽(나중에)
  [P in keyof Applicationinfo]-?: { label: string; priority: number };
};
type ApplicationHeader = Omit<
  ApplicationinfoNoOptional,
  | 'business_license_filename'
  | 'business_license_url'
  | 'meta'
  | 'reqdoc_token'
  | 'reqdoc_expire_date'
  | 'search'
>;

const applicationHeader: ApplicationHeader = {
  id: { label: 'id', priority: 0 },
  host: { label: '주최', priority: 1 },
  festival: { label: '행사이름', priority: 1.5 },
  c_date: { label: '생성일', priority: 2 },
  m_date: { label: '수정일', priority: 3 },
  film_title: { label: '작품명', priority: 4 },
  charge: { label: '상영료', priority: 5 },
  start_date: { label: '상영 시작일', priority: 6 },
  end_date: { label: '상영 종료일', priority: 7 },
  session_count: { label: '상영 회차', priority: 8 },
  format: { label: '상영 포맷', priority: 9 },
  applicant_name: { label: '담당자 이름', priority: 10 },
  applicant_phone: { label: '담당자 연락처', priority: 11 },
  applicant_email: { label: '담당자 이메일', priority: 12 },
  destination: { label: '상영본 받을 주소', priority: 13 },
  transport_company: { label: '택배사', priority: 14 },
  transport_number: { label: '송장번호', priority: 15 },
  transport_status: { label: '배송 상태', priority: 16 },
  doc_status: { label: '서류 요청 상태', priority: 17 },
  money_status: { label: '정산 상태', priority: 18 },
  receipt_status: { label: '세금계산서 상태', priority: 19 },
  // business_license_filename: { label: '신청자', priority: 20 },
  // business_license_url: { label: '신청자', priority: 21 },
  deposit_date: { label: '입금 예상일', priority: 22 },
  receipt_date: { label: '세금계산서 작성 일자', priority: 23 },
  receipt_email: { label: '세금계산서 발행 이메일', priority: 24 },
  receipt_etc_req: { label: '세금계산서 기타 요청', priority: 25 },
  // reqdoc_token: { label: '신청자', priority: 26 },
  // reqdoc_expire_date: { label: '신청자', priority: 27 },
  // search: { label: '신청자', priority: 28 },
  etc_req: { label: '기타 요청', priority: 29 },
  memo: { label: '메모', priority: 30 },
  memo_unremarked: { label: '메모 체크안됨', priority: 31 },
  // meta: { label: '신청자', priority: 32 },
} as const;

/** Application 배송 관련 */
export const applicationTransportStatusMap = {
  online: '온라인 전송',
  yet_to_delivery: '상영본 발송 대기중',
  delivery_complete: '상영본 발송 완료',
  return_complete: '상영본 회수 완료',
} as const;

/** Application 세금계산서 관련 */
export const applicationReceiptStatusMap = {
  not_applicable: '세금계산서 발행 안함',
  pending: '세금계산서 발행 대기중',
  done: '세금계산서 발행 완료',
} as const;

/** Application 정산 관련 */
export const applicationMoneyStatusMap = {
  not_applicable: '입금/정산 안함',
  pending_deposit: '입금 대기중',
  deposit_checked: '입금 확인됨',
  document_done: '정산시트기입 완료',
  invoice_done: '정산 완료',
} as const;

/** Application 서류 상태 */
export const applicationDocStatusMap = {
  not_applicable: '서류 해당 없음',
  pending: '필요 서류 확인중',
  request_sended: '서류 요청 보냄',
  request_not_sended: '서류 요청 보내지 않음',
} as const;

let deliveryCodeToString: Map<string, string> = null;
let deliveryCodeDate = new Date();

// 버그성 행동이 이상해서 새로 만듬.
const customAxios = axios.create({});

export const getDeliveryData = async () => {
  // 캐싱
  if (
    deliveryCodeToString &&
    new Date().getTime() - deliveryCodeDate.getTime() < 1000 * 60 * 60 * 24 * 14
  )
    return deliveryCodeToString;

  // 새로운 배달 리스트 얻기
  const res = await customAxios({
    method: 'get',
    url: 'https://apis.tracker.delivery/carriers',
  });
  deliveryCodeDate = new Date();
  deliveryCodeToString = new Map();
  // console.log(res);
  res.data.forEach((delivery) => {
    deliveryCodeToString.set(delivery.id, delivery.name);
  });
  return deliveryCodeToString;
};

let applicationColumns = null;

const toSeoulDate = (d: Date) => moment(d).utcOffset(0, true).toDate();

export const makeApplicationExcel = async (
  docs: LeanDocument<IApplication>[],
  tempPath: string,
): Promise<string> => {
  const xlsxPath = path.resolve(tempPath, 'application.xlsx');
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }

  const workbook = new ExcelJs.Workbook();
  workbook.creator = '영화배급협동조합 씨네소파';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet('Sheet');
  if (applicationColumns === null) {
    applicationColumns = Object.keys(applicationHeader)
      .sort(function (left, right) {
        const lp = applicationHeader[left].priority;
        const rp = applicationHeader[right].priority;
        if (lp > rp) return 1;
        if (lp === rp) return 0;
        return -1;
      })
      .map((key) => ({
        header: applicationHeader[key].label,
        key,
      }));
  }
  sheet.columns = applicationColumns;

  const rows: {
    [P in keyof ApplicationHeader]?: string | number | Date;
  }[] = await asyncMap(docs, async (doc) => {
    try {
      const deliveryData = await getDeliveryData();
      const result = {
        ...doc,
        transport_company: deliveryData.get(doc.transport_company),
        doc_status: applicationDocStatusMap[doc.doc_status],
        money_status: applicationMoneyStatusMap[doc.money_status],
        receipt_status: applicationReceiptStatusMap[doc.receipt_status],
        transport_status: applicationTransportStatusMap[doc.transport_status],
        memo_unremarked: doc.memo_unremarked ? '예' : '아니오',
        c_date: toSeoulDate(doc.c_date),
        m_date: toSeoulDate(doc.m_date),
        start_date: doc.start_date ? toSeoulDate(doc.start_date) : null,
        end_date: doc.end_date ? toSeoulDate(doc.end_date) : null,
        deposit_date: doc.deposit_date ? toSeoulDate(doc.deposit_date) : null,
        receipt_date: doc.receipt_date ? toSeoulDate(doc.receipt_date) : null,
      };
      return result;
    } catch (e) {
      console.error(e);
    }
    return {};
  });
  sheet.addRows(rows);
  await workbook.xlsx.writeFile(xlsxPath);
  return xlsxPath;
};

export const unlinkApplicationExcel = async (tempPath: string) =>
  fs.promises.unlink(path.resolve(tempPath, 'application.xlsx'));
