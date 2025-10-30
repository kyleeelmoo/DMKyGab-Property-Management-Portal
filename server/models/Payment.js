const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    unit: {
        type: String,
        required: [true, 'Please provide unit number']
    },
    tenant: {
        type: String,
        required: [true, 'Please provide tenant name']
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide payment amount']
    },
    date: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue', 'partial'],
        default: 'pending'
    },
    method: {
        type: String,
        enum: ['cash', 'check', 'bank transfer', 'credit card', 'pending'],
        default: 'pending'
    },
    transactionId: {
        type: String
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
