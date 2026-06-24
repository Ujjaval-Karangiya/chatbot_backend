const user = require("../modules/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

const registercontroller = async (req, res) => {
    try {

        const { name, email, phone, password } = req.body;
        const isexist = await user.findOne({
            email
        })
        if (isexist) {
            return res.json({
                massage: "user is already exist"
            })
        }
        const newuser = await user.create({
            name, email, phone, password: await bcrypt.hash(password, 10)
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
        console.log(err);
        res.json({
            massage: "internal server error"
        })

    }
}

const logincontroller = async (req, res) => {
    try {
        const { email, password } = req.body;
        const isexist = await user.findOne({
            email
        })
        if (!isexist) {
            return res.json({
                massage: "user is not exist"
            })
        }
        const ispasswordvalid = await bcrypt.compare(password, isexist.password)
        if (!ispasswordvalid) {
            return res.json({
                massage: "password is not valid"
            })
        }
        const token = jwt.sign({
            id: isexist._id
        }, process.env.jwt_secret);

        res.cookie("jwt", token);
        res.json({
            massage: "user logged in successfully",
            token
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            massage: "internal server error"
        })
    }

}


module.exports = { registercontroller, logincontroller };