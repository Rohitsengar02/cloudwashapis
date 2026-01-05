const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const HeroSection = require('../models/HeroSection');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper to upload to Cloudinary
const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "cloudwash/hero" },
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

// Get hero section (returns first/only document or creates one)
const getHeroSection = async (req, res) => {
    try {
        let heroSection = await HeroSection.findOne({});

        // If no hero section exists, create default one
        if (!heroSection) {
            heroSection = await HeroSection.create({
                tagline: '✨ We Are Clino',
                mainTitle: 'Feel Your Way For\nFreshness',
                description: 'Experience the epitome of cleanliness with Clino. We provide top-notch cleaning services tailored to your needs, ensuring your spaces shine with perfection.',
                buttonText: 'Our Services',
                imageUrl: 'https://res.cloudinary.com/dssmutzly/image/upload/v1766830730/4d01db37af62132b8e554cfabce7767a_z7ioie.png',
                youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                isActive: true
            });
        }

        res.json(heroSection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Update hero section
const updateHeroSection = async (req, res) => {
    try {
        const { tagline, mainTitle, description, buttonText, youtubeUrl, isActive } = req.body;

        let heroSection = await HeroSection.findOne({});

        if (!heroSection) {
            return res.status(404).json({ message: 'Hero section not found' });
        }

        // Update fields
        heroSection.tagline = tagline || heroSection.tagline;
        heroSection.mainTitle = mainTitle || heroSection.mainTitle;
        heroSection.description = description || heroSection.description;
        heroSection.buttonText = buttonText || heroSection.buttonText;
        if (youtubeUrl !== undefined) heroSection.youtubeUrl = youtubeUrl;
        heroSection.isActive = isActive === 'true' ? true : (isActive === 'false' ? false : heroSection.isActive);

        // Upload new image if provided
        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            heroSection.imageUrl = result.secure_url;
        }

        const updatedHeroSection = await heroSection.save();
        res.json(updatedHeroSection);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getHeroSection,
    updateHeroSection
};
