const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
  unit: {
    type: String,
    required: [true, 'Please provide unit number'],
    trim: true
  },
  tenant: {
    type: String,
    required: [true, 'Please provide tenant name'],
    trim: true
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
    required: [true, 'Please provide monthly rent amount'],
    min: 0
  },
  deposit: {
    type: Number,
    required: [true, 'Please provide security deposit amount'],
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'terminated', 'pending'],
    default: 'active'
  },
  terms: {
    type: String,
    trim: true
  },
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  renewalDate: {
    type: Date
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

// Update updatedAt on save
leaseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Check if lease is expiring soon (within 30 days)
leaseSchema.virtual('isExpiringSoon').get(function() {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return this.endDate <= thirtyDaysFromNow && this.status === 'active';
});

module.exports = mongoose.model('Lease', leaseSchema);
