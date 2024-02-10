const createError = require("../utils/createError");

const getStories = (req, res, next) => {
    res.send("get story");
};

const addStory = (req, res, next) => {
    res.send("add story");
};

const deleteStory = (req, res, next) => {
    res.send("delete story");
};

module.exports = {
    getStories,
    addStory,
    deleteStory
};
