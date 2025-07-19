const express = require('express');
const router = express.Router();
const { uploadWardrobeItem, getWardrobeItems } = require('../controllers/wardrobeController');
const multer = require('multer');

// Configure multer for in-memory storage.
// This is efficient for small files that we process and don't need to save to disk.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for uploading a new item.
// The `upload.single('image')` middleware parses the incoming form data
// and looks for a file in a field named 'image'.
router.post('/upload', upload.single('image'), uploadWardrobeItem);

// Route for getting all items for a user.
router.get('/', getWardrobeItems);

module.exports = router;