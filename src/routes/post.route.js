const express = require("express");
const authmiddleware = require("../middleware/auth.middleware");
const multer = require("multer");
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const { postcontroller, getpostscontroller } = require("../controllers/post.controller");

router.post("/", authmiddleware, upload.any(), postcontroller);
router.get("/", authmiddleware, getpostscontroller);

module.exports = router;