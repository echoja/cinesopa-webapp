import addContext from 'mochawesome/addContext';
import { expect } from 'chai';
import random from 'random';
// const { upload, createFileFromMockFile } = require('./tool').default;
import { fake } from 'sinon';
import { db, model } from '@/loader';
import { execute } from 'graphql';
import { unwrap } from '@/util';
import { IApplication } from '@/typedef';
import {
  createTestServer,
  graphqlSuper,
  doLogin,
  doLogout,
  makeSimpleQuery,
  randomDate,
  doAdminLogin,
  makeSimpleMutation,
} from './tool';
import {
  filmQuery,
  filmsQuery,
  createFilmMutation,
  updateFilmMutation,
  removeFilmMutation,
  filmsFeaturedQuery,
} from './graphql-request';

describe('application', function () {
  const { agent, fileService, mongod, uploadDest, webapp } = createTestServer(
    this,
  );
  describe('db', function () {
    describe('getApplication', function () {
      it('제대로 동작해야 함', async function () {
        const created = await model.Application.create({
          applicant_name: 'abc',
        });
        const found = await db.getApplication(created.id);
        addContext(this, { title: 'found', value: found });
        expect(found.applicant_name).to.equal('abc');
      });
      it('토큰이 있을 시 토큰 정보도 가져와야 함', async function () {
        const doc = await model.Application.create({ applicant_name: 'ho' });
        const d = new Date();
        const token = await model.Token.create({
          appl_id: doc.id,
          token: 'abcd',
          c_date: d,
          ttl: 100,
        });
        const found = await db.getApplication(doc.id);
        addContext(this, { title: 'found', value: found });
        expect(found.reqdoc_expire_date.getTime()).to.equal(
          d.getTime() + 100 * 1000,
        );
        expect(found.reqdoc_token).to.equal('abcd');
      });
    });
    describe('getApplications', function () {
      // before('getApplications db 테스트 사전 준비', async function () {

      // });

      it('기본 동작이 제대로 되어야 함.', async function () {
        await Promise.allSettled([
          model.Application.create({ applicant_email: 'a' }),
          model.Application.create({ applicant_email: 'b' }),
          model.Application.create({ applicant_email: 'c' }),
        ]);
        const found = await db.getApplications({ perpage: 30 });
        addContext(this, { title: 'found', value: found });
        expect(found.list.length).to.equal(3);
      });
      it('토큰이 있을 시 토큰 정보도 가져와야 함.', async function () {
        const doc = await model.Application.create({ applicant_name: 'ho' });
        const d = new Date();
        const token = await model.Token.create({
          appl_id: doc.id,
          token: 'abcd',
          c_date: d,
          ttl: 100,
        });
        const found = await db.getApplications({ perpage: 30 });
        addContext(this, { title: 'found', value: found });
        expect(found.list.length).to.equal(1);
        expect(found.list[0].reqdoc_expire_date.getTime()).to.equal(
          d.getTime() + 100 * 1000,
        );
        expect(found.list[0].reqdoc_token).to.equal('abcd');
      });
      it('perpage, page 가 제대로 동작해야 함', async function () {
        await Promise.allSettled([
          model.Application.create({ applicant_email: 'a' }),
          model.Application.create({ applicant_email: 'a' }),
          model.Application.create({ applicant_email: 'b' }),
          model.Application.create({ applicant_email: 'b' }),
          model.Application.create({ applicant_email: 'c' }),
          model.Application.create({ applicant_email: 'c' }),
          model.Application.create({ applicant_email: 'd' }),
        ]);
        const found = await db.getApplications({ perpage: 2, page: 2 });
        addContext(this, { title: 'found', value: found });
        expect(found.list.length).to.equal(2);
      });
      describe('date_gte, date_lte', function () {
        it('date_gte 혼자 있을 때 잘 동작해야 함', async function () {
          await Promise.allSettled([
            model.Application.create({ start_date: new Date('2010-02-23') }),
            model.Application.create({ start_date: new Date('2010-02-24') }),
            model.Application.create({ start_date: new Date('2010-02-25') }),
          ]);
          const found = await db.getApplications({
            perpage: 30,
            date_gte: new Date('2010-02-24'),
          });
          addContext(this, { title: 'found', value: found });
          expect(found.list.length).to.equal(2);
        });
        it('date_lte 혼자 있을 때 잘 동작해야 함', async function () {
          await Promise.allSettled([
            model.Application.create({ start_date: new Date('2010-02-23') }),
            model.Application.create({ start_date: new Date('2010-02-24') }),
            model.Application.create({ start_date: new Date('2010-02-25') }),
          ]);
          const found = await db.getApplications({
            perpage: 30,
            date_lte: new Date('2010-02-24'),
          });
          addContext(this, { title: 'found', value: found });
          expect(found.list.length).to.equal(2);
        });
        it('date_gte, date_lte 가 start_date 에 대해 동작해야 함', async function () {
          await Promise.allSettled([
            model.Application.create({ start_date: new Date('2010-02-23') }),
            model.Application.create({ start_date: new Date('2010-02-24') }),
            model.Application.create({ start_date: new Date('2010-02-25') }),
            model.Application.create({ start_date: new Date('2010-02-26') }),
          ]);
          const found = await db.getApplications({
            perpage: 30,
            date_gte: new Date('2010-02-24'),
            date_lte: new Date('2010-02-25'),
          });
          addContext(this, { title: 'found', value: found });
          expect(found.list.length).to.equal(2);
        });
        it('date_gte, date_lte 가 end_date 에 대해 동작하면 안 됨', async function () {
          await Promise.allSettled([
            model.Application.create({ end_date: new Date('2010-02-23') }),
            model.Application.create({ end_date: new Date('2010-02-24') }),
            model.Application.create({ end_date: new Date('2010-02-25') }),
            model.Application.create({ end_date: new Date('2010-02-26') }),
          ]);
          const found = await db.getApplications({
            perpage: 30,
            date_gte: new Date('2010-02-24'),
            date_lte: new Date('2010-02-25'),
          });
          addContext(this, { title: 'found', value: found });
          expect(found.list.length).to.equal(0);
        });
      });
      it('doc_status 가 제대로 동작해야 함', async function () {
        await Promise.allSettled([
          model.Application.create({ doc_status: 'not_applicable' }),
          model.Application.create({ doc_status: 'pending' }),
          model.Application.create({ doc_status: 'pending' }),
          model.Application.create({ doc_status: 'request_sended' }),
        ]);
        const found1 = await db.getApplications({
          perpage: 30,
          doc_status: ['not_applicable'],
        });
        const found2 = await db.getApplications({
          perpage: 30,
          doc_status: ['pending'],
        });
        const found3 = await db.getApplications({
          perpage: 30,
          doc_status: ['pending', 'request_sended'],
        });
        addContext(this, { title: 'found1', value: found1 });
        addContext(this, { title: 'found2', value: found2 });
        addContext(this, { title: 'found3', value: found3 });
        expect(found1.list.length).to.equal(1);
        expect(found2.list.length).to.equal(2);
        expect(found3.list.length).to.equal(3);
      });
      it('money_status 가 제대로 동작해야 함', async function () {
        await Promise.allSettled([
          model.Application.create({ money_status: 'not_applicable' }),
          model.Application.create({ money_status: 'pending_deposit' }),
          model.Application.create({ money_status: 'pending_deposit' }),
          model.Application.create({ money_status: 'invoice_done' }),
        ]);
        const found1 = await db.getApplications({
          perpage: 30,
          money_status: ['not_applicable'],
        });
        const found2 = await db.getApplications({
          perpage: 30,
          money_status: ['pending_deposit'],
        });
        const found3 = await db.getApplications({
          perpage: 30,
          money_status: ['pending_deposit', 'invoice_done'],
        });
        addContext(this, { title: 'found1', value: found1 });
        addContext(this, { title: 'found2', value: found2 });
        addContext(this, { title: 'found3', value: found3 });
        expect(found1.list.length).to.equal(1);
        expect(found2.list.length).to.equal(2);
        expect(found3.list.length).to.equal(3);
      });
      it('receipt_status 가 제대로 동작해야 함', async function () {
        await Promise.allSettled([
          model.Application.create({ receipt_status: 'not_applicable' }),
          model.Application.create({ receipt_status: 'pending' }),
          model.Application.create({ receipt_status: 'pending' }),
          model.Application.create({ receipt_status: 'done' }),
        ]);
        const found1 = await db.getApplications({
          perpage: 30,
          receipt_status: ['not_applicable'],
        });
        const found2 = await db.getApplications({
          perpage: 30,
          receipt_status: ['pending'],
        });
        const found3 = await db.getApplications({
          perpage: 30,
          receipt_status: ['pending', 'done'],
        });
        addContext(this, { title: 'found1', value: found1 });
        addContext(this, { title: 'found2', value: found2 });
        addContext(this, { title: 'found3', value: found3 });
        expect(found1.list.length).to.equal(1);
        expect(found2.list.length).to.equal(2);
        expect(found3.list.length).to.equal(3);
      });
      it('transrpot_status 가 제대로 동작해야 함', async function () {
        await Promise.allSettled([
          model.Application.create({ transport_status: 'online' }),
          model.Application.create({ transport_status: 'yet_to_delivery' }),
          model.Application.create({ transport_status: 'yet_to_delivery' }),
          model.Application.create({ transport_status: 'return_complete' }),
        ]);
        const found1 = await db.getApplications({
          perpage: 30,
          transport_status: ['online'],
        });
        const found2 = await db.getApplications({
          perpage: 30,
          transport_status: ['yet_to_delivery'],
        });
        const found3 = await db.getApplications({
          perpage: 30,
          transport_status: ['yet_to_delivery', 'return_complete'],
        });
        addContext(this, { title: 'found1', value: found1 });
        addContext(this, { title: 'found2', value: found2 });
        addContext(this, { title: 'found3', value: found3 });
        expect(found1.list.length).to.equal(1);
        expect(found2.list.length).to.equal(2);
        expect(found3.list.length).to.equal(3);
      });
      describe('search', function () {
        it('검색이 제대로 되어야 함.', async function () {
          await Promise.allSettled([
            model.Application.create({
              applicant_name: 'a',
              host: 'host',
              applicant_phone: '010-1234-5678',
            }),
            model.Application.create({
              applicant_name: 'b',
              film_title: 'film_title',
            }),
            model.Application.create({ applicant_name: 'ccccc' }),
            model.Application.create({
              applicant_name: 'd',
              applicant_phone: 'applicant_phone',
            }),
            model.Application.create({
              applicant_name: 'e',
              applicant_email: 'applicant_email',
            }),
            model.Application.create({
              applicant_name: 'f',
              destination: 'destination',
            }),
            model.Application.create({ applicant_name: 'g', memo: 'memo' }),
            model.Application.create({
              applicant_name: 'h',
              etc_req: 'etc_req',
            }),
          ]);
          const proms = await Promise.allSettled([
            db.getApplications({ perpage: 30, search: 'host' }),
            db.getApplications({ perpage: 30, search: 'film_title' }),
            db.getApplications({ perpage: 30, search: 'ccccc' }),
            db.getApplications({ perpage: 30, search: 'applicant_phone' }),
            db.getApplications({ perpage: 30, search: 'applicant_email' }),
            db.getApplications({ perpage: 30, search: 'destination' }),
            db.getApplications({ perpage: 30, search: 'memo' }),
            db.getApplications({ perpage: 30, search: 'etc_req' }),
          ]);
          const applicant_names = ['a', 'b', 'ccccc', 'd', 'e', 'f', 'g', 'h'];
          const results = proms.map((prom) => unwrap(prom, 'failed'));
          results.forEach((result, index) => {
            addContext(this, { title: `results[${index}]`, value: result });
            if (result === 'failed')
              throw new Error('Promise must be resolved');
            expect(result.list.length).to.equal(1);
            expect(result.list[0].applicant_name).to.equal(
              applicant_names[index],
            );
          });
        });
      });
      it('복합적으로 잘 동작해야 함 (transport_status, search', async function () {
        await Promise.allSettled([
          model.Application.create({
            transport_status: 'online',
            applicant_name: 'aa',
          }),
          model.Application.create({
            transport_status: 'online',
            applicant_name: 'aa',
          }),
          model.Application.create({
            transport_status: 'online',
            applicant_name: 'aa',
          }),
          model.Application.create({
            transport_status: 'yet_to_delivery',
            applicant_name: 'aa',
          }),
          model.Application.create({
            transport_status: 'yet_to_delivery',
            applicant_name: 'bb',
          }),
          model.Application.create({
            transport_status: 'return_complete',
            applicant_name: 'bb',
          }),
          model.Application.create({
            transport_status: 'return_complete',
            applicant_name: 'aa',
          }),
          model.Application.create({
            transport_status: 'return_complete',
            applicant_name: 'aa',
          }),
        ]);
        const found = await db.getApplications({
          perpage: 30,
          search: 'aa',
          transport_status: ['online', 'return_complete'],
        });
        addContext(this, { title: 'found', value: found });
        expect(found.list.length).to.equal(5);
      });
    });
    describe('createApplication', function () {
      it('제대로 동작해야 함', async function () {
        await db.createApplication({
          applicant_name: 'hi',
        });
        const found = await model.Application.find().lean().exec();
        addContext(this, { title: 'found', value: found });
        expect(found.length).to.equal(1);
      });
    });
    describe('removeApplication', function () {
      it('제대로 동작해야 함', async function () {
        const created = await model.Application.create({});
        await db.removeApplication(created.id);
        const found = await model.Application.find().lean().exec();
        addContext(this, { title: 'found', value: found });
        expect(found.length).to.equal(0);
      });
    });
    describe('updateApplication', function () {
      it('제대로 동작하는지 확인하기', async function () {
        const created = await model.Application.create({
          applicant_name: 'original',
        });
        await db.updateApplication(created.id, { applicant_name: 'changed' });
        const found = await model.Application.findOne({ id: created.id })
          .lean()
          .exec();
        addContext(this, { title: 'found', value: found });
        expect(found.applicant_name).to.equal('changed');
      });
    });
  });

  describe('api', function () {
    describe('Query', function () {
      describe('applicationAdmin', function () {
        it('제대로 동작해야 함', async function () {
          const created = await model.Application.create({
            applicant_name: 'hi',
          });
          await doAdminLogin(agent);
          const applicationAdminReq = makeSimpleQuery(
            agent,
            'applicationAdmin',
          );
          const res = await applicationAdminReq(
            { id: created.id },
            `{applicant_name}`,
          );
          addContext(this, { title: 'res', value: res });
          expect(res.applicant_name).to.equal('hi');
        });
      });
      describe('applicationsAdmin', function () {
        it('제대로 동작해야 함', async function () {
          await Promise.allSettled([
            model.Application.create({ applicant_name: 'hi' }),
            model.Application.create({ applicant_name: 'hi' }),
            model.Application.create({ applicant_name: 'ho' }),
            model.Application.create({ applicant_name: 'ho' }),
            model.Application.create({ applicant_name: 'ho' }),
          ]);
          await doAdminLogin(agent);
          const applicationsAdminReq = makeSimpleQuery(
            agent,
            'applicationsAdmin',
          );
          const res = await applicationsAdminReq(
            {
              condition: {
                page: 1,
                perpage: 2,
                search: 'ho',
              },
            },
            `{ total, list { applicant_name } }`,
          );
          addContext(this, { title: 'res', value: res });
          expect(res.list.length).to.equal(1);
          expect(res.list[0].applicant_name).to.equal('ho');
        });
      });
      describe('applicationTaxReq', function () {
        it('제대로 동작해야 함', async function () {
          const applicationTaxReqReq = makeSimpleQuery(
            agent,
            'applicationTaxReq',
          );
          const doc = await model.Application.create({ applicant_name: 'ho' });
          const d = new Date();
          const token = await model.Token.create({
            appl_id: doc.id,
            token: 'abcd',
            c_date: d,
            ttl: 100,
            purpose: 'taxinfo_request'
          });
          const res = await applicationTaxReqReq(
            { token: 'abcd' },
            `{success code doc { applicant_name reqdoc_token reqdoc_expire_date } }`,
          );
          addContext(this, { title: 'res', value: res});
          expect(res.success).to.equal(true);
          expect(res.code).to.not.be.a('string');
          expect(res.doc.applicant_name).to.equal('ho');
          expect(res.doc.reqdoc_token).to.equal('abcd');
          expect(new Date(res.doc.reqdoc_expire_date).getTime()).to.equal(
            d.getTime() + 100 * 1000,
          );
        });
        it('토큰이 없을 시 실패해야 함.', async function () {
          const doc = await model.Application.create({ applicant_name: 'ho' });
          const applicationTaxReqReq = makeSimpleQuery(
            agent,
            'applicationTaxReq',
          );
          const res = await applicationTaxReqReq(
            { token: 'abcd' },
            `{success code doc { applicant_name reqdoc_token reqdoc_expire_date } }`,
          );
          addContext(this, { title: 'res', value: res});
          expect(res.success).to.equal(false);
          expect(res.doc).to.equal(null);
        });
        it('유효기간이 다되었을 시 실패해야 함.', async function () {
          const applicationTaxReqReq = makeSimpleQuery(
            agent,
            'applicationTaxReq',
          );
          const doc = await model.Application.create({ applicant_name: 'ho' });
          const d = new Date();
          const token = await model.Token.create({
            appl_id: doc.id,
            token: 'abcd',
            c_date: d,
            ttl: 0,
            purpose: 'taxinfo_request'
          });
          const res = await applicationTaxReqReq(
            { token: 'abcd' },
            `{success code doc { applicant_name reqdoc_token reqdoc_expire_date } }`,
          );
          addContext(this, { title: 'res', value: res});
          expect(res.success).to.equal(false);
          expect(res.doc).to.equal(null);
        });
      });
    });
    describe('Mutation', function () {
      describe('submitApplication', function () {
        it('제대로 동작해야 함', async function () {
          const submitApplicationReq = makeSimpleMutation(agent, 'submitApplication');
        });
      });
      describe('submitTaxInformation', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('createApplication', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('removeApplication', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('updateApplication', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('updateNewTaxReqLink', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('removeTaxReqLink', function () {
        it('제대로 동작해야 함', async function () {
          await doAdminLogin(agent);
        });
      });
      describe('msg', function () {
        // todo
      });
    });
  });
});
