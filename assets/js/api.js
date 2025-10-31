// DMKyGab Property Management Portal - API Integration

const API_BASE_URL = window.location.origin + '/api';

// API helper functions
const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('dmkygab_token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  async sendVerificationCode(email, type = 'registration') {
    return this.request('/auth/send-verification-code', {
      method: 'POST',
      body: JSON.stringify({ email, type })
    });
  },

  async verifyCode(email, code) {
    return this.request('/auth/verify-code', {
      method: 'POST',
      body: JSON.stringify({ email, code })
    });
  },

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async login(email, password, verificationCode = null) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, verificationCode })
    });
  },

  async getCurrentUser() {
    return this.request('/auth/me');
  },

  async getPendingUsers() {
    return this.request('/admin/pending-users');
  },

  async approveUser(userId) {
    return this.request(`/admin/approve-user/${userId}`, {
      method: 'POST'
    });
  },

  async rejectUser(userId) {
    return this.request(`/admin/reject-user/${userId}`, {
      method: 'POST'
    });
  }
};

// Helper function to show messages
function showMessage(message, type = 'info') {
  // Create message element if it doesn't exist
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
      animation: slideIn 0.3s ease-out;
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

// Helper to show loading spinner
function showLoading(show = true) {
  let spinner = document.getElementById('loadingSpinner');
  if (!spinner) {
    spinner = document.createElement('div');
    spinner.id = 'loadingSpinner';
    spinner.innerHTML = '<div class="spinner"></div>';
    spinner.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    document.body.appendChild(spinner);
  }
  spinner.style.display = show ? 'flex' : 'none';
}

module.exports = { api, showMessage, showLoading };
