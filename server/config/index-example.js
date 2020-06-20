const { join, resolve } = require("path");
const { readFileSync } = require("fs");

const _dirname = resolve();

module.exports.privateKey = readFileSync(
  join(_dirname, "./config/server.key")
).toString();
module.exports.certificate = readFileSync(
  join(_dirname, "./config/server.crt")
).toString();
module.exports.passphrase = "13241324";
module.exports.sessionSecret = "thisissecretman";
module.exports.mongodbUrl = "mongodb://localhost/cinesopa";
