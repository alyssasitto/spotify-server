const app = require("express")();

require("dotenv/config");
require("./config")(app);

module.exports = app;
