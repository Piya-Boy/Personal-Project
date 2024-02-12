const db = require("../config/connect.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const joi = require("joi");
const createError = require("../utils/createError");

const register = async (req, res, next) => {
    const { username, password, email, name } = req.body;

    if (!(username.trim() && password.trim() && email.trim() && name.trim())) {
        return next(createError(400, "Please fill in all fields"));
    }
    // Validate the user input
    const schema = joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().email().required(),
        name: joi.string().required()
    });

    const { error } = schema.validate({ username, password, email, name });

    if (error) {
        return next(createError(400, error.details[0].message));
    }

    try {
        // Check if the user already exists
        const existingUser = await db.users.findUnique({
            where: { username: username }
        });

        if (existingUser) {
            return next(createError(409, "User already exists"));
        }

        // If the user does not exist, proceed with user creation
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

        if (!newUser) {
            return next(createError(500, "Failed to create user"));
        }

        return res.status(200).json("User has been created.");
    } catch (error) {
        return next(createError(500, error.message));
    }
};


const login = async (req, res, next) => {
    const { username, password: userPassword } = req.body; // Renamed password to userPassword

    // Validate the user input
    const schema = joi.object({
        username: joi.string().required(),
        userPassword: joi.string().required()
    });

    const { error } = schema.validate({ username, userPassword });

    if (error) {
        return next(createError(400, error.details[0].message));
    }


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

        // Check if 'user' has 'password' property before destructuring
        const { password, ...others } = user || {};

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
