const BloodBank = require('../models/BloodBank');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const validBloodGroups = new Set(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']);
const validPrices = (prices) => prices &&
    typeof prices === 'object' &&
    !Array.isArray(prices) &&
    Object.entries(prices).every(([group, price]) => (
        validBloodGroups.has(group) && Number.isFinite(Number(price)) && Number(price) >= 0
    ));

const listBloodBanks = async (req, res) => {
    try {
        const filter = {};
        if (req.query.city) {
            const city = String(req.query.city).trim().slice(0, 100);
            if (city) filter.city = { $regex: escapeRegex(city), $options: 'i' };
        }

        const banks = await BloodBank.find(filter).populate('reviews.reviewer', 'name').sort({ name: 1 });
        return res.status(200).json(banks);
    } catch (error) {
        console.error('Blood bank list error:', error);
        return res.status(500).json({ message: 'Unable to retrieve blood banks' });
    }
};

const createBloodBank = async (req, res) => {
    try {
        const { name, address, city, phone, prices } = req.body;
        if (!name || !address || !city || !phone || !validPrices(prices)) {
            return res.status(400).json({ message: 'Name, address, city, phone, and unit prices are required' });
        }

        const bank = await BloodBank.create({ name, address, city, phone, prices });
        return res.status(201).json(bank);
    } catch (error) {
        console.error('Blood bank creation error:', error);
        return res.status(400).json({ message: 'Unable to create blood bank. Check the submitted details.' });
    }
};

const updateBloodBank = async (req, res) => {
    try {
        const { name, address, city, phone, prices } = req.body;
        if (!name || !address || !city || !phone || !validPrices(prices)) {
            return res.status(400).json({ message: 'Provide bank details and non-negative prices for valid blood groups' });
        }
        const bank = await BloodBank.findByIdAndUpdate(
            req.params.id,
            { name, address, city, phone, prices },
            { new: true, runValidators: true }
        );
        if (!bank) {
            return res.status(404).json({ message: 'Blood bank not found' });
        }
        return res.status(200).json(bank);
    } catch (error) {
        console.error('Blood bank update error:', error);
        return res.status(400).json({ message: 'Unable to update blood bank. Check the submitted details.' });
    }
};

const deleteBloodBank = async (req, res) => {
    try {
        const bank = await BloodBank.findByIdAndDelete(req.params.id);
        if (!bank) {
            return res.status(404).json({ message: 'Blood bank not found' });
        }
        return res.status(204).end();
    } catch (error) {
        console.error('Blood bank deletion error:', error);
        return res.status(500).json({ message: 'Unable to delete blood bank' });
    }
};

const addReview = async (req, res) => {
    try {
        const rating = Number(req.body.rating);
        const comment = typeof req.body.comment === 'string' ? req.body.comment.trim() : '';
        if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment || comment.length > 1000) {
            return res.status(400).json({ message: 'Provide a rating from 1 to 5 and a comment of up to 1000 characters' });
        }

        const bank = await BloodBank.findById(req.params.id);
        if (!bank) {
            return res.status(404).json({ message: 'Blood bank not found' });
        }
        if (bank.reviews.some((review) => review.reviewer.toString() === req.user.id)) {
            return res.status(409).json({ message: 'You have already reviewed this blood bank' });
        }

        bank.reviews.push({ reviewer: req.user.id, rating, comment });
        await bank.save();
        await bank.populate('reviews.reviewer', 'name');
        return res.status(201).json(bank);
    } catch (error) {
        console.error('Blood bank review error:', error);
        return res.status(500).json({ message: 'Unable to submit review' });
    }
};

module.exports = { listBloodBanks, createBloodBank, updateBloodBank, deleteBloodBank, addReview };
