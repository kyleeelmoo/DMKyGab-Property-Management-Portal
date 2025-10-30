const express = require('express');
const router = express.Router();
const {
    getMaintenanceRequests,
    getMaintenanceRequest,
    createMaintenanceRequest,
    updateMaintenanceRequest,
    deleteMaintenanceRequest
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getMaintenanceRequests)
    .post(protect, createMaintenanceRequest);

router.route('/:id')
    .get(protect, getMaintenanceRequest)
    .put(protect, updateMaintenanceRequest)
    .delete(protect, authorize('admin', 'manager'), deleteMaintenanceRequest);

module.exports = router;
