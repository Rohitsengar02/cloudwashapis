const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');
const SubCategory = require('../models/SubCategory');
const Category = require('../models/Category');
const connectDB = require('../config/db');

// Load env vars
dotenv.config();

const serviceDataSamples = [
    { name: 'Basic Wash', price: 10, duration: 24, description: 'Quick wash for light clothes.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/wash_fold.jpg' },
    { name: 'Premium Care', price: 20, duration: 48, description: 'Deep cleaning with fabric softener.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/premium_laundry.jpg' },
    { name: 'Express Service', price: 30, duration: 12, description: 'Done in 12 hours.', imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1709830000/cloudwash/wash_iron.jpg' }
];

const seedServices = async () => {
    try {
        await connectDB();
        console.log('🔗 Connected to DB');

        const subCategories = await SubCategory.find({});
        console.log(`Found ${subCategories.length} sub-categories`);

        if (subCategories.length === 0) {
            console.log('No subcategories found. Run seed_subcategories.js first.');
            process.exit(1);
        }

        // Just add 1-2 services for EACH sub-category
        let count = 0;
        for (const subCat of subCategories) {
            // Check if services exist for this subCat
            const existing = await Service.countDocuments({ subCategory: subCat._id });
            if (existing > 0) {
                console.log(`- Services already exist for ${subCat.name}, skipping.`);
                continue;
            }

            // Pick 2 random services
            const servicesToAdd = serviceDataSamples.map(s => ({
                ...s,
                name: `${subCat.name} - ${s.name}`, // Unique name
                category: subCat.category, // Link to same main category
                subCategory: subCat._id,
                isActive: true
            })).slice(0, 2);

            await Service.insertMany(servicesToAdd);
            console.log(`✅ Added ${servicesToAdd.length} services for ${subCat.name}`);
            count += servicesToAdd.length;
        }

        console.log(`🎉 Seeding complete. Added ${count} services.`);
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding:', error);
        process.exit(1);
    }
};

seedServices();
