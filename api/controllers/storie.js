const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const getStories = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return next(createError(401, "Not logged in!"));
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        const stories = await db.stories.findMany({
            select: {
                id: true,
                img: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            where: {
                user: {
                    followedBy: {
                        some: {
                            followerUserid: userInfo.id
                        }
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },

            take: 5
        });

        return res.status(200).json(stories);
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};


const addStory = async (req, res, next) => {
    const { img } = req.body;

    try {
        // Check if user is logged in
        const token = req.cookies.accessToken;
        if (!token) {
            return next(createError(401, "Not logged in!"));
        }

        // Verify user information from token
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // Validate image data
        if (!img) {
            return next(createError(400, "Image data is required!"));
        }

        // Create new story
        const newStory = await db.stories.create({
            data: {
               img: img,
                createdAt: new Date(),
                userid: userInfo.id
            }
        });

        return res.status(200).json({ message: "Story has been created.", newStory });
    } catch (error) {
        console.error(error);
        return next(createError(500, "Internal server error"));
    }
};

// fetch story
const fetchStory = async (req, res, next) => {
    try {
        const stories = await db.stories.findMany({
            select: {
                id: true,
                createdAt: true,
            }
        });
    } catch (error) {
        return next(createError(500, "Internal server error"));
    }
};

const deleteStory = async (req, res, next) => {
    try {
        
        const storyId = req.params.id;
        // console.log(storyId);

        // ลบไฟล์ที่เกี่ยวข้องในโฟลเดอร์ upload
        const story = await db.stories.findFirst({
            where: {
                id: parseInt(storyId),
            }
        });

        console.log(story);

        if (story && story.img) {
            const filePath = path.join(__dirname, '../../client/public/upload', story.img);
            try {
                fs.unlinkSync(filePath);
            } catch (unlinkError) {
                // console.error(`Error deleting file: ${unlinkError.message}`);/
                return next(createError(500, "Internal server error"));
            }
        };

        // Delete the specified story

        const deletedStory = await db.stories.delete({
            where: {
                id: parseInt(storyId),
            },
        });

        if (deletedStory) {
            res.status(200).json({ message: "Story has been deleted!" });
        } else {
            return next(createError(403, "You are not authorized to delete this story!"));
        }

    } catch (error) {
        console.error(error);
        next(createError(500, "Internal server error"));
    }
};

module.exports = {
    getStories,
    addStory,
    fetchStory,
    deleteStory
};
