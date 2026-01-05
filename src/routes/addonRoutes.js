const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createAddon, getAddons, deleteAddon, updateAddon } = require('../controllers/addonController');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
    .post(upload.single('image'), createAddon)
    .get(getAddons);

router.route('/:id')
    .put(upload.single('image'), updateAddon)
    .delete(deleteAddon);

module.exports = router;
