# Security Best Practices Guide

This guide outlines security measures implemented in the DMKyGab Property Management Portal and best practices for secure deployment and usage.

## Implemented Security Features

### 1. HTTP Security Headers

The following security headers are configured in `vercel.json`:

```json
{
  "X-Content-Type-Options": "nosniff",        // Prevents MIME-sniffing
  "X-Frame-Options": "DENY",                   // Prevents clickjacking
  "X-XSS-Protection": "1; mode=block",        // XSS protection
  "Referrer-Policy": "strict-origin-when-cross-origin"  // Referrer control
}
```

**What this protects against:**
- ✅ MIME-type confusion attacks
- ✅ Clickjacking via iframes
- ✅ Cross-Site Scripting (XSS) attacks
- ✅ Information leakage via referrer

### 2. Password Security

Implemented in `assets/js/app.js`:

```javascript
// Password requirements enforced
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/;

// Requirements:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
```

**Best practices implemented:**
- ✅ Strong password requirements
- ✅ Password confirmation on registration
- ✅ Client-side validation (server-side needed for production)

### 3. Input Validation

All form inputs are validated:

```javascript
// Email validation
<input type="email" required>

// Phone number validation  
<input type="tel" required>

// Required field validation
All critical fields marked as required
```

### 4. HTTPS Enforcement

- ✅ Automatic HTTPS on Vercel deployment
- ✅ HTTP redirects to HTTPS
- ✅ Secure cookie flags (when backend implemented)

### 5. Environment Variable Protection

```bash
# .env file excluded from git
.gitignore includes:
- .env
- .env.*

# Only .env.example is committed
Contains placeholders, not actual secrets
```

## Additional Security Recommendations

### For Production Deployment

#### 1. Content Security Policy (CSP)

Add to `vercel.json`:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; font-src 'self' https://cdnjs.cloudflare.com data:; img-src 'self' data: https:; connect-src 'self'"
}
```

**Note:** `'unsafe-inline'` is currently needed for inline styles/scripts. For maximum security, refactor to external files.

#### 2. Subresource Integrity (SRI)

For external resources, add integrity checks:

```html
<!-- Current -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Recommended -->
<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      integrity="sha512-HASH_HERE"
      crossorigin="anonymous">
```

#### 3. Rate Limiting

Implement server-side rate limiting for:
- Login attempts (max 5 per 15 minutes)
- Registration attempts (max 3 per hour)
- API calls (if backend implemented)

Example with Express.js:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/login', loginLimiter, loginHandler);
```

### For User Authentication

#### 1. Session Management

When implementing backend authentication:

```javascript
// Use secure session settings
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,        // HTTPS only
    httpOnly: true,      // No JavaScript access
    maxAge: 3600000,     // 1 hour
    sameSite: 'strict'   // CSRF protection
  }
}));
```

#### 2. Two-Factor Authentication (2FA)

Recommended implementation using Twilio or similar:

```javascript
// SMS-based 2FA flow
1. User enters credentials
2. Generate 6-digit code
3. Send via Twilio SMS
4. User enters code
5. Validate and grant access
```

#### 3. Account Lockout

Implement account lockout after failed attempts:

```javascript
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Track failed attempts
if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
  lockAccount(userId, LOCKOUT_DURATION);
}
```

### For Data Protection

#### 1. Secure Data Storage

**Local Storage Considerations:**

```javascript
// Current implementation stores user data
localStorage.setItem('dmkygab_user', JSON.stringify(currentUser));

// For production:
- Don't store sensitive data in localStorage
- Use secure, httpOnly cookies instead
- Implement token-based authentication (JWT)
- Store tokens server-side with short expiration
```

#### 2. Data Encryption

For sensitive data:

```javascript
// Use encryption for stored data
const CryptoJS = require('crypto-js');

// Encrypt before storage
const encrypted = CryptoJS.AES.encrypt(
  JSON.stringify(data), 
  process.env.ENCRYPTION_KEY
).toString();

// Decrypt when needed
const decrypted = CryptoJS.AES.decrypt(
  encrypted, 
  process.env.ENCRYPTION_KEY
).toString(CryptoJS.enc.Utf8);
```

#### 3. Sensitive Information Masking

For phone numbers, emails, etc.:

```javascript
function maskPhone(phone) {
  return phone.replace(/(\d{3})\d{3}(\d{4})/, '$1-***-$2');
}

function maskEmail(email) {
  const [name, domain] = email.split('@');
  return `${name.substring(0, 2)}***@${domain}`;
}
```

