const Request = require('../models/Request');

// Create a new blood request
const createRequest = async (req, res) => {
    try {
        const {
            patientName,
            patientAge,
            bloodGroup,
            units,
            hospitalName,
            city,
            contactNumber,
            urgency,
            neededBy,
            reason
        } = req.body;

        if (
            !patientName || patientAge === undefined || !bloodGroup ||
            units === undefined || !hospitalName || !city ||
            !contactNumber || !urgency || !neededBy || !reason
        ) {
            return res.status(400).json({ message: 'Please provide all required request details' });
        }

        const newRequest = new Request({
            requester: req.user.id,
            patientName,
            patientAge: Number(patientAge),
            bloodGroup,
            units: Number(units),
            hospitalName,
            city,
            contactNumber,
            urgency,
            neededBy,
            reason,
            statusHistory: [{ status: 'Pending', changedBy: req.user.id }]
        });

        await newRequest.save();
        res.status(201).json({ message: 'Blood request submitted successfully', request: newRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requester: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('requester', 'name email phone').sort({ createdAt: -1 });
        res.status(200).json(requests);
    } catch (error) {
        console.error('Admin request list error:', error);
        res.status(500).json({ message: 'Unable to retrieve requests' });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const allowedStatuses = ['Pending', 'Approved', 'Rejected', 'Fulfilled'];
        const { status } = req.body;
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid request status' });
        }

        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        request.statusHistory.push({ status, changedBy: req.user.id });
        await request.save();
        return res.status(200).json(request);
    } catch (error) {
        console.error('Request status update error:', error);
        return res.status(500).json({ message: 'Unable to update request status' });
    }
};

module.exports = { createRequest, getMyRequests, getAllRequests, updateRequestStatus };