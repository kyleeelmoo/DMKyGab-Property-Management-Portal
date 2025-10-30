# Security Best Practices for DMKyGab Property Management Portal

## Overview

This document outlines security best practices for deploying and maintaining the DMKyGab Property Management Portal on Vercel.

## Environment Variables and Secrets

### Never Commit Secrets

**DO NOT** commit the following to version control:
- API keys (Twilio, etc.)
- Authentication tokens
- Database credentials
- Private keys
- Passwords or sensitive configuration

### Using .env Files

1. **Local Development**
   ```bash
   # Copy the template
   cp .env.example .env
   
   # Edit with your actual credentials
   nano .env
   ```

2. **Production (Vercel)**
   - Navigate to Project Settings → Environment Variables
   - Add each variable individually
   - Select appropriate environment (Production/Preview/Development)
   - Never store secrets in code or comments

### Environment Variable Checklist

- [ ] `.env` is in `.gitignore`
- [ ] `.env.example` contains only placeholder values
- [ ] All secrets are stored in Vercel dashboard
- [ ] No hardcoded API keys in JavaScript files
- [ ] Environment-specific variables are properly scoped

## Twilio Integration Security

### Account Security

1. **Protect Credentials**
   ```bash
   # Store in environment variables only
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_secret_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

2. **Use Subaccounts** (Recommended)
   - Create Twilio subaccounts for different environments
   - Limit permissions to SMS only
   - Rotate credentials regularly

3. **Rate Limiting**
   - Implement SMS rate limiting to prevent abuse
   - Track verification attempts per phone number
   - Set daily/hourly limits on SMS sends

### SMS Verification Best Practices

```javascript
// Example: Rate limiting verification requests
const MAX_ATTEMPTS = 3;
const ATTEMPT_WINDOW = 3600000; // 1 hour in ms

function canRequestVerification(phoneNumber) {
    const attempts = getAttempts(phoneNumber);
    if (attempts.length >= MAX_ATTEMPTS) {
        const oldestAttempt = attempts[0];
        if (Date.now() - oldestAttempt < ATTEMPT_WINDOW) {
            return false; // Too many attempts
        }
    }
    return true;
}
```

## HTTP Security Headers

### Configured in vercel.json

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Additional Recommended Headers

Consider adding these to `vercel.json`:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com; img-src 'self' data: https:;"
},
{
  "key": "Referrer-Policy",
  "value": "strict-origin-when-cross-origin"
},
{
  "key": "Permissions-Policy",
  "value": "geolocation=(), microphone=(), camera=()"
}
```

## Frontend Security

### Input Validation

Always validate user input on both client and server:

```javascript
// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
}

// Password strength
function isStrongPassword(password) {
    // Min 8 chars, uppercase, lowercase, number, special char
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}
```

### XSS Prevention

1. **Sanitize User Input**
   ```javascript
   function sanitizeHTML(str) {
       const div = document.createElement('div');
       div.textContent = str;
       return div.innerHTML;
   }
   ```

2. **Use textContent instead of innerHTML**
   ```javascript
   // GOOD
   element.textContent = userInput;
   
   // AVOID (unless HTML is sanitized)
   element.innerHTML = userInput;
   ```

### CSRF Protection

For forms that modify data:

```javascript
// Generate CSRF token
function generateCSRFToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Include in forms
const token = generateCSRFToken();
sessionStorage.setItem('csrfToken', token);
```

## Authentication Security

### Password Storage (Backend Required)

**Never store passwords in plain text!**

```python
# Example: Python/Flask with bcrypt
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt(app)

# Hash password
hashed = bcrypt.generate_password_hash(password).decode('utf-8')

# Verify password
bcrypt.check_password_hash(hashed, password)
```

### Session Management

```javascript
// Session timeout
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

function checkSession() {
    const lastActivity = localStorage.getItem('lastActivity');
    if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity);
        if (elapsed > SESSION_TIMEOUT) {
            logout();
            return false;
        }
    }
    localStorage.setItem('lastActivity', Date.now());
    return true;
}
```

### Secure Logout

```javascript
function logout() {
    // Clear all session data
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies if any
    document.cookie.split(";").forEach(c => {
        document.cookie = c.replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login
    window.location.href = '/';
}
```

## HTTPS and SSL

### Vercel Automatic SSL

- Vercel provides automatic SSL certificates via Let's Encrypt
- All HTTP requests redirect to HTTPS
- Certificates auto-renew

### Force HTTPS in Application

