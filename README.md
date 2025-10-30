# DMKyGab Property Management Portal - MorataKGab

A modern, responsive property management portal featuring secure authentication, comprehensive tenant and maintenance management, and an elegant user interface. Built with vanilla JavaScript, HTML5, and CSS3.

## ✨ Features

### Authentication & Security
- **Secure Login & Registration** - User authentication with email and password
- **Role-Based Access Control** - Support for Admin, Property Manager, and Tenant roles
- **Password Validation** - Strong password requirements with real-time feedback
- **Session Management** - Remember me functionality with localStorage

### Dashboard
- **Analytics Cards** - Key metrics including total tenants, rent collected, pending maintenance, and active leases
- **Recent Activity** - Real-time view of maintenance requests and rent payments
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Tenant Management
- **Complete Tenant Directory** - View all tenants with detailed information
- **Search & Filter** - Find tenants by name, unit, or email
- **Add New Tenants** - Modal-based form for adding tenants
- **Tenant Details** - View comprehensive tenant information

### Maintenance Requests
- **Request Tracking** - Monitor all maintenance requests with priority levels
- **Status Management** - Track requests from open to completed
- **New Request Form** - Easy-to-use modal for submitting new requests
- **Priority Filtering** - Filter by urgent, high, normal, or low priority

### Lease Management
- **Active Leases Overview** - Track all current leases
- **Expiration Alerts** - Notifications for leases expiring soon
- **Lease Details** - Complete lease information and terms

### Financial Management
- **Rent Tracking** - Monitor rent payments and due dates
- **Payment History** - View complete payment records
- **Overdue Alerts** - Automatic notifications for overdue payments

### Notifications
- **Real-Time Alerts** - Rent due reminders, maintenance updates, lease expirations
- **Notification Panel** - Dedicated panel with notification history
- **Badge Counters** - Visual indicators for unread notifications

### User Experience
- **Loading Spinners** - Visual feedback for all async operations
- **Toast Notifications** - Success, error, and info messages
- **Modal Dialogs** - Clean, accessible forms for data entry
- **Smooth Animations** - Polished transitions and interactions

## 🎨 Branding

- **Theme**: Ultra Violet gradient (#5f27cd to #341f97)
- **Brand Name**: MorataKGab
- **Created By**: MSheryll & KElmo

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. Open `index.html` in your browser or serve with a local server:
   ```bash
   python3 -m http.server 8080
   ```

3. Access the portal at `http://localhost:8080`

## 📱 Mobile Responsive

The portal is fully optimized for all devices:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🌐 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to Vercel with custom domain configuration.

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal)

## 📂 Project Structure

```
DMKyGab-Property-Management-Portal/
├── index.html                 # Main application entry point
├── assets/
│   ├── css/
│   │   ├── main.css          # Main stylesheet
│   │   └── style.css         # Additional styles
│   └── js/
│       ├── app.js            # Main application logic
│       ├── login.js          # Authentication
│       ├── dashboard.js      # Dashboard functionality
│       ├── maintenance.js    # Maintenance management
│       └── ...               # Other modules
├── modules/                   # Additional HTML modules
├── vercel.json               # Vercel deployment config
├── DEPLOYMENT.md             # Deployment guide
└── README.md                 # This file
```

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Icons**: Font Awesome 6.4.0
- **Hosting**: Vercel
- **Domain**: kyliigabriella.xyz (custom domain)

## 📋 Features in Detail

### Authentication System
- Client-side authentication (demo mode)
- Password strength validation
- Email format validation
- Role selection during registration
- Persistent login with localStorage

### Dashboard Analytics
- Total Tenants counter with growth percentage
- Rent Collected with monthly comparison
- Pending Maintenance with urgent count
- Active Leases with expiration warnings

### Interactive Forms
- Add Tenant modal with validation
- Add Maintenance Request with priority selection
- All forms include loading states and error handling

## 🎯 Future Enhancements

- Backend integration with Node.js/Express or Python/Flask
- SMS verification via Twilio
- Real-time updates with WebSockets
- PDF report generation
- Email notifications
- Payment gateway integration
- Advanced analytics with charts
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contact

**Maintainer**: [kyleeelmoo](https://github.com/kyleeelmoo)

**Website**: [kyliigabriella.xyz](https://kyliigabriella.xyz)

---

**Created by MSheryll & KElmo** - MorataKGab Property Management Portal
