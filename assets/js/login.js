// Login and Registration with Email Verification

// State management for verification
let verificationState = {
  email: null,
  codeVerified: false,
  verificationCode: null,
  type: null
};

// Initialize authentication handlers
function initAuthHandlers() {
  // This function is called from app.js
  // Additional handlers for email verification
  const regEmailInput = document.getElementById('regEmail');
  if (regEmailInput) {
    // Add verification button after email field
    const verifyBtn = document.createElement('button');
    verifyBtn.type = 'button';
    verifyBtn.className = 'btn btn-secondary';
    verifyBtn.id = 'sendVerificationBtn';
    verifyBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Verification Code';
    verifyBtn.style.marginTop = '10px';
    
    const verifyContainer = document.createElement('div');
    verifyContainer.id = 'verificationContainer';
    verifyContainer.style.marginTop = '10px';
    
    regEmailInput.parentElement.appendChild(verifyBtn);
    regEmailInput.parentElement.appendChild(verifyContainer);
    
    verifyBtn.addEventListener('click', handleSendVerificationCode);
  }
}

async function handleSendVerificationCode() {
  const email = document.getElementById('regEmail').value;
  
  if (!email || !isValidEmail(email)) {
    showMessage('Please enter a valid email address', 'error');
    return;
  }

  const btn = document.getElementById('sendVerificationBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, type: 'registration' })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send code');
    }

    verificationState.email = email;
    verificationState.type = 'registration';
    
    showMessage('Verification code sent! Check your email.', 'success');
    showVerificationInput();

    // Start countdown timer
    startCountdown(btn, data.expiresIn * 60);
  } catch (error) {
    showMessage(error.message, 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-envelope"></i> Send Verification Code';
  }
}

function showVerificationInput() {
  const container = document.getElementById('verificationContainer');
  container.innerHTML = `
    <div class="form-group">
      <label for="verificationCodeInput">
        <i class="fas fa-key"></i> Verification Code
      </label>
      <input type="text" id="verificationCodeInput" placeholder="Enter 6-digit code" maxlength="6" pattern="[0-9]{6}">
      <button type="button" class="btn btn-primary" id="verifyCodeBtn" style="margin-top: 10px;">
        <i class="fas fa-check"></i> Verify Code
      </button>
      <div id="verificationStatus" style="margin-top: 10px;"></div>
    </div>
  `;

  document.getElementById('verifyCodeBtn').addEventListener('click', handleVerifyCode);
}

async function handleVerifyCode() {
  const code = document.getElementById('verificationCodeInput').value;
  
  if (!code || code.length !== 6) {
    showMessage('Please enter the 6-digit code', 'error');
    return;
  }

  const btn = document.getElementById('verifyCodeBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

  try {
    const response = await fetch('/api/auth/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: verificationState.email, 
        code 
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Verification failed');
    }

    verificationState.codeVerified = true;
    verificationState.verificationCode = code;
    
    const statusDiv = document.getElementById('verificationStatus');
    statusDiv.innerHTML = '<span style="color: #28a745;"><i class="fas fa-check-circle"></i> Email verified!</span>';
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-check"></i> Verified';
    
    showMessage('Email verified successfully!', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check"></i> Verify Code';
  }
}

function startCountdown(button, seconds) {
  let remaining = seconds;
  
  const interval = setInterval(() => {
    remaining--;
    const minutes = Math.floor(remaining / 60);
    const secs = remaining % 60;
    
    button.innerHTML = `<i class="fas fa-clock"></i> Resend in ${minutes}:${secs.toString().padStart(2, '0')}`;
    
    if (remaining <= 0) {
      clearInterval(interval);
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-envelope"></i> Resend Code';
    }
  }, 1000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message, type) {
  let messageDiv = document.getElementById('messageBox');
  if (!messageDiv) {
    messageDiv = document.createElement('div');
    messageDiv.id = 'messageBox';
    messageDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      max-width: 400px;
      z-index: 10000;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `;
    document.body.appendChild(messageDiv);
  }

  const colors = {
    success: '#d4edda',
    error: '#f8d7da',
    info: '#d1ecf1',
    warning: '#fff3cd'
  };

  const textColors = {
    success: '#155724',
    error: '#721c24',
    info: '#0c5460',
    warning: '#856404'
  };

  messageDiv.style.backgroundColor = colors[type] || colors.info;
  messageDiv.style.color = textColors[type] || textColors.info;
  messageDiv.style.border = `1px solid ${textColors[type] || textColors.info}`;
  messageDiv.textContent = message;
  messageDiv.style.display = 'block';

  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Export functions for use in app.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initAuthHandlers, verificationState };
}