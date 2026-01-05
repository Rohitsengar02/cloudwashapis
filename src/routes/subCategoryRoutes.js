const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createSubCategory, getSubCategories, deleteSubCategory, updateSubCategory } = require('../controllers/subCategoryController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .post(upload.single('image'), createSubCategory)
    .get(getSubCategories);

router.route('/:id')
    .put(upload.single('image'), updateSubCategory)
    .delete(deleteSubCategory);

module.exports = router;
