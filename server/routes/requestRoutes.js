const express = require('express');
const { createRequest, getMyRequests, getAllRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, createRequest);
router.get('/mine', protect, getMyRequests);
router.get('/all', protect, requireAdmin, getAllRequests);
router.patch('/:id/status', protect, requireAdmin, updateRequestStatus);

module.exports = router;