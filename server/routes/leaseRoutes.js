const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Lease = require('../models/Lease');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/leases
// @desc    Get all leases
// @access  Private (Admin, Manager)
router.get('/', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) query.status = status;

    const leases = await Lease.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: leases.length,
      data: leases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching leases',
      error: error.message
    });
  }
});

// @route   GET /api/leases/:id
// @desc    Get single lease
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    res.json({
      success: true,
      data: lease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching lease',
      error: error.message
    });
  }
});

// @route   POST /api/leases
// @desc    Create new lease
// @access  Private (Admin, Manager)
router.post('/', protect, authorize('admin', 'manager'), [
  body('unit').notEmpty().withMessage('Unit number is required'),
  body('tenant').notEmpty().withMessage('Tenant name is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('rent').isNumeric().withMessage('Rent must be a number'),
  body('deposit').isNumeric().withMessage('Deposit must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const lease = await Lease.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Lease created successfully',
      data: lease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating lease',
      error: error.message
    });
  }
});

// @route   PUT /api/leases/:id
// @desc    Update lease
// @access  Private (Admin, Manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const lease = await Lease.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    res.json({
      success: true,
      message: 'Lease updated successfully',
      data: lease
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lease',
      error: error.message
    });
  }
});

// @route   DELETE /api/leases/:id
// @desc    Delete lease
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const lease = await Lease.findByIdAndDelete(req.params.id);

    if (!lease) {
      return res.status(404).json({
        success: false,
        message: 'Lease not found'
      });
    }

    res.json({
      success: true,
      message: 'Lease deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting lease',
      error: error.message
    });
  }
});

module.exports = router;
