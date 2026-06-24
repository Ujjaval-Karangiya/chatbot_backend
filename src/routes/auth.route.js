const express = require("express");
const user = require("../modules/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

router.post('/register', async (req, res) => {
    try {

        const { name, email, phone, password } = req.body;
        const isexist = await user.findOne({
            email
        })
        if (isexist) {
            res.json({
                massage: "user is already exist"
            })
        }
        const newuser = await user.create({
            name, email, phone, password
        })
        const token = jwt.sign({
            id: newuser._id
        }, process.env.jwt_secret);
        res.cookie("jwt", token);
        res.json({
            massage: "user created successfully",
            token
        })
    } catch (err) {
        console.log(error)
        res.json({
            massage: "internal server error"
        })

    }
})

module.exports = router;

