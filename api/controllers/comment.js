const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");

const getComments = async (req, res, next) => {
    try {
        // Extract post ID from the request query parameters
        const postId = req.query.postId || req.body.postId;
        if (!postId) return res.status(400).json({ error: "Invalid post ID!" });

        // console.log(postId);

        // Retrieve comments associated with the specified post ID
        const comments = await db.comments.findMany({
            where: {
                postid: parseInt(postId),
            },
            select: {
                id: true,
                desc: true,
                createdAt: true,
                usersid: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });



        return res.status(200).json(comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const addComment = async (req, res, next) => {
    try {
        const { desc, postId } = req.body;
        const token = req.cookies.accessToken;

        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        const newComment = await db.comments.create({
            data: {
                desc,
                createdAt: new Date(),
                usersid: userInfo.id,
                postid: postId
            }
        });

        return res.status(200).json(newComment);
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
};


const deleteComment = (req, res, next) => {
    res.send("delete comment");
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};
