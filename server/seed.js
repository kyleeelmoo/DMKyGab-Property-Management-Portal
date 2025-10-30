const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Tenant = require('./models/Tenant');
const MaintenanceRequest = require('./models/MaintenanceRequest');
const Lease = require('./models/Lease');
const Payment = require('./models/Payment');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany();
        await Tenant.deleteMany();
        await MaintenanceRequest.deleteMany();
        await Lease.deleteMany();
        await Payment.deleteMany();

        console.log('Data cleared...');

        // Create users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@dmkygab.com',
                phone: '555-0001',
                password: 'Admin@123',
                role: 'admin'
            },
            {
                name: 'Property Manager',
                email: 'manager@dmkygab.com',
                phone: '555-0002',
                password: 'Manager@123',
                role: 'manager'
            },
            {
                name: 'John Smith',
                email: 'john@example.com',
                phone: '555-0101',
                password: 'Tenant@123',
                role: 'tenant'
            }
        ]);

        console.log('Users created...');

        // Create tenants
        const tenants = await Tenant.create([
            {
                name: 'John Smith',
                unit: '302',
                email: 'john@example.com',
                phone: '555-0101',
                rent: 1500,
                status: 'active',
                leaseEnd: new Date('2025-06-30'),
                userId: users[2]._id
            },
            {
                name: 'Sarah Johnson',
                unit: '105',
                email: 'sarah@example.com',
                phone: '555-0102',
                rent: 1800,
                status: 'active',
                leaseEnd: new Date('2025-08-15')
            },
            {
                name: 'Mike Davis',
                unit: '201',
                email: 'mike@example.com',
                phone: '555-0103',
                rent: 1350,
                status: 'active',
                leaseEnd: new Date('2025-12-01')
            },
            {
                name: 'Jane Williams',
                unit: '205',
                email: 'jane@example.com',
                phone: '555-0104',
                rent: 1500,
                status: 'active',
                leaseEnd: new Date('2025-03-20')
            },
            {
                name: 'Robert Chen',
                unit: '308',
                email: 'robert@example.com',
                phone: '555-0105',
                rent: 1800,
                status: 'active',
                leaseEnd: new Date('2025-07-10')
            },
            {
                name: 'Lisa Anderson',
                unit: '410',
                email: 'lisa@example.com',
                phone: '555-0106',
                rent: 1350,
                status: 'active',
                leaseEnd: new Date('2025-05-15')
            }
        ]);

        console.log('Tenants created...');

        // Create maintenance requests
        await MaintenanceRequest.create([
            {
                unit: '302',
                tenant: 'John Smith',
                tenantId: tenants[0]._id,
                issue: 'Water Leak',
                description: 'Kitchen sink is leaking water',
                priority: 'urgent',
                status: 'open',
                assignedTo: 'Tom Wilson'
            },
            {
                unit: '105',
                tenant: 'Sarah Johnson',
                tenantId: tenants[1]._id,
                issue: 'HVAC Repair',
                description: 'Air conditioning not working',
                priority: 'high',
                status: 'in-progress',
                assignedTo: 'Tom Wilson'
            },
            {
                unit: '201',
                tenant: 'Mike Davis',
                tenantId: tenants[2]._id,
                issue: 'Door Lock Replacement',
                description: 'Front door lock is broken',
                priority: 'normal',
                status: 'open'
            },
            {
                unit: '205',
                tenant: 'Jane Williams',
                tenantId: tenants[3]._id,
                issue: 'Appliance Repair',
                description: 'Refrigerator not cooling properly',
                priority: 'normal',
                status: 'completed',
                assignedTo: 'Sarah Lee'
            }
        ]);

        console.log('Maintenance requests created...');

        // Create leases
        await Lease.create([
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
                status: 'expiring'
            }
        ]);

        console.log('Leases created...');

        // Create payments
        await Payment.create([
            {
                unit: '302',
                tenant: 'John Smith',
                tenantId: tenants[0]._id,
                amount: 1500,
                date: new Date('2024-11-01'),
                dueDate: new Date('2024-11-01'),
                status: 'paid',
                method: 'bank transfer',
                transactionId: 'TXN123456'
            },
            {
                unit: '105',
                tenant: 'Sarah Johnson',
                tenantId: tenants[1]._id,
                amount: 1800,
                date: new Date('2024-11-01'),
                dueDate: new Date('2024-11-01'),
                status: 'paid',
                method: 'check',
                transactionId: 'CHK789012'
            },
            {
                unit: '410',
                tenant: 'Lisa Anderson',
                tenantId: tenants[5]._id,
                amount: 1350,
                dueDate: new Date('2024-11-25'),
                status: 'overdue',
                method: 'pending'
            },
            {
                unit: '205',
                tenant: 'Jane Williams',
                tenantId: tenants[3]._id,
                amount: 1500,
                dueDate: new Date('2024-12-01'),
                status: 'pending',
                method: 'pending'
            },
            {
                unit: '308',
                tenant: 'Robert Chen',
                tenantId: tenants[4]._id,
                amount: 1800,
                dueDate: new Date('2024-12-01'),
                status: 'pending',
                method: 'pending'
            }
        ]);

        console.log('Payments created...');

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

connectDB().then(() => seedData());
