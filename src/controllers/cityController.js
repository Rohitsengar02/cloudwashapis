const City = require('../models/City');

const createCity = async (req, res) => {
    try {
        const { name, state, isActive } = req.body;

        const city = await City.create({
            name,
            state,
            isActive: isActive === 'true' || isActive === true,
        });

        res.status(201).json(city);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getCities = async (req, res) => {
    try {
        const cities = await City.find({}).sort({ createdAt: -1 });
        res.json(cities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        await city.deleteOne();
        res.json({ message: 'City removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateCity = async (req, res) => {
    try {
        const { name, state, isActive } = req.body;
        const city = await City.findById(req.params.id);

        if (!city) {
            return res.status(404).json({ message: 'City not found' });
        }

        city.name = name || city.name;
        city.state = state || city.state;

        if (isActive !== undefined) {
            city.isActive = isActive === 'true' ? true : (isActive === 'false' ? false : city.isActive);
        }

        const updatedCity = await city.save();
        res.json(updatedCity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createCity,
    getCities,
    deleteCity,
    updateCity
};
