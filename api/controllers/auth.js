const db = require("../config/connect.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

const register = async (req, res, next) => {
    const { username, password, email, name } = req.body;

    try {
        const existingUser = await db.users.findUnique({
            where: { username: username }
        });

        if (existingUser) {
            return next(createError(409, "User already exists"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = await db.users.create({
            data: {
                username: username,
                email: email,
                password: hashPassword,
                name: name
            }
        });

        return res.status(200).json("User has been created.");
    } catch (error) {
        return next(createError(500, error.message));
    }
};

const login = async (req, res, next) => {
    const { username, password: userPassword } = req.body; // Renamed password to userPassword

    try {
        const user = await db.users.findUnique({
            where: { username: username }
        });

        if (!user) {
            return next(createError(404, "User not found"));
        }

        const checkPassword = bcrypt.compareSync(userPassword, user.password); // Used userPassword instead of password

        if (!checkPassword) {
            return next(createError(400, "Wrong password or username!"));
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

        const { password, ...others } = user;

        res.cookie("accessToken", token, {
            httpOnly: true
        });

        return res.status(200).json(others);

    } catch (error) {
        return next(createError(500, error.message));
    }
};

const logout = (req, res, next) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none",
    });
    return res.status(200).json("User has been logged out.");
};

module.exports = {
    register,
    login,
    logout
};
