const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken"); 

const getshare = async (req, res, next) => {
    const postId = req.body.postId || req.query.postId;
    
    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "Not logged in!"));
    }

    try {

        const post = await db.posts.findFirst({
            where: {
                id: parseInt(postId),
            },
            select: {
                id: true,
                img: true,
                desc: true,
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

    // console.log(postId);

    const token = req.cookies.accessToken;

    if (!token) {
        return next(createError(401, "Not logged in!"));
    }

    const userInfo = jwt.verify(token, process.env.SECRET_KEY);

    try {

        const newshare = await db.shares.create({
            data: {
                userid: userInfo.id,
                postid: parseInt(postId),
                createdAt: new Date()
         }
        });


        return res.status(200).json(newshare);
        
    } catch (error) {
        return next(createError(500, "Internal server error!"));
    }
};

const deleteshare = async (req, res, next) => {
    try {
        
        const token = req.cookies.accessToken;

        if (!token) {
            return next(createError(401, "Not logged in!"));
        }

        const  shareid  = req.params.id;
    
        const deletedshare = await db.shares.deleteMany({
            where: {
                id: parseInt(shareid)
            }
        });

        return res.status(200).json(deletedshare);

    } catch (error) {
        return next(createError(500, "Internal server error!"));
    }
};

module.exports = {
    getshare,
    addshare,
    deleteshare
};