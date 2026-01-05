const Notification = require('../models/Notification');

const createNotification = async (req, res) => {
    try {
        const { title, message, type, targetAudience, isActive, scheduledFor } = req.body;

        const notification = await Notification.create({
            title,
            message,
            type: type || 'info',
            targetAudience: targetAudience || 'all',
            isActive: isActive === 'true' || isActive === true,
            scheduledFor: scheduledFor || null,
        });

        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        await notification.deleteOne();
        res.json({ message: 'Notification removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateNotification = async (req, res) => {
    try {
        const { title, message, type, targetAudience, isActive, scheduledFor } = req.body;
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.title = title || notification.title;
        notification.message = message || notification.message;
        notification.type = type || notification.type;
        notification.targetAudience = targetAudience || notification.targetAudience;

        if (scheduledFor !== undefined) {
            notification.scheduledFor = scheduledFor || null;
        }

        // Handle boolean update logic properly
        if (isActive !== undefined) {
            notification.isActive = isActive === 'true' ? true : (isActive === 'false' ? false : notification.isActive);
        }

        const updatedNotification = await notification.save();
        res.json(updatedNotification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const sendNotification = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        // TODO: Implement actual notification sending logic (FCM, email, etc.)
        notification.isSent = true;
        notification.sentAt = new Date();
        await notification.save();

        res.json({ message: 'Notification sent successfully', notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    deleteNotification,
    updateNotification,
    sendNotification
};
