const mongoose = require('mongoose');

const statsSchema = new mongoose.Schema({
    happyClients: {
        type: String,
        default: '500+ '
    },
    totalBranches: {
        type: String,
        default: '10+ '
    },
    totalCities: {
        type: String,
        default: '5+ '
    },
    totalOrders: {
        type: String,
        default: '1000+ '
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Stats', statsSchema);
