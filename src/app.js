const express = require("express");
const authroute = require("./routes/auth.route");
const postroute = require("./routes/post.route");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authroute);
app.use("/api/posts", postroute);

module.exports = app;