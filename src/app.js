const express = require("express");
const authroute = require("./routes/auth.route");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authroute);

module.exports = app;