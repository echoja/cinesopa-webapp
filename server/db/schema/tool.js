const { getVariableValues } = require('graphql/execution/values');
const { search } = require('hangul-js');
const Hangul = require('hangul-js');
const { MongooseDocument, Schema } = require('mongoose');
const stripHtml = require('string-strip-html');

const searchArrToStr = (arr) =>
  Hangul.disassembleToString(arr.join('#').replace(/ /g, ''));

/**
 * 해당 객체에서 해당 필드를 가지는 요소를 뽑아옵니다.
 * @param {Object} obj 객체
 * @param {string} field field1.field2.field3 으로 이루어진 문자열
 */
const getValueOfField = (obj, field) => {
  // field 값이 잘못되었다면 그냥 null 리턴.
  if (field === null || field === '' || typeof field === 'undefined') {
    return null;
  }
  const pos = field.indexOf('.');

  // .이 없다면 바로 출력. undefined 일 경우 null 로 출력.
  if (pos === -1) {
    let value = obj[field];
    if (value === undefined) value = null;
    return value;
  }

  // .이 있다면 다음 요소 탐색
  const nextObj = obj[field.slice(0, pos)];
  const nextField = field.slice(pos + 1);

  // nextObj가 배열일 경우 하나하나에 대한 하위 필드를 모아서 리턴하도록 함.
  if (Array.isArray(nextObj)) {
    return nextObj.map((item) => getValueOfField(item, nextField));
  }

  // 배열이 아닐 경우에는 그냥 하위 필드를 재귀하여 리턴
  return getValueOfField(nextObj, nextField);
};

/**
 * 검색용으로 저장할 문자열을 생성합니다.
 * @param {MongooseDocument} doc
 * @param {string[]} fields nested 값은 .으로 표현. 예: ['a', 'b.c', 'd']
 */
const getSearchStr = (doc, fields) => {
  let arr = fields.map((field) => getValueOfField(doc, field));
  arr = arr.flat(Infinity);
  return searchArrToStr(arr);
};

/**
 *
 * @param {Filminfo} FilmDoc
 */
const getFilmSearchStr = (FilmDoc) => {
  return getSearchStr(FilmDoc, [
    'title',
    'title_en',
    'people.name',
    'people.name_en',
  ]);
};

const getPostSearchStr = (postDoc) => {
  // console.log(`getPostSearchStr called! title: ${postDoc.title}`);
  const strArray = [];
  const { title = '', content = '' } = postDoc;
  strArray.push(title);
  strArray.push(stripHtml(content).result);
  // const result = Hangul.disassembleToString(
  //   strArray.join('#').replace(/ /g, ''),
  // );
  // console.log(`result: ${result}`);
  return searchArrToStr(strArray);
};

/**
 * 해당 스키마에게 search 기능을 만드는 함수
 * @param {Schema} schema
 * @param {string} searchField
 *  @param {string[]} fields
 */
const makeSchemaHaveSearch = (schema, searchField, fields) => {
  schema.pre('save', function () {
    // console.log('++save middleware 호출되었슴');
    // this.prod_date.setHours(0, 0, 0);
    // this.open_date.setHours(0, 0, 0);
    this[searchField] = getSearchStr(this, fields);
  });

  schema.post('updateOne', async function () {
    // console.log('++film updateOne middleware 호출되었슴');
    const docToUpdate = await this.model.findOne(this.getFilter());
    if (docToUpdate) await docToUpdate.save();
  });
};

module.exports = {
  getFilmSearchStr,
  getPostSearchStr,
  getValueOfField,
  makeSchemaHaveSearch,
};
