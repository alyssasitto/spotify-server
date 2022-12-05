const app = require("express")();

require("dotenv/config");
require("./config")(app);

const authRoutes = require("./routes/auth.routes");
app.use("/", authRoutes);

const spotifyRoutes = require("./routes/spotify.routes");
app.use("/", spotifyRoutes);

module.exports = app;
