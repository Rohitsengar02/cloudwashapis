const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getProfile, updateProfile, updatePassword, login } = require('../controllers/adminController');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Get profile (no ID needed as we fetch the single admin)
router.get('/', getProfile);

// Update details (handle both with and without ID)
router.put('/', upload.single('profileImage'), updateProfile);
router.put('/:id', upload.single('profileImage'), updateProfile);

// Update password
router.put('/:id/password', updatePassword);

// Login
router.post('/login', login);

module.exports = router;
