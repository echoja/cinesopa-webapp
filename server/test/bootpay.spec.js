const { expect } = require('chai');
const bootpay = require('../manager/bootpay').make();

// 테스트 실행할 때 실행하는 컴퓨터가
// 부트페이의 rest api 에서 허용가능한 ip인지를 먼저 체크해주세요.

// 테스트를 실행하기 전에 반드시
// receipt_id 를 수정해주세요.
// 테스트용을 넣어야지 실제 receipt_id 를 넣으면 안됨!!!

const receipt_id = '5fd8f7008f0751003cd37fa0';

describe('bootpay Manager', function () {
  describe('getActualPaymentInfo', function () {
    it('제대로 동작해야 함', async function () {
      const res = await bootpay.getActualPaymentInfo(receipt_id);
      // console.log(res);
      expect(res.success).to.be.true;
      expect(res.info.method).to.equal('card');
      expect(res.info.price).to.equal(3000);
    });

  });
  describe('cancelPayment', function () {
    it('기본 동작이 제대로 되어야 함.', async function () {
      const res = await bootpay.cancelPayment(receipt_id, {
        name: '안녕',
        reason: '이유~',
      });
      console.log(res);
      expect(res.success).to.be.true;
    });
    it('일부 가격 취소가 제대로 되어야 함.', async function () {
      const res = await bootpay.cancelPayment(receipt_id, {
        name: '안녕2',
        reason: '이유2~',
        price: 1000,
      });
      console.log(res);
      expect(res.success).to.be.true;
    });
  });
  describe('verifyPayment', function () {
    it.only('제대로 동작해야 함', async function () {
      const res = await bootpay.verifyPayment(receipt_id, 3000);
      // console.log(res);
      expect(res.success).to.be.true;
      expect(res.info.price).to.equal(3000);
    });
    it.only('가격이 다를 경우 틀려야 함', async function () {
      const res = await bootpay.verifyPayment(receipt_id, 4000);
      // console.log(res);
      expect(res.success).to.be.false;
      expect(res.code).to.equal('price_diffs');
    });
  });
});
