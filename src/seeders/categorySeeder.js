const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

const categories = [
    {
        name: 'Laundry',
        description: 'Professional washing, drying, and folding service',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/5591464/pexels-photo-5591464.jpeg?auto=compress&w=400',
        isActive: true
    },
    {
        name: 'Dry Cleaning',
        description: 'Premium dry cleaning for delicate garments',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&w=400',
        isActive: true
    },
    {
        name: 'Shoe Cleaning',
        description: 'Expert cleaning and care for footwear',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&w=400',
        isActive: true
    },
    {
        name: 'Leather Cleaning',
        description: 'Specialized leather care and conditioning',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&w=400',
        isActive: true
    },
    {
        name: 'Curtain Cleaning',
        description: 'Gentle cleaning for curtains and drapes',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/1743227/pexels-photo-1743227.jpeg?auto=compress&w=400',
        isActive: true
    },
    {
        name: 'Carpet Cleaning',
        description: 'Deep cleaning for carpets and rugs',
        price: 0,
        imageUrl: 'https://images.pexels.com/photos/6538940/pexels-photo-6538940.jpeg?auto=compress&w=400',
        isActive: true
    }
];

const seedCategories = async () => {
    try {
        await connectDB();

        // Clear existing categories
        await Category.deleteMany({});
        console.log('🗑️  Existing categories cleared');

        // Insert new categories
        await Category.insertMany(categories);
        console.log('✅ Categories seeded successfully!');
        console.log(`📦 ${categories.length} categories added to database`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
