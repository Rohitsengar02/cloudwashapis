const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const connectDB = require('../config/db');

// Load env vars
dotenv.config(); // Loads from CWD (root of backend)

const subCategoriesData = {
    'Laundry': [
        { name: 'Wash & Fold', price: 60, description: 'Everyday laundry washed, dried, and folded.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/wash_fold.jpg' },
        { name: 'Wash & Iron', price: 90, description: 'Washed and steam ironed for a crisp finish.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/wash_iron.jpg' },
        { name: 'Premium Laundry', price: 120, description: 'Special care with premium detergents and packaging.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/premium_laundry.jpg' }
    ],
    'Dry Cleaning': [
        { name: 'Suits', price: 350, description: 'Expert dry cleaning for your business suits.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/suits.jpg' },
        { name: 'Dresses', price: 400, description: 'Delicate care for evening and casual dresses.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/dresses.jpg' },
        { name: 'Jackets & Coats', price: 450, description: 'Deep cleaning for winter wear.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/jackets.jpg' }
    ],
    'Shoe Cleaning': [
        { name: 'Sports Shoes', price: 250, description: 'Deep cleaning and deodorizing for sneakers.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/sneakers.jpg' },
        { name: 'Leather Shoes', price: 350, description: 'Cleaning and polishing for leather footwear.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/leather_shoes.jpg' },
        { name: 'Suede Shoes', price: 400, description: 'Specialized cleaning for delicate suede.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/suede.jpg' }
    ],
    // Fallback for others
    'default': [
        { name: 'Standard Service', price: 100, description: 'Quality service for your items.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/standard.jpg' },
        { name: 'Premium Service', price: 200, description: 'Top-tier care and handling.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/premium.jpg' }
    ]
};

const seedSubCategories = async () => {
    try {
        await connectDB();
        console.log('🔗 Connected to DB');

        // Clear existing subcategories? Maybe not, just add if missing.
        // But for clean state, let's delete all and re-seed to ensure consistency.
        // await SubCategory.deleteMany({});
        // console.log('🗑️  Cleared existing subcategories');
        // Actually, user might have some data. Let's ONLY add for categories found.

        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories`);

        for (const cat of categories) {
            console.log(`Processing ${cat.name}...`);

            // Check if subcats exist for this cat
            const existing = await SubCategory.countDocuments({ category: cat._id });
            if (existing > 0) {
                console.log(`- Subcategories already exist for ${cat.name}, skipping.`);
                continue;
            }

            const subCatsToAdd = subCategoriesData[cat.name] || subCategoriesData['default'];

            const docs = subCatsToAdd.map(item => ({
                ...item,
                category: cat._id,
                isActive: true,
                // Use a default valid image if URL breaks, but for now we trust these placeholder URLs or use the one from check_subcats
                imageUrl: item.imageUrl
            }));

            await SubCategory.insertMany(docs);
            console.log(`✅ Added ${docs.length} subcategories for ${cat.name}`);
        }

        console.log('🎉 Seeding complete');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
};

seedSubCategories();