```javascript
// Redirect HTTP to HTTPS (additional safety)
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
}
```

## Data Protection

### Sensitive Data Handling

1. **Never Log Sensitive Data**
   ```javascript
   // BAD
   console.log('Password:', password);
   
   // GOOD
   console.log('Login attempt for user:', email);
   ```

2. **Clear Sensitive Data After Use**
   ```javascript
   let password = getUserPassword();
   authenticateUser(password);
   password = null; // Clear from memory
   ```

3. **Mask Sensitive Information in UI**
   ```javascript
   function maskPhone(phone) {
       return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
   }
   
   function maskEmail(email) {
       const [name, domain] = email.split('@');
       return `${name.substring(0, 2)}***@${domain}`;
   }
   ```

## API Security (Backend Integration)

### CORS Configuration

```python
# Example: Flask CORS
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://dmkygab-webportal-ixw680apc-gabbydommor.vercel.app'])
```

### API Authentication

```javascript
// Include authentication token in requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
    
    return response.json();
}
```

### Rate Limiting

Implement rate limiting on API endpoints:

```python
# Example: Flask-Limiter
from flask_limiter import Limiter

limiter = Limiter(
    app,
    key_func=lambda: request.remote_addr,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/send_sms')
@limiter.limit("5 per hour")
def send_sms():
    # SMS sending logic
    pass
```

## Monitoring and Logging

### Security Event Logging

Log important security events:

```javascript
function logSecurityEvent(event, details) {
    console.warn(`[SECURITY] ${event}:`, {
        timestamp: new Date().toISOString(),
        user: currentUser?.email,
        ...details
    });
    
    // Send to monitoring service if available
    if (window.analytics) {
        analytics.track('Security Event', {
            event,
            ...details
        });
    }
}

// Usage
logSecurityEvent('Failed Login Attempt', { email });
logSecurityEvent('Multiple Verification Failures', { phone });
```

### Monitor for Anomalies

- Unusual login patterns
- High frequency of API requests
- Failed authentication attempts
- Unexpected data access patterns

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities (if using npm)
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Minimize Dependencies

- Only use trusted, well-maintained packages
- Review code before adding new dependencies
- Remove unused dependencies
- Pin dependency versions in production

## Compliance Considerations

### Data Privacy (GDPR, CCPA)

1. **User Consent**
   - Obtain consent for data collection
   - Provide clear privacy policy
   - Allow users to request data deletion

2. **Data Minimization**
   - Only collect necessary information
   - Don't store data longer than needed
   - Encrypt sensitive data at rest

3. **User Rights**
   - Right to access their data
   - Right to correct their data
   - Right to delete their data

### Accessibility

- Ensure ARIA labels are present
- Support keyboard navigation
- Provide text alternatives for images
- Maintain sufficient color contrast

## Incident Response Plan

### Steps to Take if Compromised

1. **Immediate Actions**
   - Disable affected services
   - Rotate all credentials
   - Revoke API tokens
   - Notify affected users

2. **Investigation**
   - Review logs for breach extent
   - Identify vulnerability
   - Document incident timeline

3. **Remediation**
   - Fix security vulnerability
   - Update security policies
   - Implement additional safeguards
   - Deploy patches

4. **Post-Incident**
   - Conduct security audit
   - Update security documentation
   - Train team on lessons learned
   - Consider third-party security review

## Security Checklist

### Pre-Deployment

- [ ] All secrets stored in environment variables
- [ ] No sensitive data in code or comments
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Input validation implemented
- [ ] XSS protection in place
- [ ] CSRF tokens implemented (if applicable)
- [ ] Rate limiting configured
- [ ] Dependencies updated and audited
- [ ] Error messages don't leak sensitive info

### Post-Deployment

- [ ] Verify HTTPS is working
- [ ] Test security headers with [SecurityHeaders.com](https://securityheaders.com/)
- [ ] Run security scan with [Mozilla Observatory](https://observatory.mozilla.org/)
- [ ] Verify no secrets in public repository
- [ ] Monitor logs for suspicious activity
- [ ] Set up alerts for security events
- [ ] Document incident response plan
- [ ] Regular security reviews scheduled

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security Documentation](https://vercel.com/docs/security)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Twilio Security Best Practices](https://www.twilio.com/docs/usage/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## Contact

For security concerns or to report vulnerabilities, please contact the repository maintainer.

**Remember: Security is an ongoing process, not a one-time setup. Regularly review and update security practices.**
