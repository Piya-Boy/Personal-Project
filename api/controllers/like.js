const createError = require("../utils/createError");
const getLikes = (req, res, next) => {
    res.send("get likes");
};

const addLike = (req, res, next) => {
    res.send("add like");
};

const deleteLike = (req, res, next) => {
    res.send("delete like");
};

module.exports = {
    getLikes,
    addLike,
    deleteLike
};
