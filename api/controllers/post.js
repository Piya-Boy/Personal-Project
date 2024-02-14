const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");

const getPosts = async (req, res, next) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Not logged in!" });
    }

    try {
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);


        console.log(userId);

        const posts = await db.posts.findMany({
            select: {
                id: true,
                desc: true,
                img: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true,
                    },
                },
            },
            where: userId !== "undefined" ? { usersid: parseInt(userId) } : {
                OR: [
                    { usersid: userInfo.id },
                    {
                        usersid: {
                            in: {
                                select: {
                                    followedUserId: true,
                                },
                                where: {
                                    followerUserId: userInfo.id,
                                },
                            },
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: "Token is not valid!" });
    }
};
const addPost = async (req, res, next) => {
    const { desc, img } = req.body;

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json({ error: "Not logged in!" });

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if (err) return res.status(403).json({ error: "Token is not valid!" });

        try {
            const newPost = await db.posts.create({
                data: {
                    desc,
                    img,
                    createdAt: new Date(),
                    user: { connect: { id: userInfo.id } }  // Connect to the user who created the post
                }
            });

            return res.status(200).json({ message: "Post has been created." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Error creating the post." });
        }
    });
};

const deletePost = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json({ error: "Not logged in!" });

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from the request parameters
        const postId = req.params.id || req.query.id;
console.log(postId);

        if (!postId) return res.status(400).json({ error: "Invalid post ID!" });

        // Use Prisma to delete the post
        const deletedPost = await db.posts.deleteMany({
            where: {
                id: parseInt(postId),
                usersid: userInfo.id
            }
        });

        if (deletedPost.count === 0) {
            return res.status(403).json({ error: "You can delete only your post" });
        }

        return res.status(200).json({ message: "Post has been deleted." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getPosts,
    addPost,
    deletePost
};
