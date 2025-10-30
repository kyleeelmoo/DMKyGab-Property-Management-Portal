const express = require('express');
const router = express.Router();
const {
    getPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentStats
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin', 'manager'), getPaymentStats);

router.route('/')
    .get(protect, getPayments)
    .post(protect, createPayment);

router.route('/:id')
    .get(protect, getPayment)
    .put(protect, authorize('admin', 'manager'), updatePayment)
    .delete(protect, authorize('admin'), deletePayment);

module.exports = router;
