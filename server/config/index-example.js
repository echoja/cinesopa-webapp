const { readFileSync } = require("fs");
const { join } = require("path");

module.exports.privateKey = readFileSync(
  join(__dirname, "./server.key")
).toString();
module.exports.certificate = readFileSync(
  join(__dirname, "./server.crt")
).toString();
module.exports.sessionSecret = "thisissecret";
module.exports.mongodbUrl =
  "mongodb+srv://admin_821423:dJSgnQwmjBuoPClh@cinesopa-root-gpwhe.azure.mongodb.net/cinesopa?retryWrites=true&w=majority";
