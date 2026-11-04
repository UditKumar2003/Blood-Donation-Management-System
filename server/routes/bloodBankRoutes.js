const express = require('express');
const {
    listBloodBanks,
    createBloodBank,
    updateBloodBank,
    deleteBloodBank,
    addReview
} = require('../controllers/bloodBankController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', listBloodBanks);
router.post('/', protect, requireAdmin, createBloodBank);
router.put('/:id', protect, requireAdmin, updateBloodBank);
router.delete('/:id', protect, requireAdmin, deleteBloodBank);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
