const express = require("express");
const authroute = require("./routes/auth.route");
const postroute = require("./routes/post.route");
const cookieParser = require("cookie-parser");

const app = express();

// Custom CORS Middleware to allow requests from frontend port 5173
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));
app.use(cookieParser());
app.use("/api/auth", authroute);
app.use("/api/posts", postroute);

module.exports = app;