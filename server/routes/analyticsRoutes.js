const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const MaintenanceRequest = require('../models/MaintenanceRequest');
const Payment = require('../models/Payment');
const Lease = require('../models/Lease');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin, Manager)
router.get('/dashboard', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    // Get total tenants
    const totalTenants = await Tenant.countDocuments({ status: 'active' });
    
    // Get total active leases
    const activeLeases = await Lease.countDocuments({ status: 'active' });
    
    // Get pending maintenance requests
    const pendingMaintenance = await MaintenanceRequest.countDocuments({
      status: { $in: ['open', 'in-progress'] }
    });
    
    // Get urgent maintenance requests
    const urgentMaintenance = await MaintenanceRequest.countDocuments({
      priority: 'urgent',
      status: { $in: ['open', 'in-progress'] }
    });
    
    // Calculate rent collected this month
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);
    
    const rentCollected = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          type: 'rent',
          paidDate: { $gte: currentMonth }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);
    
    // Get pending payments
    const pendingPayments = await Payment.aggregate([
      {
        $match: {
          status: { $in: ['pending', 'overdue'] }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get leases expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const expiringSoonLeases = await Lease.countDocuments({
      status: 'active',
      endDate: { $lte: thirtyDaysFromNow, $gte: new Date() }
    });

    res.json({
      success: true,
      data: {
        totalTenants,
        activeLeases,
        pendingMaintenance,
        urgentMaintenance,
        rentCollected: rentCollected[0]?.total || 0,
        pendingPayments: {
          amount: pendingPayments[0]?.total || 0,
          count: pendingPayments[0]?.count || 0
        },
        expiringSoonLeases
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/revenue
// @desc    Get revenue trends
// @access  Private (Admin, Manager)
router.get('/revenue', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { months = 6 } = req.query;
    
    const monthsAgo = new Date();
    monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));
    
    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          status: 'paid',
          paidDate: { $gte: monthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidDate' },
            month: { $month: '$paidDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: revenueByMonth
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue analytics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/maintenance
// @desc    Get maintenance statistics
// @access  Private (Admin, Manager)
router.get('/maintenance', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    // Maintenance by priority
    const byPriority = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Maintenance by status
    const byStatus = await MaintenanceRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Average resolution time
    const avgResolutionTime = await MaintenanceRequest.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $exists: true }
        }
      },
      {
        $project: {
          resolutionDays: {
            $divide: [
              { $subtract: ['$completedAt', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDays: { $avg: '$resolutionDays' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byPriority,
        byStatus,
        avgResolutionDays: avgResolutionTime[0]?.avgDays || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching maintenance analytics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/occupancy
// @desc    Get occupancy statistics
// @access  Private (Admin, Manager)
router.get('/occupancy', protect, authorize('admin', 'manager'), async (req, res) => {
  try {
    const activeTenants = await Tenant.countDocuments({ status: 'active' });
    const totalUnits = 50; // This should come from a property/unit model
    
    const occupancyRate = (activeTenants / totalUnits) * 100;

    res.json({
      success: true,
      data: {
        activeTenants,
        totalUnits,
        occupancyRate: occupancyRate.toFixed(2),
        vacantUnits: totalUnits - activeTenants
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching occupancy analytics',
      error: error.message
    });
  }
});

module.exports = router;
