# DMKyGab-Property-Management-Portal

## Overview

DMKyGab-Property-Management-Portal is a modern, responsive portal for building and property management, featuring secure registration, SMS-based phone verification (via Twilio), and an interactive user interface. It empowers superintendents and property managers to efficiently track tasks, schedules, work orders, compliance, inspections, assets, and more.

## Features

- **Responsive Design:** Optimized for mobile, tablet, and desktop.
- **Animated, branded UI:** Stylish sidebar navigation and portal branding.
- **Secure Login & Registration:** User authentication with email and password.
- **SMS Verification:** Registration requires a code sent to the user's phone via Twilio.
- **Dashboard & Modules:** Manage work orders, preventive maintenance, assets, inspections, compliance, analytics, users, documents, and admin controls.
- **Backend-Ready:** Designed for easy integration with Flask, Node.js, or similar backend frameworks.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kyleeelmoo/DMKyGab-Property-Management-Portal.git
   cd DMKyGab-Property-Management-Portal
   ```

2. **Open the portal:**
   - For demo purposes, open `KyGabDM_Portal_LogoAnimated_Gradient.html` in your browser.

3. **Backend Integration (Recommended for SMS & user management):**
   - Set up a backend (Flask, Node.js, etc.) to handle registration, SMS code delivery, and authentication.
   - Integrate Twilio for SMS (see below).

## SMS Verification Setup (Twilio)

1. **Create a Twilio account:**  
   - Visit [Twilio](https://www.twilio.com/) and sign up.
   - Obtain your Account SID, Auth Token, and a Twilio Phone Number.

2. **Example Backend (Python/Flask):**
   ```python
   # app.py
   from flask import Flask, request, jsonify
   from twilio.rest import Client
   import random

   app = Flask(__name__)

   TWILIO_ACCOUNT_SID = 'your_account_sid'
   TWILIO_AUTH_TOKEN = 'your_auth_token'
   TWILIO_PHONE_NUMBER = 'your_twilio_phone_number'

   client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

   codes = {}

   @app.route('/send_code', methods=['POST'])
   def send_code():
       phone = request.json['phone']
       code = str(random.randint(100000, 999999))
       codes[phone] = code
       client.messages.create(
           body=f"Your verification code is {code}",
           from_=TWILIO_PHONE_NUMBER,
           to=phone
       )
       return jsonify({'success': True})

   @app.route('/verify_code', methods=['POST'])
   def verify_code():
       phone = request.json['phone']
       code = request.json['code']
       if codes.get(phone) == code:
           return jsonify({'verified': True})
       return jsonify({'verified': False})

   if __name__ == "__main__":
       app.run(debug=True)
   ```

3. **Frontend Integration:**
   - Update the JS in your portal HTML to POST phone numbers and codes to these endpoints.

## .gitignore

Add a `.gitignore` to keep secrets and unnecessary files out of version control, e.g.:
```
node_modules/
.env
__pycache__/
*.log
.DS_Store
```

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

Specify your license here (e.g., MIT, GPL).

## Contact

Maintainer: [kyleeelmoo](https://github.com/kyleeelmoo)
