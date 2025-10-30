const Lease = require('../models/Lease');

// @desc    Get all leases
// @route   GET /api/leases
// @access  Private
exports.getLeases = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};

        if (status) query.status = status;

        const leases = await Lease.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: leases.length,
            data: leases
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single lease
// @route   GET /api/leases/:id
// @access  Private
exports.getLease = async (req, res) => {
    try {
        const lease = await Lease.findById(req.params.id).populate('tenantId');

        if (!lease) {
            return res.status(404).json({
                success: false,
                message: 'Lease not found'
            });
        }

        res.status(200).json({
            success: true,
            data: lease
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new lease
// @route   POST /api/leases
// @access  Private (Admin, Manager)
exports.createLease = async (req, res) => {
    try {
        const lease = await Lease.create(req.body);

        res.status(201).json({
            success: true,
            data: lease
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update lease
// @route   PUT /api/leases/:id
// @access  Private (Admin, Manager)
exports.updateLease = async (req, res) => {
    try {
        const lease = await Lease.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lease) {
            return res.status(404).json({
                success: false,
                message: 'Lease not found'
            });
        }

        res.status(200).json({
            success: true,
            data: lease
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete lease
// @route   DELETE /api/leases/:id
// @access  Private (Admin)
exports.deleteLease = async (req, res) => {
    try {
        const lease = await Lease.findByIdAndDelete(req.params.id);

        if (!lease) {
            return res.status(404).json({
                success: false,
                message: 'Lease not found'
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
