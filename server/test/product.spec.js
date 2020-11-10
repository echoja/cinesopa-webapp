const { expect } = require('chai');
// const {} = require('./graphql-request');
const {
  initTestServer,
  graphqlSuper,
  doLogout,
  doAdminLogin,
  doGuestLogin,
  adminEamil,
  guestEmail,
} = require('./tool');
const { graphql } = require('graphql');
const { model, db } = require('../loader');

const createProductMutation = `
mutation createProductMutation($input: ProductInput!) {
  createProduct(input: $input) {
    success 
  }
}
`;
const updateProductMutation = `
mutation updateProductMutation($id: Int!, $input: ProductInput!) {
  updateProduct(id: $id, input: $input) {
    success 
  }
}
`;
const removeProductMutation = `
mutation removeProductMutation($id: Int!) {
  removeProduct(id: $id) {
    success 
  }
}
`;

const prodBlock = `{
  product_type
  featured_image_url
  featured_image_alt
  content_main
  content_sub
  side_phrase
  notice
  name
  options {
    id
    content
    left
    price
  }
  related_film {
    poster_url
    title
    title_en
    prod_date
    open_date
    genres
    show_time
    people {
      role_type
      name
      role
    }
    watch_grade
    synopsis
  }
}`;

const productQuery = `
query productQuery($id: Int!) {
  product(id: $id) ${prodBlock}
}
`;

const productAdminQuery = `
query productAdminQuery($id: Int!) {
  productAdmin(id: $id) ${prodBlock}
}
`;

const productsQuery = `
query productsQuery($condition: ProductSearch!) {
  products(condition: $condition) {
    total
    list ${prodBlock}
  }
}`;

const productsAdminQuery = `
query productsAdminQuery($condition: ProductSearch!) {
  productsAdmin(condition: $condition) {
    total
    list ${prodBlock}
  }
}`;

