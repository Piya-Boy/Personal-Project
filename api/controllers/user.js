const createError = require("../utils/createError");

const getUser = (req, res, next) => {

    res.send("get users")
}

const updateUser = (req, res, next) => {

    res.send("update user")
}

module.exports = {
    getUser,
    updateUser
}