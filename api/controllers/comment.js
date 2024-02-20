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

const deleteComment = async (req, res, next) => {
    // console.log(req.params.id);
    try {
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not authenticated!");

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return res.status(403).json("Token is not valid!");

        const commentId = req.params.id || req.query.id;

        const deletedComment = await db.comments.delete({
            where: {
                id: parseInt(commentId),
                usersid: userInfo.id, // Ensure the user owns the comment
            },
        });

        if (deletedComment) {
            return res.json("Comment has been deleted!");
        } else {
            return res.status(403).json("You can delete only your comment!");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { desc } = req.body;

        // console.log(id, desc);

        const updatedComment = await db.comments.update({
            where: {
                id: parseInt(id),
            },
            data: {
                desc: desc,
            },
        });

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.json(updatedComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getComments,
    addComment,
    deleteComment,
    updateComment
};
