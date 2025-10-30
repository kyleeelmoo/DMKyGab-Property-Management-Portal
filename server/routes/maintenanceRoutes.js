const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/maintenance
// @desc    Get all maintenance requests
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, unit } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (unit) query.unit = unit;

    const requests = await MaintenanceRequest.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance requests',
      error: error.message
    });
  }
});

// @route   GET /api/maintenance/:id
// @desc    Get single maintenance request
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const request = await MaintenanceRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance request',
      error: error.message
    });
  }
});

// @route   POST /api/maintenance
// @desc    Create new maintenance request
// @access  Private
router.post('/', protect, [
  body('unit').notEmpty().withMessage('Unit number is required'),
  body('tenant').notEmpty().withMessage('Tenant name is required'),
  body('issue').notEmpty().withMessage('Issue description is required'),
  body('priority').optional().isIn(['urgent', 'high', 'normal', 'low'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const request = await MaintenanceRequest.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating maintenance request',
      error: error.message
    });
  }
});

// @route   PUT /api/maintenance/:id
// @desc    Update maintenance request
// @access  Private (Admin, Manager)
router.put('/:id', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      message: 'Maintenance request updated successfully',
      data: request
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating maintenance request',
      error: error.message
    });
  }
});

// @route   DELETE /api/maintenance/:id
// @desc    Delete maintenance request
// @access  Private (Admin)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const request = await MaintenanceRequest.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }

    res.json({
      success: true,
      message: 'Maintenance request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting maintenance request',
      error: error.message
    });
  }
});

module.exports = router;
