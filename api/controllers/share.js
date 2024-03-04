const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");

const getshare = async (req, res, next) => {
    const postId = parseInt(req.query.postid); // แปลงเป็นตัวเลข

    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "Not logged in!"));
    }

    try {

        const post = await db.posts.findFirst({
            where: {
                id: postId
            },
            select: {
                id: true,
                img: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        profilePic: true
                    }
                }
            }
        });

        return res.status(200).json(post);

    } catch (error) {
        return next(createError(500, "Internal server error!"));
    }
};


const addshare = async ( req, res, next) => {
    const { postId } = req.body;

    console.log(postId);

    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "Not logged in!"));
    }

    const userInfo = jwt.verify(token, process.env.SECRET_KEY);

    try {

        // const newshare = await db.shares.create({
        //     data: {
        //         userid: userInfo.id,
        //         postid: parseInt(postId)
        //     }
        // });


        // return res.status(200).json(newshare);
        
    } catch (error) {
        return next(createError(500, "Internal server error!"));
    }
};

const deleteshare = async (req, res, next) => {
    
};

module.exports = {
    getshare,
    addshare,
    deleteshare
};