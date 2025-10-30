// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

// API Helper Functions
const api = {
    // Helper to get auth token
    getToken() {
        const user = localStorage.getItem('dmkygab_user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.token;
        }
        return null;
    },

    // Helper to make authenticated requests
    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Authentication
    auth: {
        async login(email, password) {
            return await api.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
        },

        async register(userData) {
            return await api.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },

        async getMe() {
            return await api.request('/auth/me');
        }
    },

    // Tenants
    tenants: {
        async getAll() {
            return await api.request('/tenants');
        },

        async getById(id) {
            return await api.request(`/tenants/${id}`);
        },

        async create(tenantData) {
            return await api.request('/tenants', {
                method: 'POST',
                body: JSON.stringify(tenantData)
            });
        },

        async update(id, tenantData) {
            return await api.request(`/tenants/${id}`, {
                method: 'PUT',
                body: JSON.stringify(tenantData)
            });
        },

        async delete(id) {
            return await api.request(`/tenants/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Maintenance Requests
    maintenance: {
        async getAll(filters = {}) {
            const queryString = new URLSearchParams(filters).toString();
            return await api.request(`/maintenance${queryString ? '?' + queryString : ''}`);
        },

        async getById(id) {
            return await api.request(`/maintenance/${id}`);
        },

        async create(requestData) {
            return await api.request('/maintenance', {
                method: 'POST',
                body: JSON.stringify(requestData)
            });
        },

        async update(id, requestData) {
            return await api.request(`/maintenance/${id}`, {
                method: 'PUT',
                body: JSON.stringify(requestData)
            });
        },

        async delete(id) {
            return await api.request(`/maintenance/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Leases
    leases: {
        async getAll(filters = {}) {
            const queryString = new URLSearchParams(filters).toString();
            return await api.request(`/leases${queryString ? '?' + queryString : ''}`);
        },

        async getById(id) {
            return await api.request(`/leases/${id}`);
        },

        async create(leaseData) {
            return await api.request('/leases', {
                method: 'POST',
                body: JSON.stringify(leaseData)
            });
        },

        async update(id, leaseData) {
            return await api.request(`/leases/${id}`, {
                method: 'PUT',
                body: JSON.stringify(leaseData)
            });
        },

        async delete(id) {
            return await api.request(`/leases/${id}`, {
                method: 'DELETE'
            });
        }
    },

    // Payments
    payments: {
        async getAll(filters = {}) {
            const queryString = new URLSearchParams(filters).toString();
            return await api.request(`/payments${queryString ? '?' + queryString : ''}`);
        },

        async getById(id) {
            return await api.request(`/payments/${id}`);
        },

        async create(paymentData) {
            return await api.request('/payments', {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
        },

        async update(id, paymentData) {
            return await api.request(`/payments/${id}`, {
                method: 'PUT',
                body: JSON.stringify(paymentData)
            });
        },

        async delete(id) {
            return await api.request(`/payments/${id}`, {
                method: 'DELETE'
            });
        },

        async getStats() {
            return await api.request('/payments/stats');
        }
    }
};

// Export for use in other files
window.api = api;
