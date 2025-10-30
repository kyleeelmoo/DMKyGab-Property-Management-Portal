# DMKyGab Property Management Portal

A responsive building management portal featuring secure registration, SMS-based phone verification (via Twilio), and a user-friendly, animated interface. The platform is designed for building superintendents and maintenance managers to track tasks, schedules, work orders, compliance, inspections, assets, and more.

## 🌐 Live Demo

Access the live application at: **[https://dmkygab-webportal-ixw680apc-gabbydommor.vercel.app](https://dmkygab-webportal-ixw680apc-gabbydommor.vercel.app)**

## ✨ Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop devices
- **Dashboard:** Real-time overview of property management metrics
- **Tenant Management:** Track tenant information, leases, and contacts
- **Maintenance Requests:** Manage work orders and track completion status
- **Lease Management:** Monitor active leases and expiration dates
- **Financial Management:** Track rent payments and financial metrics
- **Analytics:** Visualize property performance with charts and reports
- **User Authentication:** Secure login and registration system
- **SMS Verification:** Phone verification via Twilio (requires backend)
- **Notifications:** Real-time alerts for important events

## 🚀 Deployment on Vercel

### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Git installed on your local machine
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) for command-line deployment

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Fork or Clone this Repository**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Connect to Vercel**
   - Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Custom Domain** (if needed)
   - In your Vercel project settings, go to "Domains"
   - Add your custom domain: `dmkygab-webportal-ixw680apc-gabbydommor.vercel.app`
   - Follow Vercel's DNS configuration instructions

4. **Deploy**
   - Click "Deploy" and wait for the build to complete
   - Your application will be live at the provided URL

#### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy the Project**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

### Environment Variables (Optional)

If you plan to integrate SMS verification via Twilio or a backend API:

1. Copy `.env.example` to `.env`
2. Fill in your Twilio credentials and API endpoints
3. Add these variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add each variable from your `.env` file
   - **Never commit `.env` to version control**

## 🛠️ Local Development

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Start a local server**
   
   Using Python:
   ```bash
   python3 -m http.server 8000
   ```
   
   Or using Node.js:
   ```bash
   npx serve
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Testing on Different Devices

The portal is optimized for mobile responsiveness. Test on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (iOS Safari, Chrome Mobile)
- Tablets (iPad, Android tablets)

## 🔒 Security Best Practices

### API Keys and Secrets

- **Never commit sensitive data** to version control
- Use environment variables for all API keys and secrets
- The `.gitignore` file is configured to exclude `.env` files
- For Twilio integration, store credentials in Vercel's Environment Variables

### Recommended Security Headers

The `vercel.json` configuration includes security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### HTTPS

Vercel automatically provides HTTPS for all deployments, ensuring secure data transmission.

## 📱 Mobile Optimization

The portal is fully responsive with:
- Mobile-first CSS design
- Touch-friendly navigation
- Optimized images and assets
- Fast loading times
- Progressive enhancement for modern browsers

## 🔧 SMS Verification Setup (Optional)

To enable SMS verification via Twilio:

1. **Create a Twilio Account**
   - Visit [Twilio](https://www.twilio.com/)
   - Obtain Account SID, Auth Token, and Phone Number

2. **Set Up Backend** (Flask/Node.js example in `README_Version4.md`)
   - Deploy a backend service to handle SMS
   - Configure environment variables in Vercel

3. **Update Frontend**
   - Configure API endpoints in your JavaScript files
   - Test SMS flow end-to-end

## 📄 Project Structure

```
DMKyGab-Property-Management-Portal/
├── index.html              # Main entry point
├── assets/
│   ├── css/
│   │   ├── main.css       # Primary styles
│   │   └── style.css      # Additional styles
│   └── js/
│       ├── app.js         # Main application logic
│       ├── login.js       # Authentication
│       ├── dashboard.js   # Dashboard functionality
│       ├── maintenance.js # Maintenance module
│       ├── users.js       # User management
│       └── ...
├── modules/               # HTML module templates
├── vercel.json           # Vercel configuration
├── package.json          # Project metadata
└── .env.example          # Environment variables template
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Contact

Maintainer: [kyleeelmoo](https://github.com/kyleeelmoo)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Twilio SMS API](https://www.twilio.com/docs/sms)
- [Responsive Web Design Best Practices](https://web.dev/responsive-web-design-basics/)

---

**Note:** This application is a frontend-only solution. For full functionality including SMS verification and database integration, you'll need to set up a backend service.
