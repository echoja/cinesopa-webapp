const Hangul = require('hangul-js');
const stripHtml = require('string-strip-html');

/**
 *
 * @param {Filminfo} FilmDoc
 */
const getFilmSearchStr = (FilmDoc) => {
  const strArray = [];
  strArray.push(FilmDoc.title);
  strArray.push(FilmDoc.title_en);
  if (FilmDoc.people) {
    FilmDoc.people.forEach((person) => {
      strArray.push(person.name);
      strArray.push(person.name_en);
    });
  }

  const result = Hangul.disassembleToString(strArray.join('#').replace(/ /g, ''));
  console.log(`getFilmSearchStr: ${result}`);
  return result;
};

const getPostSearchStr = (postDoc) => {
  console.log(`getPostSearchStr called! title: ${postDoc.title}`);
  const strArray = [];
  strArray.push(postDoc.title);
  strArray.push(stripHtml(postDoc.content).result);
  const result = Hangul.disassembleToString(strArray.join('#').replace(/ /g, ''));
  return result;
};

module.exports = {
  getFilmSearchStr,
  getPostSearchStr,
};
