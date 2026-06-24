const user = require("../modules/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const registercontroller = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validation checks
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                massage: "All fields (name, email, phone, password) are required",
                message: "All fields (name, email, phone, password) are required"
            });
        }

        const isexist = await user.findOne({
            $or: [{ email }, { phone }, { name }]
        });

        if (isexist) {
            let message = "user already exists";
            if (isexist.email === email) {
                message = "user with this email already exists";
            } else if (isexist.phone === phone) {
                message = "user with this phone number already exists";
            } else if (isexist.name === name) {
                message = "user with this name already exists";
            }
            return res.status(400).json({
                massage: message
            });
        }

        const newuser = await user.create({
            name,
            email,
            phone,
            password: await bcrypt.hash(password, 10)
        });

        const token = jwt.sign({
            id: newuser._id
        }, process.env.jwt_secret);

        res.cookie("token", token);
        res.status(201).json({
            massage: "user created successfully",
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage: "internal server error"
        });
    }
};

const logincontroller = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation checks
        if (!email || !password) {
            return res.status(400).json({
                massage: "Email and password are required"
            });
        }

        const isexist = await user.findOne({
            email
        });

        if (!isexist) {
            return res.status(401).json({
                massage: "user is not exist"
            });
        }

        const ispasswordvalid = await bcrypt.compare(password, isexist.password);
        if (!ispasswordvalid) {
            return res.status(401).json({
                massage: "password is not valid"
            });
        }

        const token = jwt.sign({
            id: isexist._id
        }, process.env.jwt_secret);

        res.cookie("token", token);
        res.status(200).json({
            massage: "user logged in successfully",
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            massage: "internal server error"
        });
    }
};

module.exports = { registercontroller, logincontroller };