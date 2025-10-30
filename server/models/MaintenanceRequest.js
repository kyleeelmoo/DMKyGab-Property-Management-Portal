const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
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
        ref: 'Tenant'
    },
    issue: {
        type: String,
        required: [true, 'Please describe the issue']
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ['urgent', 'high', 'normal', 'low'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['open', 'in-progress', 'completed', 'cancelled'],
        default: 'open'
    },
    assignedTo: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

maintenanceRequestSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
