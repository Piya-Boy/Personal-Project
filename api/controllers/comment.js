const createError = require("../utils/createError");

const getComments = (req, res, next) => {
    res.send("get comments");
};

const addComment = (req, res, next) => {
    res.send("add comment");
};

const deleteComment = (req, res, next) => {
    res.send("delete comment");
};

module.exports = {
    getComments,
    addComment,
    deleteComment
};
