const Post = require("../modules/post.model");
const { generatecaption_title } = require("../services/google.service");

const postcontroller = async (req, res) => {
    try {
        let base64Data = "";
        let mimeType = "";
        let mediaDataUrl = "";

        const file = req.file || (req.files && req.files[0]);

        if (file) {
            // Case 1: Uploaded via form-data (multer)
            const imagebuffer = file.buffer;
            base64Data = imagebuffer.toString("base64");
            mimeType = file.mimetype;
            mediaDataUrl = `data:${mimeType};base64,${base64Data}`;
        } else if (req.body.image) {
            // Case 2: Passed as base64 string or data URL in JSON body
            const inputImage = req.body.image.trim();
            const matches = inputImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-+.]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                mimeType = matches[1];
                base64Data = matches[2];
                mediaDataUrl = inputImage;
            } else {
                // Fallback for raw base64 string without data prefix
                mimeType = req.body.mimeType || "image/jpeg";
                base64Data = inputImage;
                mediaDataUrl = `data:${mimeType};base64,${base64Data}`;
            }
        } else {
            return res.status(400).json({
                massage: "No media file uploaded or image base64 provided"
            });
        }

        const user = req.user;

        // Generate roast-based title and caption
        const aiResult = await generatecaption_title(base64Data, mimeType);

        const post = new Post({
            user: user.id || user._id,
            title: aiResult.title,
            content: aiResult.caption,
            image: mediaDataUrl
        });

        await post.save();

        res.status(201).json({
            massage: "post created successfully with roast content",
            title: aiResult.title,
            caption: aiResult.caption,
            post
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            massage: "internal server error"
        });
    }
};

const getpostscontroller = async (req, res) => {
    try {
        const posts = await Post.find().populate("user", "name email phone").sort({ createdAt: -1 });
        res.status(200).json({
            massage: "posts retrieved successfully",
            posts
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            massage: "internal server error"
        });
    }
};

module.exports = { postcontroller, getpostscontroller };