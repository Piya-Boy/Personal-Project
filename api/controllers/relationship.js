const createError = require("../utils/createError");
const db = require("../config/connect.js"); 
const jwt = require("jsonwebtoken");

const getRelationships = async (req, res, next) => {
    try {
        const followedUserId = req.query.followedUserId || req.body.followedUserId;
        const followerUserIds = await db.relationships.findMany({
            where: {
                followedUserid: parseInt(followedUserId),
            },
            select: {
                followerUserid: true,
            },
        });

        // Extract followerUserIds from the result and send as JSON response
        const followerUserIdsArray = followerUserIds.map((relationship) => relationship.followerUserid);
        return res.status(200).json(followerUserIdsArray);
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const addRelationship = async (req, res, next) => {
    try {
    
        const { userId } = req.body || req.params;

        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return res.status(403).json("Token is not valid!");

        // Create a relationship in the database
        const newRelationship = await db.relationships.create({
            data: {
                followerUserid: userInfo.id,
                followedUserid: parseInt(userId), 
            }
        });

        return res.status(200).json("Following");
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
};

const deleteRelationship = async (req, res, next) => {
    // console.log(req.query.id || req.params.id);
    try {

        const { userId } = req.query.id || req.params.id;
        const token = req.cookies.accessToken;
        if (!token) return res.status(401).json("Not logged in!");

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);
        if (!userInfo) return res.status(403).json("Token is not valid!");

        // Delete the relationship from the database
        const deletedRelationship = await db.relationships.deleteMany({
            where: {
                followerUserid: userInfo.id,
                followedUserid: userId,
         }
        });

        if (deletedRelationship.count > 0) {
            return res.status(200).json("Unfollow");
        } else {
            return res.status(404).json("Relationship not found");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json("Internal server error");
    }
};

module.exports = {
    getRelationships,
    addRelationship,
    deleteRelationship
};
