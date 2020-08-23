const Hangul = require('hangul-js');

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

  const result = Hangul.disassembleToString(strArray.join('').replace(/ /g, ''));
  console.log(`getFilmSearchStr: ${result}`);
  return result;
};

module.exports = {
  getFilmSearchStr,
};
