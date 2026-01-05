const express = require('express');
const router = express.Router();
const {
    createNotification,
    getNotifications,
    deleteNotification,
    updateNotification,
    sendNotification
} = require('../controllers/notificationController');

router.route('/')
    .post(createNotification)
    .get(getNotifications);

router.route('/:id')
    .put(updateNotification)
    .delete(deleteNotification);

router.post('/:id/send', sendNotification);

module.exports = router;
