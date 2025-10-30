const Tenant = require('../models/Tenant');

// @desc    Get all tenants
// @route   GET /api/tenants
// @access  Private
exports.getTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: tenants.length,
            data: tenants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single tenant
// @route   GET /api/tenants/:id
// @access  Private
exports.getTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findById(req.params.id);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: tenant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new tenant
// @route   POST /api/tenants
// @access  Private (Admin, Manager)
exports.createTenant = async (req, res) => {
    try {
        const tenant = await Tenant.create(req.body);

        res.status(201).json({
            success: true,
            data: tenant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update tenant
// @route   PUT /api/tenants/:id
// @access  Private (Admin, Manager)
exports.updateTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
            });
        }

        res.status(200).json({
            success: true,
            data: tenant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete tenant
// @route   DELETE /api/tenants/:id
// @access  Private (Admin)
exports.deleteTenant = async (req, res) => {
    try {
        const tenant = await Tenant.findByIdAndDelete(req.params.id);

        if (!tenant) {
            return res.status(404).json({
                success: false,
                message: 'Tenant not found'
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
