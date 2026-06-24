const jwt = require("jsonwebtoken");
const user = require("../models/user.models");

const authmiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.json({
            massage: "user is not logged in"
        })
    }
    try {
        const verifiedtoken = jwt.verify(token, process.env.jwt_secret);
        const isuser = await user.findById(verifiedtoken.id).select("-password");
        if (!isuser) {
            return res.json({
                massage: "user is not exist"
            })
        }
        req.user = isuser;
        next();
    }
    catch (err) {
        console.log(err);
        res.json({
            massage: "invalid token please check agaon"
        })
    }
}
module.exports = authmiddleware;