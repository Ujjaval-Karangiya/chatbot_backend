const mongo = require("mongoose");

const postSchema = new mongo.Schema({
    user: {
        type: mongo.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const post = mongo.model("post", postSchema);
module.exports = post;
