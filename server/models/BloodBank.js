const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true, maxlength: 1000 },
    createdAt: { type: Date, default: Date.now }
});

const bloodBankSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true },
    prices: {
        type: Map,
        of: { type: Number, min: 0 },
        default: {}
    },
    reviews: { type: [reviewSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('BloodBank', bloodBankSchema);
