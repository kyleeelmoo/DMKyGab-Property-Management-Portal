// API Configuration and Helper Functions
const API_BASE_URL = window.location.origin + '/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('dmkygab_token');
  return token;
};

// Set auth headers
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Show loading spinner
const showLoading = (message = 'Loading...') => {
  const existingSpinner = document.getElementById('loadingSpinner');
  if (existingSpinner) {
    existingSpinner.remove();
  }

  const spinner = document.createElement('div');
  spinner.id = 'loadingSpinner';
  spinner.className = 'loading-spinner';
  spinner.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(spinner);
};

// Hide loading spinner
const hideLoading = () => {
  const spinner = document.getElementById('loadingSpinner');
  if (spinner) {
    spinner.remove();
  }
};

// Show toast notification
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// API call wrapper
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getHeaders()
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
const authAPI = {
  async login(email, password) {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  async register(userData) {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async getMe() {
    return await apiCall('/auth/me');
  }
};

// Tenants API
const tenantsAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/tenants${queryString ? '?' + queryString : ''}`);
  },

  async getById(id) {
    return await apiCall(`/tenants/${id}`);
  },

  async create(tenantData) {
    return await apiCall('/tenants', {
      method: 'POST',
      body: JSON.stringify(tenantData)
    });
  },

  async update(id, tenantData) {
    return await apiCall(`/tenants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tenantData)
    });
  },

  async delete(id) {
    return await apiCall(`/tenants/${id}`, {
      method: 'DELETE'
    });
  }
};

// Maintenance API
const maintenanceAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/maintenance${queryString ? '?' + queryString : ''}`);
  },

  async getById(id) {
    return await apiCall(`/maintenance/${id}`);
  },

  async create(requestData) {
    return await apiCall('/maintenance', {
      method: 'POST',
      body: JSON.stringify(requestData)
    });
  },

  async update(id, requestData) {
    return await apiCall(`/maintenance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData)
    });
  },

  async delete(id) {
    return await apiCall(`/maintenance/${id}`, {
      method: 'DELETE'
    });
  }
};

// Leases API
const leasesAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/leases${queryString ? '?' + queryString : ''}`);
  },

  async getById(id) {
    return await apiCall(`/leases/${id}`);
  },

  async create(leaseData) {
    return await apiCall('/leases', {
      method: 'POST',
      body: JSON.stringify(leaseData)
    });
  },

  async update(id, leaseData) {
    return await apiCall(`/leases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(leaseData)
    });
  },

  async delete(id) {
    return await apiCall(`/leases/${id}`, {
      method: 'DELETE'
    });
  }
};

// Payments API
const paymentsAPI = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/payments${queryString ? '?' + queryString : ''}`);
  },

  async getById(id) {
    return await apiCall(`/payments/${id}`);
  },

  async create(paymentData) {
    return await apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  },

  async update(id, paymentData) {
    return await apiCall(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paymentData)
    });
  },

  async delete(id) {
    return await apiCall(`/payments/${id}`, {
      method: 'DELETE'
    });
  }
};

// Analytics API
const analyticsAPI = {
  async getDashboard() {
    return await apiCall('/analytics/dashboard');
  },

  async getRevenue(months = 6) {
    return await apiCall(`/analytics/revenue?months=${months}`);
  },

  async getMaintenance() {
    return await apiCall('/analytics/maintenance');
  },

  async getOccupancy() {
    return await apiCall('/analytics/occupancy');
  }
};
