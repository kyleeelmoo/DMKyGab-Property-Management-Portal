# DMKyGab Property Management Portal

A comprehensive, responsive property management portal with secure authentication, role-based access control, and full CRUD operations for managing tenants, maintenance requests, leases, and payments.

## Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin, Manager, Tenant)
- Form validation on both client and server
- Password strength requirements

### 📊 Dashboard
- Real-time statistics and metrics
- Recent maintenance requests
- Upcoming rent payments
- Lease expiration alerts
- Interactive analytics

### 👥 Tenant Management
- View, add, edit, and delete tenant profiles
- Track lease status and end dates
- Contact information management
- Search and filter capabilities

### 🔧 Maintenance Requests
- Create and track maintenance requests
- Priority levels (Urgent, High, Normal, Low)
- Status tracking (Open, In-Progress, Completed)
- Assignment to maintenance staff
- Category classification

### 📄 Lease Management
- Complete lease lifecycle management
- Lease terms and renewal dates
- Document storage capability
- Expiration notifications

### 💰 Financial Management
- Rent payment tracking
- Invoice generation
- Payment history
- Overdue payment alerts
- Multiple payment methods

### 📈 Analytics
- Revenue trends and charts
- Maintenance statistics
- Occupancy rates
- Performance metrics

### 📱 Responsive Design
- Mobile-optimized interface
- Hamburger menu navigation
- Adaptive layouts
- Touch-friendly controls

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Responsive CSS with Flexbox/Grid
- Font Awesome icons
- Chart.js for analytics visualization

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

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
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the following:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret key for JWT tokens
   - Email configuration (optional, for notifications)

4. **Start MongoDB**
   ```bash
   # On macOS/Linux
   mongod

   # On Windows
   net start MongoDB
   ```

5. **Seed the database** (optional but recommended for testing)
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

7. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Default Login Credentials

After seeding the database, you can use these credentials:

- **Admin**: admin@dmkygab.com / Admin@123
- **Manager**: manager@dmkygab.com / Manager@123
- **Tenant**: john@example.com / Tenant@123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Tenants
- `GET /api/tenants` - Get all tenants (Admin, Manager)
- `GET /api/tenants/:id` - Get single tenant
- `POST /api/tenants` - Create tenant (Admin, Manager)
- `PUT /api/tenants/:id` - Update tenant (Admin, Manager)
- `DELETE /api/tenants/:id` - Delete tenant (Admin)

### Maintenance Requests
- `GET /api/maintenance` - Get all requests
- `GET /api/maintenance/:id` - Get single request
- `POST /api/maintenance` - Create request
- `PUT /api/maintenance/:id` - Update request (Admin, Manager)
- `DELETE /api/maintenance/:id` - Delete request (Admin)

### Leases
- `GET /api/leases` - Get all leases (Admin, Manager)
- `GET /api/leases/:id` - Get single lease
- `POST /api/leases` - Create lease (Admin, Manager)
- `PUT /api/leases/:id` - Update lease (Admin, Manager)
- `DELETE /api/leases/:id` - Delete lease (Admin)

### Payments
- `GET /api/payments` - Get all payments (Admin, Manager)
- `GET /api/payments/:id` - Get single payment
- `POST /api/payments` - Create payment (Admin, Manager)
- `PUT /api/payments/:id` - Update payment (Admin, Manager)
- `DELETE /api/payments/:id` - Delete payment (Admin)

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics (Admin, Manager)
- `GET /api/analytics/revenue` - Revenue trends (Admin, Manager)
- `GET /api/analytics/maintenance` - Maintenance statistics (Admin, Manager)
- `GET /api/analytics/occupancy` - Occupancy statistics (Admin, Manager)

## Project Structure

```
DMKyGab-Property-Management-Portal/
├── assets/
│   ├── css/           # Stylesheets
│   └── js/            # Frontend JavaScript
├── server/
│   ├── config/        # Database configuration
│   ├── middleware/    # Express middleware
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── utils/         # Helper functions
│   ├── server.js      # Main server file
│   └── seedData.js    # Database seeding script
├── index.html         # Main HTML file
├── package.json       # Dependencies and scripts
└── .env.example       # Environment variables template
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token-based authentication
- Protected API routes
- Role-based authorization
- Input validation and sanitization
- Secure password requirements (min 8 chars, uppercase, lowercase, number, special char)

## Development

### Running in Development Mode
```bash
npm run dev
```
This uses nodemon to automatically restart the server when files change.

### Database Seeding
```bash
npm run seed
```
This will populate the database with sample data for testing.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@dmkygab.com or create an issue in the repository.

## Acknowledgments

- Font Awesome for icons
- Chart.js for analytics visualization
- MongoDB team for the excellent database
- Express.js community
