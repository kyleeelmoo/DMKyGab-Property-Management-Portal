const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: [true, 'Please provide payment amount'],
    min: 0
  },
  type: {
    type: String,
    enum: ['rent', 'deposit', 'late-fee', 'maintenance', 'other'],
    default: 'rent'
  },
  method: {
    type: String,
    enum: ['cash', 'check', 'bank transfer', 'credit card', 'online', 'pending'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'overdue', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Please provide due date']
  },
  paidDate: {
    type: Date
  },
  transactionId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
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
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.status === 'paid' && !this.paidDate) {
    this.paidDate = Date.now();
  }
  next();
});

// Check if payment is overdue
paymentSchema.virtual('isOverdue').get(function() {
  return this.status !== 'paid' && this.dueDate < new Date();
});

module.exports = mongoose.model('Payment', paymentSchema);
