const express = require('express');
const router = express.Router();
const {
    getTenants,
    getTenant,
    createTenant,
    updateTenant,
    deleteTenant
} = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getTenants)
    .post(protect, authorize('admin', 'manager'), createTenant);

router.route('/:id')
    .get(protect, getTenant)
    .put(protect, authorize('admin', 'manager'), updateTenant)
    .delete(protect, authorize('admin'), deleteTenant);

module.exports = router;
