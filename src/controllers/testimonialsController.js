const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Testimonial = require('../models/Testimonial');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "cloudwash/testimonials" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );
        streamifier.createReadStream(buffer).pipe(cld_upload_stream);
    });
};

const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({});
        res.json(testimonials);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createTestimonial = async (req, res) => {
    try {
        const { name, role, message, rating, isActive } = req.body;
        let imageUrl = '';

        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            imageUrl = result.secure_url;
        }

        const testimonial = await Testimonial.create({
            name,
            role,
            message,
            rating,
            imageUrl,
            isActive: isActive === 'true'
        });

        res.status(201).json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const deleteTestimonial = async (req, res) => {
    try {
        await Testimonial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting' });
    }
};

const updateTestimonial = async (req, res) => {
    try {
        const { name, role, message, rating, isActive } = req.body;
        const testimonial = await Testimonial.findById(req.params.id);
        if (!testimonial) return res.status(404).json({ message: 'Not found' });

        testimonial.name = name || testimonial.name;
        testimonial.role = role || testimonial.role;
        testimonial.message = message || testimonial.message;
        if (rating) testimonial.rating = rating;
        if (isActive !== undefined) testimonial.isActive = isActive === 'true';

        if (req.file) {
            const result = await uploadFromBuffer(req.file.buffer);
            testimonial.imageUrl = result.secure_url;
        }

        await testimonial.save();
        res.json(testimonial);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getTestimonials,
    createTestimonial,
    deleteTestimonial,
    updateTestimonial
};
