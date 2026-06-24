const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const postcontroller = require("../controllers/post.controller");

router.post("/", authmiddleware, upload.single("image"), postcontroller);



module.exports = router;