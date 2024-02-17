const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");

const getUser = async (req, res, next) => {

    try {
        // console.log(req.params.userId)
        const userInfo = await db.users.findUnique({
            where: {
                id: parseInt(req.params.userId)
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                profilePic: true,
                coverPic: true
            }
        });

        if (!userInfo) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(userInfo);
    }catch (error) {
     return res.status(500).json({ error: "Internal server error" });
    }
}

const updateUser = async (req, res, next) => {
    console.log(req.body);
    
    const { username, password, email, name , city, website, profilePic, coverPic} = req.body;
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ error: "Not authenticated!" });
        }

        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        const updatedUser = await db.users.update({
            where: {
                id: userInfo.id,
            },
            data: {
                username,
                password,
                email,
                name,
                city,
                website,
                profilePic,
                coverPic
            },
        });

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found or not authorized to update." });
        }

        return res.status(200).json({ message: "User information updated successfully.", user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(403).json({ error: "Token is not valid!" });
    }
};

module.exports = {
    getUser,
    updateUser
}