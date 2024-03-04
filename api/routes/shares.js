const express = require("express");
const { getshare, addshare, deleteshare } = require('../controllers/share.js'); // Fix the import statement
const router = express.Router();

router.get('/', getshare);
router.post('/', addshare);
router.delete('/:id', deleteshare);

module.exports = router;
