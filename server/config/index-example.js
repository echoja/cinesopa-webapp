const { readFileSync } = require("fs");

module.exports.privateKey = readFileSync(
  join(__dirname, "./config/server.key")
).toString();
module.exports.certificate = readFileSync(
  join(__dirname, "./config/server.crt")
).toString();
module.exports.sessionSecret = "thisissecretman";
module.exports.mongodbUrl = "mongodb://localhost/cinesopa";
