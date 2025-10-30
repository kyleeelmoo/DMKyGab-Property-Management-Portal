const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide tenant name'],
        trim: true
    },
    unit: {
        type: String,
        required: [true, 'Please provide unit number']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Please provide phone number']
    },
    rent: {
        type: Number,
        required: [true, 'Please provide rent amount']
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'inactive'],
        default: 'active'
    },
    leaseEnd: {
        type: Date,
        required: [true, 'Please provide lease end date']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tenant', tenantSchema);
