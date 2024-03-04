
const express = require("express")
const { getStories, addStory, deleteStory, fetchStory } = require('../controllers/storie.js')
const router = express.Router();

router.get('/', getStories)
router.get('/all', fetchStory)
router.post('/', addStory)
router.delete('/:id', deleteStory)

module.exports = router