### For API Security (If Backend Implemented)

#### 1. API Key Management

```javascript
// Use environment variables
const API_KEY = process.env.API_KEY;

// Rotate keys regularly
// Use different keys for dev/staging/prod
// Never commit keys to git
```

#### 2. API Request Validation

```javascript
// Validate all API requests
const { body, validationResult } = require('express-validator');

app.post('/api/tenant', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail(),
  body('phone').isMobilePhone()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process request
});
```

#### 3. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-domain.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## Security Checklist

### Pre-Deployment
- [ ] All secrets in environment variables
- [ ] .env excluded from git
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Input validation on all forms
- [ ] Password requirements enforced
- [ ] No console.log with sensitive data
- [ ] External dependencies audited

### Post-Deployment
- [ ] SSL certificate valid
- [ ] Security headers present (check with securityheaders.com)
- [ ] No mixed content warnings
- [ ] HTTPS redirects working
- [ ] Environment variables set correctly
- [ ] Login/registration working
- [ ] Password validation working
- [ ] No sensitive data in browser storage

### Ongoing
- [ ] Regular dependency updates
- [ ] Security audit quarterly
- [ ] Password rotation policy
- [ ] Access log review
- [ ] Incident response plan
- [ ] Backup and recovery tested

## Common Vulnerabilities to Avoid

### 1. Cross-Site Scripting (XSS)

**Bad:**
```javascript
element.innerHTML = userInput;  // Dangerous!
```

**Good:**
```javascript
element.textContent = userInput;  // Safe
// Or sanitize with DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);
```

### 2. SQL Injection

**Bad:**
```javascript
const query = `SELECT * FROM users WHERE email = '${email}'`;  // Dangerous!
```

**Good:**
```javascript
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [email]);  // Safe with parameterized queries
```

### 3. CSRF (Cross-Site Request Forgery)

**Protection:**
```javascript
// Use CSRF tokens
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// Include token in forms
<input type="hidden" name="_csrf" value="{{ csrfToken }}">
```

### 4. Insecure Direct Object References

**Bad:**
```javascript
// Anyone can access any tenant by changing ID
GET /api/tenant/123
```

**Good:**
```javascript
// Verify user owns or has access to tenant
if (user.tenants.includes(tenantId)) {
  // Allow access
}
```

## Security Monitoring

### Tools to Use

1. **Security Headers Check**
   - https://securityheaders.com
   - Verifies HTTP security headers

2. **SSL Test**
   - https://www.ssllabs.com/ssltest/
   - Tests SSL/TLS configuration

3. **Vulnerability Scanning**
   - Snyk (for dependencies)
   - npm audit (for Node.js projects)
   - OWASP ZAP (penetration testing)

4. **Monitoring Services**
   - Sentry (error tracking)
   - LogRocket (user session replay)
   - Google Security Scanner

### Logging and Alerts

```javascript
// Log security events
function logSecurityEvent(event, details) {
  console.log({
    timestamp: new Date().toISOString(),
    event: event,
    details: details,
    ip: request.ip,
    userAgent: request.headers['user-agent']
  });
}

// Examples of events to log
- Failed login attempts
- Password changes
- Account lockouts
- Suspicious API calls
- Data access patterns
```

## Incident Response Plan

### If Security Breach Detected

1. **Immediate Actions**
   - Disable affected accounts
   - Change all passwords and API keys
   - Review access logs
   - Notify affected users

2. **Investigation**
   - Determine breach scope
   - Identify vulnerability
   - Document timeline
   - Preserve evidence

3. **Remediation**
   - Fix vulnerability
   - Deploy security patch
   - Monitor for further activity
   - Update security measures

4. **Post-Incident**
   - Conduct security review
   - Update policies
   - Train team
   - Improve monitoring

## Resources

### Security Guidelines
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Vercel Security: https://vercel.com/docs/security
- MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security

### Security Tools
- npm audit: Check for vulnerable dependencies
- Snyk: Continuous security monitoring
- Lighthouse: Security audit in Chrome DevTools

### Compliance
- GDPR: For EU users data protection
- CCPA: For California users privacy
- SOC 2: For enterprise customers

---

**Document Version**: 1.0  
**Last Updated**: 2024-11-30  
**Next Security Audit**: 2025-02-28
