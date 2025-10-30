# DMKyGab Property Management Portal

A comprehensive, full-stack property management portal featuring secure authentication, tenant management, maintenance tracking, lease management, and financial analytics.

## Features

### 🔐 Authentication & Security
- JWT-based secure authentication
- Password hashing with bcryptjs
- Role-based access control (Admin, Property Manager, Tenant)
- Session management with token validation
- Form validation (email format, password strength)

### 📊 Dashboard Features
- **Tenant Management**: View, add, edit, and manage tenant profiles
- **Maintenance Requests**: Track and update maintenance tickets with priority levels
- **Lease Management**: Monitor lease terms, renewal dates, and documents
- **Financial Management**: Track rent payments, invoices, and payment history
- **Analytics Dashboard**: View statistics and trends

### 🎨 User Interface
- Responsive design for mobile, tablet, and desktop
- Loading spinners for async operations
- Toast notifications for user feedback
- Modal dialogs for forms and confirmations
- Clean and modern UI with animations

### 🔔 Additional Features
- Real-time notifications panel
- Search and filter functionality
- Payment statistics and analytics
- Role-based feature access
- Seed data for testing

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Responsive CSS Grid and Flexbox layouts
- Custom toast notifications and modals

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- CORS enabled for cross-origin requests
- Express Validator for input validation

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update the `.env` file with your configuration:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/dmkygab-property-portal
   JWT_SECRET=your-secret-key-change-this-in-production
   JWT_EXPIRE=30d
   ```

4. **Start MongoDB**
   - If using local MongoDB:
   ```bash
   mongod
   ```
   - Or use MongoDB Atlas and update the `MONGODB_URI` in `.env`

5. **Seed the database** (optional but recommended for testing)
   ```bash
   npm run seed
   ```
   This will create sample users, tenants, maintenance requests, leases, and payments.

6. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The frontend will be served from the root directory

## Default Test Accounts

After seeding the database, you can login with:

**Admin Account:**
- Email: `admin@dmkygab.com`
- Password: `Admin@123`

**Property Manager Account:**
- Email: `manager@dmkygab.com`
- Password: `Manager@123`

**Tenant Account:**
- Email: `john@example.com`
- Password: `Tenant@123`

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Body: {
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-0101",
  "password": "Password@123",
  "role": "tenant" // or "admin", "manager"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "john@example.com",
  "password": "Password@123"
}
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer <token>
```

### Tenant Endpoints

```
GET    /api/tenants              - Get all tenants
GET    /api/tenants/:id          - Get single tenant
POST   /api/tenants              - Create new tenant (Admin, Manager)
PUT    /api/tenants/:id          - Update tenant (Admin, Manager)
DELETE /api/tenants/:id          - Delete tenant (Admin)
```

### Maintenance Request Endpoints

```
GET    /api/maintenance          - Get all maintenance requests
GET    /api/maintenance/:id      - Get single maintenance request
POST   /api/maintenance          - Create new maintenance request
PUT    /api/maintenance/:id      - Update maintenance request
DELETE /api/maintenance/:id      - Delete maintenance request (Admin, Manager)
```

### Lease Endpoints

```
GET    /api/leases               - Get all leases
GET    /api/leases/:id           - Get single lease
POST   /api/leases               - Create new lease (Admin, Manager)
PUT    /api/leases/:id           - Update lease (Admin, Manager)
DELETE /api/leases/:id           - Delete lease (Admin)
```

### Payment Endpoints

```
GET    /api/payments             - Get all payments
GET    /api/payments/stats       - Get payment statistics (Admin, Manager)
GET    /api/payments/:id         - Get single payment
POST   /api/payments             - Create new payment
PUT    /api/payments/:id         - Update payment (Admin, Manager)
DELETE /api/payments/:id         - Delete payment (Admin)
```

## Database Schema

### User Schema
- name: String (required)
- email: String (required, unique)
- phone: String (required)
- password: String (required, hashed)
- role: String (enum: admin, manager, tenant)
- createdAt: Date

### Tenant Schema
- name: String (required)
- unit: String (required)
- email: String (required)
- phone: String (required)
- rent: Number (required)
- status: String (enum: active, pending, inactive)
- leaseEnd: Date (required)
- userId: ObjectId (ref: User)
- createdAt: Date

### MaintenanceRequest Schema
- unit: String (required)
- tenant: String (required)
- tenantId: ObjectId (ref: Tenant)
- issue: String (required)
- description: String
- priority: String (enum: urgent, high, normal, low)
- status: String (enum: open, in-progress, completed, cancelled)
- assignedTo: String
- createdAt: Date
- updatedAt: Date

### Lease Schema
- unit: String (required)
- tenant: String (required)
- tenantId: ObjectId (ref: Tenant)
- startDate: Date (required)
- endDate: Date (required)
- rent: Number (required)
- deposit: Number (required)
- status: String (enum: active, expiring, expired, terminated)
- document: String
- createdAt: Date

### Payment Schema
- unit: String (required)
- tenant: String (required)
- tenantId: ObjectId (ref: Tenant)
- amount: Number (required)
- date: Date
- dueDate: Date
- status: String (enum: paid, pending, overdue, partial)
- method: String (enum: cash, check, bank transfer, credit card, pending)
- transactionId: String
- notes: String
- createdAt: Date

## Project Structure

```
DMKyGab-Property-Management-Portal/
├── server/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── tenantController.js   # Tenant management logic
│   │   ├── maintenanceController.js
│   │   ├── leaseController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── auth.js               # JWT authentication middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Tenant.js             # Tenant schema
│   │   ├── MaintenanceRequest.js
│   │   ├── Lease.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   ├── tenants.js            # Tenant routes
│   │   ├── maintenance.js
│   │   ├── leases.js
│   │   └── payments.js
│   ├── seed.js                   # Database seeding script
│   └── server.js                 # Main server file
├── assets/
│   ├── css/
│   │   └── main.css              # Main stylesheet
│   └── js/
│       ├── api.js                # API helper functions
│       ├── utils.js              # UI utilities (toast, spinner, modal)
│       └── app.js                # Main application logic
├── index.html                    # Main HTML file
├── package.json
├── .env                          # Environment variables (not in git)
├── .env.example                  # Example environment variables
└── README.md
```

## Security Features

1. **Password Security**: All passwords are hashed using bcryptjs before storage
2. **JWT Authentication**: Secure token-based authentication
3. **Role-Based Access Control**: Different permissions for Admin, Manager, and Tenant roles
4. **Input Validation**: Email, password, and phone number validation
5. **CORS Protection**: Configured CORS for secure cross-origin requests

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon for auto-restart on file changes.

### API Testing
You can test the API endpoints using:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Any REST client

Example cURL request:
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-0123",
    "password": "Test@123",
    "role": "tenant"
  }'
```

## Future Enhancements

- [ ] Chart.js integration for advanced analytics
- [ ] Email notifications for rent due and maintenance updates
- [ ] Document upload functionality for leases
- [ ] Advanced search and filtering
- [ ] Export data to PDF/CSV
- [ ] Multi-property support
- [ ] Tenant portal for self-service
- [ ] Payment gateway integration
- [ ] Calendar view for lease renewals and maintenance

## License

MIT License

## Support

For issues and questions, please create an issue in the GitHub repository.
