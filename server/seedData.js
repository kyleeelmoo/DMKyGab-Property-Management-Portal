require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Tenant = require('./models/Tenant');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const Lease = require('./models/Lease');
const Payment = require('./models/Payment');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dmkygab_property_portal');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Tenant.deleteMany({});
    await MaintenanceRequest.deleteMany({});
    await Lease.deleteMany({});
    await Payment.deleteMany({});

    // Create users
    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@dmkygab.com',
        password: 'Admin@123',
        phone: '555-0001',
        role: 'admin'
      },
      {
        name: 'Property Manager',
        email: 'manager@dmkygab.com',
        password: 'Manager@123',
        phone: '555-0002',
        role: 'manager'
      },
      {
        name: 'John Smith',
        email: 'john@example.com',
        password: 'Tenant@123',
        phone: '555-0101',
        role: 'tenant'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        password: 'Tenant@123',
        phone: '555-0102',
        role: 'tenant'
      }
    ]);

    // Create tenants
    console.log('Creating tenants...');
    const tenants = await Tenant.create([
      {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '555-0101',
        unit: '302',
        rent: 1500,
        status: 'active',
        leaseEnd: new Date('2025-06-30'),
        moveInDate: new Date('2024-07-01')
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '555-0102',
        unit: '105',
        rent: 1800,
        status: 'active',
        leaseEnd: new Date('2025-08-15'),
        moveInDate: new Date('2024-08-15')
      },
      {
        name: 'Mike Davis',
        email: 'mike@example.com',
        phone: '555-0103',
        unit: '201',
        rent: 1350,
        status: 'active',
        leaseEnd: new Date('2025-12-01'),
        moveInDate: new Date('2024-12-01')
      },
      {
        name: 'Jane Williams',
        email: 'jane@example.com',
        phone: '555-0104',
        unit: '205',
        rent: 1500,
        status: 'active',
        leaseEnd: new Date('2025-03-20'),
        moveInDate: new Date('2024-03-20')
      },
      {
        name: 'Robert Chen',
        email: 'robert@example.com',
        phone: '555-0105',
        unit: '308',
        rent: 1800,
        status: 'active',
        leaseEnd: new Date('2025-07-10'),
        moveInDate: new Date('2024-07-10')
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa@example.com',
        phone: '555-0106',
        unit: '410',
        rent: 1350,
        status: 'active',
        leaseEnd: new Date('2025-05-15'),
        moveInDate: new Date('2024-05-15')
      }
    ]);

    // Create leases
    console.log('Creating leases...');
    const leases = await Lease.create([
      {
        unit: '302',
        tenant: 'John Smith',
        tenantId: tenants[0]._id,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2025-06-30'),
        rent: 1500,
        deposit: 1500,
        status: 'active'
      },
      {
        unit: '105',
        tenant: 'Sarah Johnson',
        tenantId: tenants[1]._id,
        startDate: new Date('2024-08-15'),
        endDate: new Date('2025-08-15'),
        rent: 1800,
        deposit: 1800,
        status: 'active'
      },
      {
        unit: '201',
        tenant: 'Mike Davis',
        tenantId: tenants[2]._id,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-12-01'),
        rent: 1350,
        deposit: 1350,
        status: 'active'
      },
      {
        unit: '205',
        tenant: 'Jane Williams',
        tenantId: tenants[3]._id,
        startDate: new Date('2024-03-20'),
        endDate: new Date('2025-03-20'),
        rent: 1500,
        deposit: 1500,
        status: 'active'
      }
    ]);

    // Create maintenance requests
    console.log('Creating maintenance requests...');
    await MaintenanceRequest.create([
      {
        unit: '302',
        tenant: 'John Smith',
        tenantId: tenants[0]._id,
        issue: 'Water Leak',
        description: 'Leak under kitchen sink',
        priority: 'urgent',
        status: 'open',
        category: 'plumbing',
        assignedTo: 'Tom Wilson'
      },
      {
        unit: '105',
        tenant: 'Sarah Johnson',
        tenantId: tenants[1]._id,
        issue: 'HVAC Repair',
        description: 'Air conditioning not cooling properly',
        priority: 'high',
        status: 'in-progress',
        category: 'hvac',
        assignedTo: 'Tom Wilson'
      },
      {
        unit: '201',
        tenant: 'Mike Davis',
        tenantId: tenants[2]._id,
        issue: 'Door Lock Replacement',
        description: 'Front door lock is sticking',
        priority: 'normal',
        status: 'open',
        category: 'other'
      },
      {
        unit: '410',
        tenant: 'Lisa Anderson',
        tenantId: tenants[5]._id,
        issue: 'Appliance Repair',
        description: 'Refrigerator not cooling',
        priority: 'normal',
        status: 'completed',
        category: 'appliance',
        assignedTo: 'Sarah Lee',
        completedAt: new Date('2024-11-25')
      },
      {
        unit: '308',
        tenant: 'Robert Chen',
        tenantId: tenants[4]._id,
        issue: 'Electrical Issue',
        description: 'Outlet not working in bedroom',
        priority: 'high',
        status: 'in-progress',
        category: 'electrical',
        assignedTo: 'Mike Torres'
      }
    ]);

    // Create payments
    console.log('Creating payments...');
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    await Payment.create([
      {
        unit: '302',
        tenant: 'John Smith',
        tenantId: tenants[0]._id,
        amount: 1500,
        type: 'rent',
        method: 'bank transfer',
        status: 'paid',
        dueDate: lastMonth,
        paidDate: lastMonth
      },
      {
        unit: '105',
        tenant: 'Sarah Johnson',
        tenantId: tenants[1]._id,
        amount: 1800,
        type: 'rent',
        method: 'check',
        status: 'paid',
        dueDate: lastMonth,
        paidDate: lastMonth
      },
      {
        unit: '201',
        tenant: 'Mike Davis',
        tenantId: tenants[2]._id,
        amount: 1350,
        type: 'rent',
        method: 'online',
        status: 'paid',
        dueDate: lastMonth,
        paidDate: lastMonth
      },
      {
        unit: '205',
        tenant: 'Jane Williams',
        tenantId: tenants[3]._id,
        amount: 1500,
        type: 'rent',
        method: 'pending',
        status: 'pending',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      },
      {
        unit: '308',
        tenant: 'Robert Chen',
        tenantId: tenants[4]._id,
        amount: 1800,
        type: 'rent',
        method: 'pending',
        status: 'pending',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      },
      {
        unit: '410',
        tenant: 'Lisa Anderson',
        tenantId: tenants[5]._id,
        amount: 1350,
        type: 'rent',
        method: 'pending',
        status: 'overdue',
        dueDate: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 25)
      }
    ]);

    console.log('✓ Database seeded successfully!');
    console.log('\nDefault login credentials:');
    console.log('Admin: admin@dmkygab.com / Admin@123');
    console.log('Manager: manager@dmkygab.com / Manager@123');
    console.log('Tenant: john@example.com / Tenant@123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

connectDB().then(() => {
  seedData();
});
