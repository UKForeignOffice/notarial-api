const dotEnv = require("dotenv");

if (process.env.NODE_ENV !== "test") {
  dotEnv.config({ path: ".env" });
}

module.exports = {
  port: "9000",
  env: "development",
};
