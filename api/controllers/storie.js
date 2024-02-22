const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const getStories = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json("Not logged in!");
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        // console.log(userInfo.id);
        const stories = await db.stories.findMany({
            select: {
                id: true,
                img: true,
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
            take: 5
        });

        console.log(stories);
        return res.status(200).json(stories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


const addStory = async (req, res, next) => {
    const { img } = req.body;

    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json("Not logged in!");
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        const newStory = await db.stories.create({
            data: {
                img,
                userid: userInfo.id
            }
        });

        return res.status(200).json({ message: "Story has been created." });
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const deleteStory = (req, res, next) => {
    res.send("delete story");
};

module.exports = {
    getStories,
    addStory,
    deleteStory
};
