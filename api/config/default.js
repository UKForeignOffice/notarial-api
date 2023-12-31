const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotEnv.config({ path: ".env" });
}

module.exports = {
  port: "9000",
  env: "development",
  documentPassword: "Sup3rS3cr3tP4ssw0rd",
  submissionAddress: "pye@cautionyourblast.com",
  senderEmail: "pye@cautionyourblast.com",
  notifyApiKey: "",
  notifyTemplateStandard: "",
};
