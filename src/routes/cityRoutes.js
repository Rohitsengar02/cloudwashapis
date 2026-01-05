const express = require('express');
const router = express.Router();
const { createCity, getCities, deleteCity, updateCity } = require('../controllers/cityController');

router.route('/')
    .post(createCity)
    .get(getCities);

router.route('/:id')
    .put(updateCity)
    .delete(deleteCity);

module.exports = router;
