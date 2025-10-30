const express = require('express');
const router = express.Router();
const {
    getLeases,
    getLease,
    createLease,
    updateLease,
    deleteLease
} = require('../controllers/leaseController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getLeases)
    .post(protect, authorize('admin', 'manager'), createLease);

router.route('/:id')
    .get(protect, getLease)
    .put(protect, authorize('admin', 'manager'), updateLease)
    .delete(protect, authorize('admin'), deleteLease);

module.exports = router;
