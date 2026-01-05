const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createBanner, getBanners, deleteBanner, updateBanner } = require('../controllers/bannerController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .post(upload.single('image'), createBanner)
    .get(getBanners);

router.route('/:id')
    .put(upload.single('image'), updateBanner)
    .delete(deleteBanner);

module.exports = router;
