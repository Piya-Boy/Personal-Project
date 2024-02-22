const createError = require("../utils/createError");
const db = require("../config/connect.js");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
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
                coverPic: true,
                city: true,
                website: true
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
    // console.log(req.body);
    
    const { username, password, email, name , city, website, profilePic, coverPic} = req.body;
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ error: "Not authenticated!" });
        }
        const userInfo = jwt.verify(token, process.env.SECRET_KEY);

        const userss = await db.users.findFirst({
            where: {
                id: parseInt(userInfo.id)
            }
        })

        if (userss.profilePic !== profilePic){
            const filePath = path.join(__dirname, '../../client/public/', 'upload', userss.profilePic);
            try {
                await fs.promises.unlink(filePath); // Asynchronous file deletion
            } catch (unlinkError) {
                console.error(`Error deleting file: ${unlinkError.message}`);
            }
        }

        if(userss.coverPic !== coverPic){
            const filePath = path.join(__dirname, '../../client/public/', 'upload', userss.coverPic);
            try {
                await fs.promises.unlink(filePath); // Asynchronous file deletion
            }catch (unlinkError) {
                console.error(`Error deleting file: ${unlinkError.message}`);
            }
        }


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

// get user data for search
const fetchUser = async (req, res, next) => {
    try {
        const users = await db.users.findMany(
            {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    profilePic: true
                }
            }
        );
        return res.status(200).json(users);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    getUser,
    updateUser,
    fetchUser
}