const createError = require("../utils/createError");

const register = (req, res, next) => {
    res.send("register");
};

const login = (req, res, next) => {
    res.send("login");
};

const logout = (req, res, next) => {
    res.send("logout");
};

module.exports = {
    register,
    login,
    logout
};
