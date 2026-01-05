const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Addon = require('../models/Addon');

const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cloudwasher')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const addons = [
    {
        name: 'Eco-Friendly Detergent',
        description: 'Premium organic detergent safe for all fabrics and skin types.',
        price: 99,
        duration: '0',
        imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=200',
        category: ['Laundry', 'Dry Cleaning'],
        isActive: true
    },
    {
        name: 'Fabric Softener',
        description: 'Long-lasting fragrance and extra softness for your clothes.',
        price: 49,
        duration: '0',
        imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=200',
        category: ['Laundry'],
        isActive: true
    },
    {
        name: 'Stain Removal Treatment',
        description: 'Special treatment for tough stains like wine, oil, and ink.',
        price: 149,
        duration: '15',
        imageUrl: 'https://images.unsplash.com/photo-1563315411-c9179979cc87?auto=format&fit=crop&q=80&w=200',
        category: ['Laundry', 'Dry Cleaning'],
        isActive: true
    },
    {
        name: 'Express Delivery',
        description: 'Get your clothes back within 24 hours.',
        price: 199,
        duration: '0',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200',
        category: ['All'],
        isActive: true
    },
    {
        name: 'Antiseptic Wash',
        description: 'Kills 99.9% of germs and bacteria.',
        price: 79,
        duration: '10',
        imageUrl: 'https://images.unsplash.com/photo-1584622781564-1d9876a13d00?auto=format&fit=crop&q=80&w=200',
        category: ['Laundry'],
        isActive: true
    }
];

const seedAddons = async () => {
    try {
        await Addon.deleteMany();
        await Addon.insertMany(addons);
        console.log('Addons Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding addons:', error);
        process.exit(1);
    }
};

seedAddons();
