const createError = require("../utils/createError");

const getRelationships = (req, res, next) => {
    res.send("get relationships");
};

const addRelationship = (req, res, next) => {
    res.send("add relationship");
};

const deleteRelationship = (req, res, next) => {
    res.send("delete relationship");
};

module.exports = {
    getRelationships,
    addRelationship,
    deleteRelationship
};
