const express = require('express');
const router = express.Router();
const { getItems, createItem, deleteItem, updateItem } = require('../controllers/whyChooseUsController');

router.route('/')
    .get(getItems)
    .post(createItem);

router.route('/:id')
    .put(updateItem)
    .delete(deleteItem);

module.exports = router;
