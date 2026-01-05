const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Banner = require('../models/Banner');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
                folder: "cloud_wash_banners"
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

const createBanner = async (req, res) => {
    try {
        const { title, description, position, isActive, displayOrder } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a banner image' });
        }

        const result = await uploadFromBuffer(req.file.buffer);

        const banner = await Banner.create({
            title,
            description,
            position,
            imageUrl: result.secure_url,
            isActive: isActive === 'true',
            displayOrder: displayOrder || 0,
        });

        res.status(201).json(banner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({}).sort({ displayOrder: 1, createdAt: -1 });
        res.json(banners);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        await banner.deleteOne();
        res.json({ message: 'Banner removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const updateBanner = async (req, res) => {
    try {
        const { title, description, position, isActive, displayOrder } = req.body;
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        banner.title = title || banner.title;
        banner.description = description || banner.description;
        banner.position = position || banner.position;

        if (displayOrder !== undefined) {
            banner.displayOrder = displayOrder;
        }

        if (isActive !== undefined) {
            banner.isActive = isActive === 'true' ? true : (isActive === 'false' ? false : banner.isActive);
        }

        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            banner.imageUrl = result.secure_url;
        }

        const updatedBanner = await banner.save();
        res.json(updatedBanner);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createBanner,
    getBanners,
    deleteBanner,
    updateBanner
};
