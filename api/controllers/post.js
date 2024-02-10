const createError = require("../utils/createError");

const getPosts = (req, res, next) => {
    res.send("get posts");
};

const addPost = (req, res, next) => {
    res.send("add post");
};

const deletePost = (req, res, next) => {
    res.send("delete post");
};

module.exports = {
    getPosts,
    addPost,
    deletePost
};
