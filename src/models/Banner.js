const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
        enum: ['Home Top Slider', 'Home Middle Banner', 'Services Page', 'Footer Banner'],
        default: 'Home Top Slider',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    displayOrder: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Banner', bannerSchema);
