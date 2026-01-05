const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAboutUs, updateAboutUs, getStats, updateStats } = require('../controllers/webSectionsController');

const upload = multer({ storage: multer.memoryStorage() });

router.route('/about')
    .get(getAboutUs)
    .put(upload.single('image'), updateAboutUs);

router.route('/stats')
    .get(getStats)
    .put(updateStats); // Stats usually don't have images

module.exports = router;
