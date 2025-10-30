# DMKyGab Property Management Portal

A modern, responsive property management portal featuring secure authentication, intuitive dashboard, and comprehensive management tools for building superintendents and property managers to track tasks, schedules, work orders, compliance, inspections, and more.

## 🌟 Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices
- **Secure Authentication**: User login and registration with password validation
- **SMS Verification**: Phone verification support via Twilio integration (optional)
- **Dashboard**: Real-time overview of properties, tenants, and maintenance
- **Tenant Management**: Track tenant information, leases, and payments
- **Maintenance Tracking**: Manage work orders with priority levels
- **Lease Management**: Monitor active leases and expiration dates
- **Financial Management**: Track rent collection and payments
- **Analytics**: Visual reports and insights

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- For SMS features: Twilio account (optional)
- For deployment: Vercel account (or similar static hosting)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Open locally**
   Simply open `index.html` in your web browser, or use a local server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server -p 8000
   
   # Using PHP
   php -S localhost:8000
   ```
   
   Then navigate to `http://localhost:8000`

## 📦 Deployment

### Deploy to Vercel (Recommended)

Vercel offers free hosting for static sites with automatic HTTPS and global CDN.

#### Option 1: Deploy via Vercel Dashboard

1. **Sign up/Login** to [Vercel](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Vercel will auto-detect the configuration
5. Click **"Deploy"**
6. Your site will be live at `https://your-project.vercel.app`

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd DMKyGab-Property-Management-Portal
vercel

# For production deployment
vercel --prod
```

### Deploy to Netlify

1. **Sign up/Login** to [Netlify](https://netlify.com)
2. Drag and drop your project folder to Netlify dashboard
3. Or use GitHub integration for automatic deployments

### Deploy to GitHub Pages

1. **Enable GitHub Pages** in your repository settings
2. Select the branch to deploy (e.g., `main`)
3. Your site will be available at `https://yourusername.github.io/DMKyGab-Property-Management-Portal`

## 🔧 Environment Setup

### For SMS Verification (Optional)

If you want to enable SMS verification for user registration:

1. **Create a Twilio account**
   - Visit [Twilio](https://www.twilio.com/) and sign up
   - Get your Account SID, Auth Token, and Twilio Phone Number

2. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your Twilio credentials
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_number
   ```

3. **Backend Integration Required**
   - The current version is frontend-only
   - To enable SMS, you need a backend (Node.js, Python, etc.)
   - See [Backend Setup Guide](#backend-setup-optional) below

### Vercel Environment Variables

If deploying to Vercel with a backend:

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add your variables:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

## 🔨 Backend Setup (Optional)

For SMS verification and persistent data storage, integrate a backend:

### Node.js/Express Example

```javascript
// server.js
const express = require('express');
const twilio = require('twilio');
const app = express();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/api/send-verification', async (req, res) => {
  const { phone } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000);
  
  await client.messages.create({
    body: `Your verification code is: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone
  });
  
  res.json({ success: true });
});

app.listen(3000);
```

### Python/Flask Example

See `README_Version4.md` for a complete Flask example.

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login functionality works
- [ ] Registration with validation works
- [ ] Dashboard displays correctly
- [ ] Navigation between pages works
- [ ] Responsive design on mobile devices
- [ ] All interactive elements respond to clicks/touches
- [ ] Forms validate input correctly

### Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 13+)
- ✅ Chrome Mobile (Android 8+)

## 🐛 Troubleshooting

### Common Issues

#### CSS/JS not loading after deployment

**Problem**: Styles or scripts don't load on deployed site

**Solution**: 
- Check that all asset paths use relative paths (they do)
- Verify `vercel.json` is properly configured
- Clear browser cache and hard reload (Ctrl+Shift+R)

#### Mobile menu not working

**Problem**: Sidebar doesn't toggle on mobile

**Solution**: 
- Ensure JavaScript is enabled
- Check browser console for errors
- Try a hard refresh

#### Cannot deploy to Vercel

**Problem**: Deployment fails or errors

**Solution**:
- Ensure `vercel.json` exists in root directory
- Check that file names don't have spaces
- Review Vercel deployment logs
- Ensure you're on the correct branch

#### Environment variables not working

**Problem**: API keys or config not loading

**Solution**:
- In Vercel: Set environment variables in dashboard
- Never commit `.env` file to git
- Use `.env.example` as template
- Restart deployment after adding variables

### Debug Mode

To enable console logging for debugging:

```javascript
// In assets/js/app.js, uncomment debug lines
const DEBUG = true;
if (DEBUG) console.log('Debug message');
```

## 📱 Mobile Responsiveness

The portal is built with mobile-first responsive design:

- **Mobile (320px - 767px)**: Single column, collapsible sidebar
- **Tablet (768px - 1024px)**: Adaptive layout with slide-out menu
- **Desktop (1025px+)**: Full sidebar and multi-column layouts

All touch targets are minimum 44px for accessibility.

## 🔒 Security

### Security Features

- ✅ XSS Protection headers
- ✅ Content Security Policy ready
- ✅ No inline scripts (CSP compatible)
- ✅ HTTPS enforced on deployment
- ✅ Secure password validation
- ✅ Environment variables for secrets

### Best Practices

1. **Never commit secrets**: Use environment variables
2. **HTTPS only**: Always use HTTPS in production
3. **Input validation**: All forms validate user input
4. **Regular updates**: Keep dependencies updated

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team Family Environment

This portal is optimized for Team Family deployment environments with:
- Shared authentication support
- Multi-user access levels
- Collaborative features
- Secure data isolation

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Contact: [kyleeelmoo](https://github.com/kyleeelmoo)

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Real-time notifications
- [ ] Document management system
- [ ] Mobile app (React Native)
- [ ] Advanced reporting and analytics
- [ ] Multi-language support

---

**Built with ❤️ for property managers and superintendents**
