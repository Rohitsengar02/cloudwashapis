const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const SubCategory = require('../models/SubCategory');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper to upload to Cloudinary using stream
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: "cloud_wash_sub_categories"
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
    });
};

const createSubCategory = async (req, res) => {
    try {
        const { name, category, description, price, isActive } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload an image' });
        }

        // Upload image to Cloudinary
        const result = await uploadFromBuffer(req.file.buffer);

        const subCategory = await SubCategory.create({
            name,
            category,
            description,
            price,
            imageUrl: result.secure_url,
            isActive: isActive === 'true'
        });

        res.status(201).json(subCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getSubCategories = async (req, res) => {
    try {
        const query = {};
        if (req.query.categoryId) {
            query.category = req.query.categoryId;
        }
        // Populate specific fields from the 'category' reference using just the path 'category'
        // Mongoose will look up the model 'Category' because we defined ref: 'Category' in the schema
        const subCategories = await SubCategory.find(query).populate('category', 'name');
        res.json(subCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        await subCategory.deleteOne();
        res.json({ message: 'SubCategory removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { name, category, description, price, isActive } = req.body;
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        subCategory.name = name || subCategory.name;
        if (category) subCategory.category = category;
        subCategory.description = description || subCategory.description;
        subCategory.price = price || subCategory.price;
        subCategory.isActive = isActive === 'true' ? true : (isActive === 'false' ? false : subCategory.isActive);

        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            subCategory.imageUrl = result.secure_url;
        }

        const updatedSubCategory = await subCategory.save();
        res.json(updatedSubCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createSubCategory,
    getSubCategories,
    deleteSubCategory,
    updateSubCategory
};
