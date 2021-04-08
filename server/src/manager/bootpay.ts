import { VerifyPaymentResult, CancelPaymentArgs } from "@/typedef"

import { RestClient } from "@bootpay/server-rest-client";
import { bootpayRestAppID, bootpayRestPvKey } from "@config/common";

RestClient.setConfig(bootpayRestAppID, bootpayRestPvKey);




// /**
//  * @typedef {Object} GetActualPaymentInfoResult
//  * @property {boolean} success
//  * @property {string=} code
//  * @property {PaymentInfo=} info
//  */

// /**
//  * getToken 함수의 리턴 값
//  * @typedef {Object} GetTokenResult
//  * @property {boolean} success
//  * @property {string=} code
//  * @property {string=} token
//  */


// /**
//  *
//  * @typedef {Object} CancelPaymentArgs
//  * @property {?number} [price=null] 취소할 가격. 부분취소 가능함.
//  * @property {?string} [name='']  취소자 이름. 관리용임. 필수 X
//  * @property {?string} [reason='']  취소 이유. 관리용임. 필수 X
//  */

  // /**
  //  * cancelPayment 함수의 리턴 값
  //  * @typedef {Object} CancelPaymentResult
  //  * @property {boolean} success
  //  * @property {string=} code
  //  */

  // /**
  //  * 결제 취소를 수행합니다. 관리자모드에서 수동으로 취소하고자 할 때 사용됨.
  //  * @param {string} receipt_id
  //  * @param {} args
  //  * @return {Promise<CancelPaymentResult>}
  //  */


export class BootpayManager {
  constructor() {}

  /**
   * @return {Promise<GetTokenResult>}
   */
  async getToken() {
    try {
      const tokenRes = await RestClient.getAccessToken();
      // console.log('# bootpay.js getActualPaymentInfo tokenRes');
      // console.dir(tokenRes, { depth: 4 });
      if (tokenRes.status !== 200 || tokenRes.data.token === undefined) {
        return { success: false, code: 'invalid_access_token_request' };
      }
      return { success: true, token: tokenRes.data.token };
    } catch (e) {
      return { success: false, code: e.message };
    }
  }

  /**
   * 실제 정보를 부트페이로브터 가져옵니다. 결제 검증 시 이용됨.
   * @param {string} receipt_id
   * @return {Promise<GetActualPaymentInfoResult>}
   */
  async getActualPaymentInfo(receipt_id) {
    try {
      const tokenRes = await this.getToken();
      if (!tokenRes.success) {
        return { success: false, code: tokenRes.code };
      }
      const verifyRes = await RestClient.verify(receipt_id);
      // console.log('# bootpay.js getActualPaymentInfo verifyRes');
      // console.dir(verifyRes, { depth: 4 });
      if (verifyRes.status !== 200) {
        return { success: false, code: 'verify_request_failed' };
      }
      return { success: true, info: verifyRes.data };
    } catch (e) {
      return { success: false, code: e.message };
    }
  }


  async cancelPayment(receipt_id, args: CancelPaymentArgs = {}) {
    const { price = null, name = '', reason = '' } = args;
    // 인수가 잘못되었을 때에는 즉시 오류.
    if (
      typeof receipt_id !== 'string' ||
      typeof name !== 'string' ||
      typeof reason !== 'string' ||
      name === '' ||
      reason === ''
    ) {
      return { success: false, code: 'invalid_params' };
    }

    // 토큰을 받아오는 과정에서 에러가 났을 때는 그대로 오류를 전송함.
    const tokenRes = await this.getToken();
    if (!tokenRes.success) {
      return { success: false, code: tokenRes.code };
    }

    // cancel 에 전달할 인자 생성
    const reqArgs = {
      receiptId: receipt_id,
      price,
      name,
      reason,
    };
    if (price === null) {
      delete reqArgs.price;
    }

    // cancel 실시.
    const cancelRes = await RestClient.cancel(reqArgs);

    // cancel 에 문제가 생겼을 경우 리턴.
    if (cancelRes.status !== 200) {
      return { success: false, code: 'cancel_request_failed' };
    }

    // 성공 리턴
    return { success: true };
  }


  /**
   * 결제 검증시 사용됩니다. 내부적으로 getActualPaymentInfo를 사용함.
   * 결과값에 따라서 로직은 외부에서 잘 처리하면 됨.
   * @param  receipt_id
   * @param  totalPrice 총 가격이 일치하는지를 봐야 함.
   */
  async verifyPayment(receipt_id: string, totalPrice: number) : Promise<VerifyPaymentResult> {
    try {
      const paymentInfoResult = await this.getActualPaymentInfo(receipt_id);

      // payment Info 를 받아오는 과정에서 문제가 있었을 때에는
      // 그대로 문제를 리턴하고 실행을 종료함.
      if (!paymentInfoResult.success) {
        return { success: false, code: paymentInfoResult.code };
      }
      const { info } = paymentInfoResult;
      // console.log('# bootpay.js verifyPayment info');
      // console.dir(info, { depth: 4 });
      // totalPrice 와 일치하지 않으면 에러.
      if (info.price !== totalPrice) {
        return { success: false, code: 'price_diffs', info };
      }
      // 결제완료 상태(1)가 아니라면, 에러.
      if (info.status !== 1) {
        return { success: false, code: 'payment_should_be_completed', info };
      }
      // 성공 출력
      return { success: true, info };
    } catch (e) {
      return { success: false, code: e.message };
    }
  }
}

export const make = () => new BootpayManager()

