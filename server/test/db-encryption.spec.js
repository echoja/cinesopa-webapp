const { expect } = require('chai');

const { pwd_verify, pwd_encrypt, make: makeDB } = require('../manager/db');

describe('암호화', function () {
  const testpwd = '13241324';
  describe(`암호화가 제대로 동작하는지 체크 : ${testpwd}`, function () {
    let encrypted = '';
    it('pwd_encrypt 실행', async function () {
      const encryptObj = await pwd_encrypt(testpwd);
      encrypted = encryptObj.result;
    });

    it('pwd_encrypt 같은 값 두번 실행시 다른 암호화 값이 나와야 함', async function () {
      const p1 = (await pwd_encrypt(testpwd)).pwd;
      const p2 = (await pwd_encrypt('13241324')).pwd;
      expect(p1).not.equals(p2);
    });

    it('pwd_verify OK', async function () {
      const { pwd, salt } = await pwd_encrypt(testpwd);
      const b = await pwd_verify(testpwd, { pwd, salt });
      expect(b).equals(true);
    });

    it('pwd_verify FAIL', async function () {
      const { pwd, salt } = await pwd_encrypt(testpwd);
      const b = await pwd_verify('13241323', { pwd, salt });
      expect(b).equals(false);
    });
    after(function () {
      console.log(`암호화 후 패스워드 : ${encrypted}`);
    });
  });
});
