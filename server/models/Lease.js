const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
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
    startDate: {
        type: Date,
        required: [true, 'Please provide lease start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide lease end date']
    },
    rent: {
        type: Number,
        required: [true, 'Please provide monthly rent amount']
    },
    deposit: {
        type: Number,
        required: [true, 'Please provide security deposit amount']
    },
    status: {
        type: String,
        enum: ['active', 'expiring', 'expired', 'terminated'],
        default: 'active'
    },
    document: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lease', leaseSchema);
