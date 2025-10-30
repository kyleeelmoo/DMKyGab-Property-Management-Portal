# DMKyGab-Property-Management-Portal

A responsive building management portal featuring secure registration, email-based authentication with verification codes, admin approval system, and a user-friendly, animated interface. The platform is designed for building superintendents and maintenance managers to track tasks, schedules, work orders, compliance, inspections, assets, and more.

## Features

### Authentication & Security
- **Secure Login & Registration:** Email and password-based authentication with encrypted password storage (bcrypt)
- **Email Verification:** Registration and login require time-bound verification codes sent to users' email addresses
- **Admin Approval System:** New user registrations require manual approval by administrators
- **Rate Limiting:** Protection against abuse of email authentication and login attempts
- **JWT Tokens:** Secure session management with JSON Web Tokens
- **Password Requirements:** Enforced strong password policies (min 8 characters, uppercase, lowercase, number, special character)

### Property Management
- **Dashboard:** Overview of properties, tenants, maintenance requests, and financial metrics
- **Tenant Management:** Track tenant information, leases, and payments
- **Maintenance Requests:** Create and manage maintenance tickets with priority levels
- **Lease Management:** Monitor active leases and expiration dates
- **Financial Management:** Track rent payments, invoices, and revenue
- **Analytics:** View detailed statistics and performance metrics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Email account for sending verification codes (Gmail recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the example environment file and update with your values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and configure:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # JWT Secret (Generate a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Email Configuration (using Gmail as example)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password

   # Admin Email (to notify about new registrations)
   ADMIN_EMAIL=admin@example.com
   ```

   **Important:** For Gmail, you need to:
   - Enable 2-factor authentication
   - Generate an App-Specific Password: https://myaccount.google.com/apppasswords
   - Use the app-specific password in `EMAIL_PASSWORD`

4. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the portal:**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Authentication System Setup

### User Registration Flow

1. **User fills registration form** with name, email, phone, role, and password
2. **Email verification:**
   - Click "Send Verification Code" button
   - A 6-digit code is sent to the provided email address
   - Code expires in 15 minutes (configurable)
   - Enter the code to verify the email address
3. **Submit registration:**
   - User submits the form after email verification
   - Account is created with "pending" status
4. **Admin notification:**
   - Admin receives email notification about new registration
5. **Admin approval:**
   - Admin logs in and approves or rejects the registration
   - User receives email notification about approval decision
6. **Login:**
   - Once approved, user can log in with email and password

### Admin Approval

The first user can be manually approved in the database to become an admin:

```bash
# Access SQLite database
sqlite3 server/database.db

# Update user status to approved and set role to admin
UPDATE users SET status = 'approved', role = 'admin' WHERE email = 'admin@example.com';

# Exit
.exit
```

Once logged in as admin, you can approve other users through the admin panel.

### Security Features

1. **Password Encryption:**
   - Passwords are hashed using bcrypt with 10 salt rounds
   - Original passwords are never stored

2. **Email Verification:**
   - Time-bound codes (15 minutes default)
   - One-time use codes
   - Rate limiting on code requests (5 requests per 15 minutes per IP)

3. **Rate Limiting:**
   - Email verification: 5 requests per 15 minutes per IP
   - Login attempts: 10 attempts per 15 minutes per IP
   - Registration: 3 attempts per hour per IP

4. **JWT Tokens:**
   - 24-hour expiration
   - Secure token validation on protected routes

## API Endpoints

### Authentication
- `POST /api/auth/send-verification-code` - Send verification code to email
- `POST /api/auth/verify-code` - Verify email code
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Admin (Requires admin role)
- `GET /api/admin/pending-users` - Get all pending users
- `GET /api/admin/users` - Get all users
- `POST /api/admin/approve-user/:userId` - Approve user registration
- `POST /api/admin/reject-user/:userId` - Reject user registration
- `GET /api/admin/user/:userId` - Get user details and login history

## Configuration Options

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `EMAIL_HOST` | SMTP server hostname | smtp.gmail.com |
| `EMAIL_PORT` | SMTP server port | 587 |
| `EMAIL_USER` | Email account username | Required |
| `EMAIL_PASSWORD` | Email account password | Required |
| `ADMIN_EMAIL` | Admin notification email | Required |
| `VERIFICATION_CODE_EXPIRY` | Code expiry in minutes | 15 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 5 |

## Database Schema

The application uses SQLite with the following tables:

### users
- `id` - Primary key
- `name` - Full name
- `email` - Unique email address
- `phone` - Phone number
- `password_hash` - Encrypted password
- `role` - User role (admin, manager, tenant)
- `status` - Account status (pending, approved, rejected)
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### verification_codes
- `id` - Primary key
- `email` - Email address
- `code` - 6-digit verification code
- `type` - Code type (registration, login)
- `expires_at` - Expiration timestamp
- `used` - Whether code has been used
- `created_at` - Creation timestamp

### login_history
- `id` - Primary key
- `user_id` - Foreign key to users table
- `ip_address` - Login IP address
- `user_agent` - Browser user agent
- `login_at` - Login timestamp

## Troubleshooting

### Email Not Sending

1. Check your email credentials in `.env`
2. For Gmail, ensure you're using an App-Specific Password
3. Check that 2FA is enabled on your Google account
4. Verify SMTP settings are correct
5. Check server logs for detailed error messages

### Cannot Login After Registration

- Verify your account status is "approved" in the database
- Check that you received the approval email
- Contact the administrator to approve your account

### Rate Limit Errors

- Wait for the rate limit window to reset (15 minutes)
- Contact administrator if you believe this is an error

## Development

### Project Structure

```
DMKyGab-Property-Management-Portal/
├── server/                 # Backend server code
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
├── assets/                # Frontend assets
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
├── index.html            # Main HTML file
├── package.json          # Dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Contact

Maintainer: [kyleeelmoo](https://github.com/kyleeelmoo)

## Support

For issues or questions:
- Open an issue on GitHub
- Contact the development team
- Check the troubleshooting section above
