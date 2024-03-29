const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const getPosts = async (req, res, next) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "Not logged in!"));
    }

    try {
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        let whereClause = {};

        if (userId && userId !== "undefined" && userId !== undefined && userId !== null) {
            whereClause = { usersid: parseInt(userId) };
        } else {
            const followedUsers = await db.relationships.findMany({
                where: { followerUserid: userInfo.id },
                select: { followedUserid: true },
            }).then((followedUsers) => followedUsers.map((user) => user.followedUserid));

            whereClause = {
                OR: [
                    { usersid: userInfo.id },
                    { usersid: { in: followedUsers } },
                ],
            };
        }

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
                shares: {
                    select: {
                        id: true,
                        postid: true,
                        createdAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                profilePic: true
                            }
                        },
                        post: {
                            select: {
                                id: true,
                                desc: true,
                                img: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        profilePic: true,
                                    }
                                }
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });




        return res.status(200).json(posts); // Corrected from `shares` to `posts`
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error!"));
    }
};


const addPost = async (req, res, next) => {
    const { desc, img } = req.body;

    const token = req.cookies.accessToken;
    if (!token)
        return next(createError(401, "Not logged in!"));

    jwt.verify(token, process.env.SECRET_KEY, async (err, userInfo) => {
        if (err) return  next(createError(403, "Token is not valid!"));

        try {
            const newPost = await db.posts.create({
                data: {
                    desc,
                    img,
                    createdAt: new Date(),
                    user: { connect: { id: userInfo.id } }  // Connect to the user who created the post
                }
            });

            return  next(createError(200, "Post has been created."));
        } catch (error) {
            console.error(error);
            return next(createError(500, "Internal server error!"));
        }
    });
};

const deletePost = async (req, res, next) => {
    try {
        // Verify user authentication
        const token = req.cookies.accessToken;
        if (!token) return next(createError(401, "Not logged in!"));

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Extract post ID from the request parameters
        const postId = req.params.id || req.query.id;

        if (!postId) return next(createError(400, "Post ID is required!"));

        // ลบไฟล์ที่เกี่ยวข้องในโฟลเดอร์ upload
        const post = await db.posts.findFirst({ where: { id: parseInt(postId) } });

        if (post && post.img) {
            const filePath = path.join(__dirname, '../../client/public/upload', post.img);
            console.log(filePath);
            try {
                await fs.promises.unlink(filePath); // Asynchronous file deletion
            } catch (unlinkError) {
                console.error(`Error deleting file: ${unlinkError.message}`);
            }
        }

        // Use Prisma to delete the post
        const deletedPost = await db.posts.deleteMany({
            where: {
                id: parseInt(postId),
                usersid: userInfo.id
            }
        });

        if (deletedPost.count === 0) {
            return next(createError(404, "Post not found!"));
        }

        return res.status(200).json({ message: "Post has been deleted." });
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error!"));
    }
};

module.exports = {
    getPosts,
    addPost,
    deletePost
};
