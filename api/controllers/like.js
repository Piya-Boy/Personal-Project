const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const getLikes = async (req, res, next) => {
    try {
        const postId = req.body.postId || req.query.postId;
        if (!postId) {
            return res.status(400).json({ error: "Invalid postId parameter" });
        }

        const likes = await db.likes.findMany({
            where: {
                postid: parseInt(postId)
            },
            select: {
                userid: true
            }
        });

        const userIds = likes.map(like => like.userid);
        return res.status(200).json(userIds);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const addLike = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from request body or query parameters
        const postId = req.body.postId || req.query.postId;
        if (!postId) {
            return res.status(400).json({ error: "Post ID is required!" });
        }

        // Create new like using Prisma
        const newLike = await db.likes.create({
            data: {
                userid: userInfo.id,
                postid: parseInt(postId)
            }
        });

        return res.status(200).json({ message: "Post has been liked." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteLike = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ error: "Not logged in!" });
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from request query parameters
        const postId = req.params.id || req.query.id;

        // console.log(postId );

        if (!postId) {
            return res.status(400).json({ error: "Post ID is required!" });
        }

        // Delete the like using Prisma
        const deletedLike = await db.likes.deleteMany({
            where: {
                userid: userInfo.id,
                postid: parseInt(postId)
            }
        });

        if (deletedLike.count === 0) {
            return res.status(404).json({ error: "Like not found!" });
        }

        return res.status(200).json({ message: "Post has been disliked." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getLikes,
    addLike,
    deleteLike
};
