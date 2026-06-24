const jwt = require("jsonwebtoken");
const user = require("../modules/user.model");

const authmiddleware = async (req, res, next) => {
    let token = req.cookies?.token;

    // Fallback: check Authorization header
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            massage: "user is not logged in"
        });
    }

    try {
        const verifiedtoken = jwt.verify(token, process.env.jwt_secret);
        const isuser = await user.findById(verifiedtoken.id).select("-password");
        if (!isuser) {
            return res.status(401).json({
                massage: "user is not exist"
            });
        }
        req.user = isuser;
        next();
    } catch (err) {
        console.log(err);
        res.status(401).json({
            massage: "invalid token please check agaon"
        });
    }
};

module.exports = authmiddleware;