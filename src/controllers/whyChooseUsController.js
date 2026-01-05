const WhyChooseUs = require('../models/WhyChooseUs');

const getItems = async (req, res) => {
    try {
        const items = await WhyChooseUs.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createItem = async (req, res) => {
    try {
        const { title, description, iconUrl, isActive } = req.body;
        const item = await WhyChooseUs.create({
            title,
            description,
            iconUrl, // Assuming direct URL string or managed elsewhere for now
            isActive
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteItem = async (req, res) => {
    try {
        await WhyChooseUs.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting' });
    }
};

const updateItem = async (req, res) => {
    try {
        const item = await WhyChooseUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getItems,
    createItem,
    deleteItem,
    updateItem
};