describe('product', function () {
  // eslint-disable-next-line mocha/no-setup-in-describe
  const { agent } = initTestServer({ before, beforeEach, after, afterEach });
  describe('db', function () {
    describe('getProduct', function () {
      it('잘 동작해야 함.', async function () {
        const result = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const { id } = result;
        const found = await db.getProduct(id);
        console.log(found);
        expect(found.content_main).to.equal('cm');
      });
    });
    describe('getProducts', function () {
      beforeEach('항목들 만들어놓기', async function () {
        await model.Product.create({
          content_main: '1',
          product_type: 'sopakit',
        });
        await model.Product.create({
          content_main: 'cm',
        });
        await model.Product.create({
          content_main: 'cm',
          kit_title: 'kt',
          product_type: 'sopakit',
        });
        await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
        });
        await model.Product.create({
          kit_number: 'kn',
          kit_title: 'kt',
        });
        await model.Product.create({
          content_main: 'cm',
          kit_title: 'kt',
          kit_number: 'I2SPECITAL',
          product_type: 'sopakit',
        });
        await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'IAmSpecial!!',
        });
        await model.Product.create({
          content_main: 'cm',
          kit_title: 'kt',

          product_type: 'sopakit',
        });
        await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
        });
      });
      it('아무런 조건이 없을 때 잘 동작해야 함.', async function () {
        const result = await db.getProducts();
        const result2 = await db.getProducts({});
        // console.log(result);
        expect(result.total).to.equal(9);
        expect(result.list.length).to.equal(9);
        expect(result2.total).to.equal(9);
        expect(result2.list.length).to.equal(9);
      });
      it('page, perpage 잘 동작해야 함.', async function () {
        const result = await db.getProducts({ perpage: 2, page: 3 });
        // console.log(result);
        expect(result.total).to.equal(9);
        expect(result.list.length).to.equal(2);
        expect(result.list[0].kit_number).to.equal('IAmSpecial!!');
      });
      it('product_type이 잘 동작해야 함.', async function () {
        const result = await db.getProducts({ product_type: 'sopakit' });
        // console.log(result);
        expect(result.total).to.equal(4);
        expect(result.list.length).to.equal(4);
      });
      it('복합적으로 잘 동작해야 함.', async function () {
        const result = await db.getProducts({
          product_type: 'sopakit',
          perpage: 1,
          page: 2,
        });
        // console.log(result);
        expect(result.total).to.equal(4);
        expect(result.list.length).to.equal(1);
        expect(result.list[0].kit_number).to.equal('I2SPECITAL');
      });
    });
    describe('createProduct', function () {
      it('잘 동작해야 함', async function () {
        await db.createProduct({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const res = await model.Product.findOne({ content_main: 'cm' })
          .lean()
          .exec();
        expect(res.content_sub).to.equal('cs');
      });
    });
    describe('updateProduct', function () {
      it('잘 동작해야 함. 수정되지 않는 부분은 유지되어야 함.', async function () {
        const product = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const result = await db.updateProduct(product.id, {
          content_main: 'hello_world',
          kit_number: '1234',
        });
        // console.log(result);
        const updated = await model.Product.findOne({ id: product.id })
          .lean()
          .exec();
        expect(updated.content_main).to.equal('hello_world');
        expect(updated.content_sub).to.equal('cs');
        expect(updated.kit_number).to.equal('1234');
        expect(updated.kit_title).to.equal('kt');
      });
      it('관련된 cartitem 의 정보도 갱신되어야 함.', async function () {
        const ci = await model.Cartitem.create({
          options: [
            {
              id: 'hello',
              content: 'abc',
              price: 123,
            },
          ],
        });
        const prod = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
          related_cartitems: [ci.id],
          product_type: 'sopakit',
          name: '슈펴사품',
          featured_image_url: 'https://ho',
          featured_image_alt: '이미지설명',
        });
        const result = await db.updateProduct(prod.id, {
          featured_image_url: 'helloworld',
        });
        const afterCi = await model.Cartitem.findOne({ id: ci.id })
          .lean()
          .exec();
        // const afterProd = await model.Product.findOne({id: ci.id}).lean().exec();
        expect(afterCi.product.featured_image_url).to.equal('helloworld');
      });
      it('관련된 cartitem 이 존재하지 않을 때 오류가 나지 않고 해당 cartitem id 가 삭제되어야 함.', async function () {
        const ci = await model.Cartitem.create({
          options: [
            {
              id: 'hello',
              content: 'abc',
              price: 123,
            },
          ],
        });
        const ci2 = await model.Cartitem.create({
          options: [
            {
              id: 'hello',
              content: 'abc',
              price: 123,
            },
          ],
        });
        const prod = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
          related_cartitems: [5, 6, 7, ci.id, ci2.id, 100, 101, 102, 103],
          product_type: 'sopakit',
          name: '슈펴사품',
          featured_image_url: 'https://ho',
          featured_image_alt: '이미지설명',
        });
        const result = await db.updateProduct(prod.id, {
          featured_image_url: 'helloworld',
        });
        expect(result.success).to.be.true;

        const afterProd = await model.Product.findOne({ id: prod.id })
          .lean()
          .exec();
        expect(afterProd.related_cartitems.length).to.equal(2);
      });
    });
    describe('removeProduct', function () {
      it('잘 동작해야 함', async function () {
        const item = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const { id } = item;
        await db.removeProduct(id);
        const items = await model.Product.find().lean().exec();
        expect(items.length).to.equal(0);
      });
    });
  });
  describe('api', function () {
    describe('product', function () {
      it('제대로 동작해야 함', async function () {
        const film = await model.Film.create({
          title: '하이',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 1024,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const filmId = film.id;
        const product = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: filmId,
        });
        const productId = product.id;

        const res = await graphqlSuper(agent, productQuery, { id: productId });
        const result = res.body.data.product;
        // console.log(result);
        expect(result.product_type).to.equal('sopakit');
        expect(result.featured_image_url).to.equal('123');
        expect(result.featured_image_alt).to.equal('234');
        expect(result.content_main).to.equal('345');
        expect(result.content_sub).to.equal('45');
        expect(result.side_phrase).to.equal('567');
        expect(result.notice).to.equal('678');
        expect(result.name).to.equal('슈퍼파워 소파킷이다.');
        expect(result.related_film).to.include({
          title: '하이',
          title_en: '호호',
          show_time: 1024,
        });
      });
    });
    describe('products', function () {
      it('제대로 동작해야 함', async function () {
        const film = await model.Film.create({
          title: '하이',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 1024,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const filmId = film.id;
        const product = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: filmId,
        });
        const productId = product.id;

        const film2 = await model.Film.create({
          title: '난다',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 2048,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const film2Id = film2.id;
        const product2 = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: film2Id,
        });
        const product2Id = product.id;

        const res = await graphqlSuper(agent, productsQuery, {
          condition: {
            page: 1,
            perpage: 1,
          },
        });
        // console.log(res.body)
        const result = res.body.data.products;
        expect(result.total).to.equal(2);
        expect(result.list.length).to.equal(1);
        expect(result.list[0].featured_image_url).to.equal('123');
      });
    });
    describe('productAdmin', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const film = await model.Film.create({
          title: '하이',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 1024,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const filmId = film.id;
        const product = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: filmId,
        });
        const productId = product.id;

        const res = await graphqlSuper(agent, productAdminQuery, {
          id: productId,
        });
        const result = res.body.data.productAdmin;
        // console.log(result);
        expect(result.product_type).to.equal('sopakit');
        expect(result.featured_image_url).to.equal('123');
        expect(result.featured_image_alt).to.equal('234');
        expect(result.content_main).to.equal('345');
        expect(result.content_sub).to.equal('45');
        expect(result.side_phrase).to.equal('567');
        expect(result.notice).to.equal('678');
        expect(result.name).to.equal('슈퍼파워 소파킷이다.');
        expect(result.related_film).to.include({
          title: '하이',
          title_en: '호호',
          show_time: 1024,
        });
      });
    });
    describe('productsAdmin', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const film = await model.Film.create({
          title: '하이',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 1024,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const filmId = film.id;
        const product = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: filmId,
        });
        const productId = product.id;

        const film2 = await model.Film.create({
          title: '난다',
          title_en: '호호',
          prod_date: new Date('2010-10-12'),
          open_date: new Date('2015-10-12'),
          genres: ['잔인해'],
          show_time: 2048,
          people: {
            role_type: 'director',
            name: '김감독',
          },
        });
        const film2Id = film2.id;
        const product2 = await model.Product.create({
          product_type: 'sopakit',
          featured_image_url: '123',
          featured_image_alt: '234',
          content_main: '345',
          content_sub: '45',
          side_phrase: '567',
          notice: '678',
          name: '슈퍼파워 소파킷이다.',
          related_film: film2Id,
        });
        const product2Id = product.id;

        const res = await graphqlSuper(agent, productsAdminQuery, {
          condition: {
            page: 1,
            perpage: 1,
          },
        });
        // console.log(res.body)
        const result = res.body.data.productsAdmin;
        expect(result.total).to.equal(2);
        expect(result.list.length).to.equal(1);
        expect(result.list[0].featured_image_url).to.equal('123');
      });
    });
    describe('createProduct', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const res = await graphqlSuper(agent, createProductMutation, {
          input: {
            content_main: 'cm',
            content_sub: 'cs',
            kit_number: 'kn',
            kit_title: 'kt',
          },
        });
        const result = res.body.data.createProduct;
        // console.log(result);
        expect(result.success).to.be.true;
      });
    });
    describe('updateProduct', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const doc = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const res = await graphqlSuper(agent, updateProductMutation, {
          id: doc.id,
          input: { content_sub: 'cs2', kit_number: 'kn2' },
        });
        const result = res.body.data.updateProduct;
        // console.log(result);
        expect(result.success).to.be.true;

        const updated = await model.Product.findOne({ id: doc.id });
        expect(updated.content_main).to.equal('cm');
        expect(updated.content_sub).to.equal('cs2');
        expect(updated.kit_number).to.equal('kn2');
        expect(updated.kit_title).to.equal('kt');
      });
    });
    describe('removeProduct', function () {
      it('제대로 동작해야 함', async function () {
        await doAdminLogin(agent);
        const doc = await model.Product.create({
          content_main: 'cm',
          content_sub: 'cs',
          kit_number: 'kn',
          kit_title: 'kt',
        });
        const res = await graphqlSuper(agent, removeProductMutation, {
          id: doc.id,
        });
        const result = res.body.data.removeProduct;
        // console.log(result);
        expect(result.success).to.be.true;

        const found = await model.Product.find().lean().exec();
        expect(found.length).to.equal(0);
      });
    });
  });
});
