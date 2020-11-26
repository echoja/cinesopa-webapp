const fs = require('fs');
const path = require('path');

const pug = require('pug');

const templateMap = {};

fs.readdir(__dirname, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('# mail template - generate');
  console.log(files);
  files.filter((fileName) => fileName.endsWith('.pug')).forEach((file) => {
    const onlyName = path.parse(file).name;
    templateMap[onlyName] = new Promise((resolve, reject) => {
      
    });
  });
});


module.exports = (templateName, args) => {
  if (templateMap[templateName] === undefined) return 'no_such_template';
  if (templateMap[templateName] === null) {
    const str = fs.readFileSync(path.resolve(__dirname, `${templateName}.pug`));
    console.log(str);
    pug.compile()
  }
};
