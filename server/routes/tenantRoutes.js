const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Tenant = require('../models/Tenant');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/tenants
// @desc    Get all tenants
// @access  Private (Admin, Manager)
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { unit: { $regex: search, $options: 'i' } }
      ];
    }

    const tenants = await Tenant.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tenants.length,
      data: tenants
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenants',
      error: error.message
    });
  }
});

// @route   GET /api/tenants/:id
// @desc    Get single tenant
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tenant',
      error: error.message
    });
  }
});

// @route   POST /api/tenants
// @desc    Create new tenant
// @access  Private (Admin, Manager)
router.post('/', protect, authorize('admin', 'manager'), [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone is required'),
  body('unit').notEmpty().withMessage('Unit number is required'),
  body('rent').isNumeric().withMessage('Rent must be a number'),
  body('leaseEnd').isISO8601().withMessage('Please provide a valid lease end date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const tenant = await Tenant.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Tenant created successfully',
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating tenant',
      error: error.message
    });
  }
});

// @route   PUT /api/tenants/:id
// @desc    Update tenant
// @access  Private (Admin, Manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      message: 'Tenant updated successfully',
      data: tenant
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating tenant',
      error: error.message
    });
  }
});

// @route   DELETE /api/tenants/:id
// @desc    Delete tenant
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndDelete(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting tenant',
      error: error.message
    });
  }
});

module.exports = router;
