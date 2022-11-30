const app = require("express")();

require("dotenv/config");
require("./config")(app);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

module.exports = app;
