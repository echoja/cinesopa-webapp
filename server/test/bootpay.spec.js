const { expect } = require('chai');
const bootpay = require('@/manager/bootpay').make();
const addContext = require('mochawesome/addContext');
// 테스트 실행할 때 실행하는 컴퓨터가
// 부트페이의 rest api 에서 허용가능한 ip인지를 먼저 체크해주세요.

// 테스트를 실행하기 전에 반드시
// receipt_id 를 수정해주세요.
// 테스트용을 넣어야지 실제 receipt_id 를 넣으면 안됨!!!

const receipt_id = '606dc5f72386840022b07b2b';

describe('bootpay Manager', function () {
  describe('getActualPaymentInfo', function () {
    it('제대로 동작해야 함', async function () {
      const res = await bootpay.getActualPaymentInfo(receipt_id);
      // console.log(res);
      addContext(this, { title: 'log', value: res });
      expect(res.success).to.be.true;
      expect(res.info.method).to.be.a('string');
      expect(res.info.price).to.equal(3000);
    });
  });
  describe('cancelPayment', function () {
    it('기본 동작이 제대로 되어야 함.', async function () {
      // 취소를 하게 되면 영향이 가므로 필요할 때 테스트하세요.
      this.skip();
      const res = await bootpay.cancelPayment({
        receipt_id,
        name: '안녕',
        reason: '이유~',
      });
      addContext(this, { title: 'log', value: res });
      expect(res.success).to.be.true;
    });
    it('일부 가격 취소가 제대로 되어야 함.', async function () {
      // 취소를 하게 되면 영향이 가므로 필요할 때 테스트하세요.
      this.skip();
      const res = await bootpay.cancelPayment({
        receipt_id,
        name: '안녕2',
        reason: '이유2~',
        price: 1000,
      });
      addContext(this, { title: 'log', value: res });
      expect(res.success).to.be.true;
    });
  });
  describe('verifyPayment', function () {
    it('제대로 동작해야 함', async function () {
      // 결제 완료 상태가 아니라면 거짓입니다.
      this.skip();
      const res = await bootpay.verifyPayment(receipt_id, 3000);
      addContext(this, { title: 'log', value: res });
      expect(res.success).to.be.true;
      expect(res.info.price).to.equal(3000);
    });
    it('가격이 다를 경우 틀려야 함', async function () {
      // 가격이 틀린지 미리 확인하세요.
      const res = await bootpay.verifyPayment(receipt_id, 4000);
      // console.log(res);
      addContext(this, { title: 'log', value: res });
      expect(res.success).to.be.false;
      expect(res.code).to.equal('price_diffs');
    });
  });
});
