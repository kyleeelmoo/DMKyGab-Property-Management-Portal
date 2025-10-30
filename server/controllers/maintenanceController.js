const MaintenanceRequest = require('../models/MaintenanceRequest');

// @desc    Get all maintenance requests
// @route   GET /api/maintenance
// @access  Private
exports.getMaintenanceRequests = async (req, res) => {
    try {
        const { status, priority } = req.query;
        let query = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;

        const requests = await MaintenanceRequest.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single maintenance request
// @route   GET /api/maintenance/:id
// @access  Private
exports.getMaintenanceRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new maintenance request
// @route   POST /api/maintenance
// @access  Private
exports.createMaintenanceRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.create(req.body);

        res.status(201).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update maintenance request
// @route   PUT /api/maintenance/:id
// @access  Private
exports.updateMaintenanceRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete maintenance request
// @route   DELETE /api/maintenance/:id
// @access  Private (Admin, Manager)
exports.deleteMaintenanceRequest = async (req, res) => {
    try {
        const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: 'Maintenance request not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
