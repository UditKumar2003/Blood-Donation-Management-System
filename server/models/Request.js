const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    patientAge: { type: Number, required: true, min: 0, max: 130 },
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true, min: 1 },
    hospitalName: { type: String, required: true },
    city: { type: String, required: true },
    contactNumber: { type: String, required: true },
    urgency: { type: String, enum: ['Normal', 'Urgent', 'Critical'], required: true },
    neededBy: { type: Date, required: true },
    reason: { type: String, required: true, maxlength: 1000 },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Fulfilled'], default: 'Pending' },
    statusHistory: [{
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Fulfilled'], required: true },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);