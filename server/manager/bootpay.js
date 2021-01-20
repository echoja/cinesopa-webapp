const { RestClient } = require('@bootpay/server-rest-client');
const { bootpayRestAppID, bootpayRestPvKey } = require('../config/common');

RestClient.setConfig(bootpayRestAppID, bootpayRestPvKey);

// RestClient.getAccessToken().then(function (response) {
//   // Access Token을 발급 받았을 때
//   if (response.status === 200 && response.data.token !== undefined) {
//     RestClient.verify('[[ receipt_id ]]').then(function (_response) {
//       // 검증 결과를 제대로 가져왔을 때
//       if (_response.status === 200) {
//         console.log(_response);
//       }
//     });
//   }
// });

/**
 * @typedef {BootpayManager} BootpayManager
 */

class BootpayManager {
  constructor() {}
  /**
   * @typedef {Object} PaymentData
   * @property {string}   card_name ex): 하나,
   * @property {string}   card_no ex): 94308100****4569,
   * @property {string}   card_quota ex): 00,
   * @property {string}   card_auth_no ex): 09286221,
   * @property {string}   receipt_id ex): 5df6e67d4f74b4002a77e0eb,
   * @property {string}   n ex): 테스트결제,
   * @property {number}   p ex): 3000,
   * @property {string}   tid ex): 48585753,
   * @property {string}   pg ex): 페이앱,
   * @property {string}   pm ex): 카드정기결제(REST),
   * @property {string}   pg_a ex): payapp,
   * @property {string}   pm_a ex): card_rebill_rest,
   * @property {string}   o_id ex): 1576461949,
   * @property {string}   p_at ex): 2019-12-16 11:05:50,
   * @property {number}   s ex): 1,
   * @property {number}   g ex): 2
   */

  /**
   * @typedef {Object} PaymentInfo
   * @property {string} receipt_id ex): 5df6e67d4f74b4002a77e0eb,
   * @property {string} order_id ex): 1576461949,
   * @property {string} name ex): 테스트결제,
   * @property {number} price ex): 3000,
   * @property {number} tax_free ex): 1500,
   * @property {number} remain_price ex): 3000,
   * @property {number} remain_tax_free ex): 1500,
   * @property {number} cancelled_price ex): 0,
   * @property {number} cancelled_tax_free ex): 0,
   * @property {string} receipt_url ex): https://app.bootpay.co.kr/bill/ZVN3cXdRNTlEbTYzVi8xNmIyWCtFS0VrcWJncXkweFBoT200WXRPQkgzVC9u%0AZz09LS1KNU1MRW5JdGNMa3RMZDRLLS1lWkhFaTFkMmVnVkR0SmRTMUxUNXdR%0APT0=%0A,
   * @property {string} unit ex): krw,
   * @property {string} pg ex): payapp,
   * @property {string} method ex): card_rebill_rest,
   * @property {string} pg_name ex): 페이앱,
   * @property {string} method_name ex): 카드정기결제(REST),
   * @property {PaymentData} payment_data
   * @property {string} requested_at ex) : 2019-12-16 11:05:50,
   * @property {string} purchased_at ex) : 2019-12-16 11:05:50,
   * @property {number} status ex): 1,
   * @property {string} status_en ex): complete,
   * @property {string} status_ko ex): 결제완료
   */

  /**
   * @typedef {Object} GetActualPaymentInfoResult
   * @property {boolean} success
   * @property {string} code
   * @property {PaymentInfo} info
   */

  /**
   * getToken 함수의 리턴 값
   * @typedef {Object} GetTokenResult
   * @property {boolean} success
   * @property {string} code
   * @property {string} token
   */

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

  /**
   *
   * @typedef {Object} CancelPaymentArgs
   * @property {?number} [price=null] 취소할 가격. 부분취소 가능함.
   * @property {?string} [name='']  취소자 이름. 관리용임. 필수 X
   * @property {?string} [reason='']  취소 이유. 관리용임. 필수 X
   */

  /**
   * cancelPayment 함수의 리턴 값
   * @typedef {Object} CancelPaymentResult
   * @property {boolean} success
   */

  /**
   * 결제 취소를 수행합니다. 관리자모드에서 수동으로 취소하고자 할 때 사용됨.
   * @param {string} receipt_id
   * @param {CancelPaymentArgs} args
   * @return {Promise<CancelPaymentResult>}
   */
  async cancelPayment(receipt_id, args = {}) {
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
      price: price,
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
   * verifyPayment 함수의 리턴 값
   * @typedef {Object} VerifyPaymentResult
   * @property {boolean} success
   * @property {string} code
   * @property {PaymentInfo} info
   */

  /**
   * 결제 검증시 사용됩니다. 내부적으로 getActualPaymentInfo를 사용함.
   * 결과값에 따라서 로직은 외부에서 잘 처리하면 됨.
   * @param {string} receipt_id
   * @param {number} totalPrice 총 가격이 일치하는지를 봐야 함.
   * @return {Promise<VerifyPaymentResult>}
   */
  async verifyPayment(receipt_id, totalPrice) {
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

module.exports = {
  make: () => new BootpayManager(),
};
