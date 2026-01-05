const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getTestimonials, createTestimonial, deleteTestimonial, updateTestimonial } = require('../controllers/testimonialsController');

const upload = multer({ storage: multer.memoryStorage() });

router.route('/')
    .get(getTestimonials)
    .post(upload.single('image'), createTestimonial);

router.route('/:id')
    .put(upload.single('image'), updateTestimonial)
    .delete(deleteTestimonial);

module.exports = router;
