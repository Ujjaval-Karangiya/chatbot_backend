const mongo = require("mongoose");
require("dotenv").config();

function connectDB() {
    mongo.connect(process.env.mongo)
        .then(() => {
            console.log("mongo is ready for store")
        }).catch((err) => {
            console.log("there is an error" + err)
        })
}

module.exports = connectDB