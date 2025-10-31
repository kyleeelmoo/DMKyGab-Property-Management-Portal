// DMKyGab Property Management Portal - Main Application JavaScript

// API Configuration
const API_BASE_URL = window.location.origin + '/api';

// Authentication State
let currentUser = null;
let isAuthenticated = false;
let verificationState = {
  email: null,
  codeVerified: false,
  verificationCode: null,
  type: null
};

// Sample Data
const sampleTenants = [
    { id: 1, name: 'John Smith', unit: '302', email: 'john@example.com', phone: '555-0101', rent: 1500, status: 'active', leaseEnd: '2025-06-30' },
    { id: 2, name: 'Sarah Johnson', unit: '105', email: 'sarah@example.com', phone: '555-0102', rent: 1800, status: 'active', leaseEnd: '2025-08-15' },
    { id: 3, name: 'Mike Davis', unit: '201', email: 'mike@example.com', phone: '555-0103', rent: 1350, status: 'active', leaseEnd: '2025-12-01' },
    { id: 4, name: 'Jane Williams', unit: '205', email: 'jane@example.com', phone: '555-0104', rent: 1500, status: 'active', leaseEnd: '2025-03-20' },
    { id: 5, name: 'Robert Chen', unit: '308', email: 'robert@example.com', phone: '555-0105', rent: 1800, status: 'active', leaseEnd: '2025-07-10' }
];

const sampleMaintenanceRequests = [
    { id: 1, unit: '302', tenant: 'John Smith', issue: 'Water Leak', priority: 'urgent', status: 'open', date: '2024-11-28', assignedTo: 'Tom Wilson' },
    { id: 2, unit: '105', tenant: 'Sarah Johnson', issue: 'HVAC Repair', priority: 'high', status: 'in-progress', date: '2024-11-27', assignedTo: 'Tom Wilson' },
    { id: 3, unit: '201', tenant: 'Mike Davis', issue: 'Door Lock Replacement', priority: 'normal', status: 'open', date: '2024-11-27', assignedTo: null },
    { id: 4, unit: '405', tenant: 'Lisa Brown', issue: 'Appliance Repair', priority: 'normal', status: 'completed', date: '2024-11-25', assignedTo: 'Sarah Lee' }
];

const sampleLeases = [
    { id: 1, unit: '302', tenant: 'John Smith', startDate: '2024-07-01', endDate: '2025-06-30', rent: 1500, deposit: 1500, status: 'active' },
    { id: 2, unit: '105', tenant: 'Sarah Johnson', startDate: '2024-08-15', endDate: '2025-08-15', rent: 1800, deposit: 1800, status: 'active' },
    { id: 3, unit: '201', tenant: 'Mike Davis', startDate: '2024-12-01', endDate: '2025-12-01', rent: 1350, deposit: 1350, status: 'active' }
];

const samplePayments = [
    { id: 1, unit: '302', tenant: 'John Smith', amount: 1500, date: '2024-11-01', status: 'paid', method: 'bank transfer' },
    { id: 2, unit: '105', tenant: 'Sarah Johnson', amount: 1800, date: '2024-11-01', status: 'paid', method: 'check' },
    { id: 3, unit: '410', tenant: 'Lisa Anderson', amount: 1350, date: '2024-11-25', status: 'overdue', method: 'pending' }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    initializeNavigation();
    initializeNotifications();
});

// Authentication Functions
function initializeAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        
        // Add email verification button to registration form
        const regEmail = document.getElementById('regEmail');
        if (regEmail && !document.getElementById('sendVerificationBtn')) {
            const verifyBtn = document.createElement('button');
            verifyBtn.type = 'button';
            verifyBtn.className = 'btn btn-secondary';
            verifyBtn.id = 'sendVerificationBtn';
            verifyBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Verification Code';
            verifyBtn.style.marginTop = '10px';
            verifyBtn.style.width = '100%';
            
            const verifyContainer = document.createElement('div');
            verifyContainer.id = 'verificationContainer';
            verifyContainer.style.marginTop = '10px';
            
            regEmail.parentElement.appendChild(verifyBtn);
            regEmail.parentElement.appendChild(verifyContainer);
            
            verifyBtn.addEventListener('click', handleSendVerificationCode);
        }
    }

    if (showRegisterLink) {
        showRegisterLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('registerScreen').style.display = 'flex';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('registerScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
        });
    }

    // Check for saved session
    checkAuthStatus();
}

async function checkAuthStatus() {
    const token = localStorage.getItem('dmkygab_token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                isAuthenticated = true;
                showMainApp();
            } else {
                localStorage.removeItem('dmkygab_token');
                localStorage.removeItem('dmkygab_user');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('dmkygab_token');
            localStorage.removeItem('dmkygab_user');
        }
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    if (!email || !password) {
        showMessage('Please enter email and password', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            if (data.status === 'pending') {
                showMessage('Your account is pending admin approval. You will be notified when approved.', 'warning');
            } else if (data.status === 'rejected') {
                showMessage('Your account registration was not approved. Please contact support.', 'error');
            } else {
                throw new Error(data.error || 'Login failed');
            }
            return;
        }

        // Save token and user data
        localStorage.setItem('dmkygab_token', data.token);
        localStorage.setItem('dmkygab_user', JSON.stringify(data.user));
        
        currentUser = data.user;
        isAuthenticated = true;

        showMessage('Login successful!', 'success');
        setTimeout(() => showMainApp(), 1000);
    } catch (error) {
        showMessage(error.message || 'Login failed', 'error');
    } finally {
        showLoading(false);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validate email verification
    if (!verificationState.codeVerified || verificationState.email !== email) {
        showMessage('Please verify your email address first', 'error');
        return;
    }

    // Validate password
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters long', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
        showMessage('Password must include uppercase, lowercase, number, and special character', 'error');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                role,
                password,
                verificationCode: verificationState.verificationCode
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Registration failed');
        }

        showMessage('Registration successful! Your account is pending admin approval. You will be notified by email.', 'success');
        
        // Reset form and switch to login
        document.getElementById('registerForm').reset();
        verificationState = {
            email: null,
            codeVerified: false,
            verificationCode: null,
            type: null
        };
        
        setTimeout(() => {
            document.getElementById('registerScreen').style.display = 'none';
            document.getElementById('loginScreen').style.display = 'flex';
        }, 2000);
    } catch (error) {
        showMessage(error.message || 'Registration failed', 'error');
    } finally {
        showLoading(false);
    }
}

function showMainApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    if (currentUser) {
        document.getElementById('userNameDisplay').textContent = currentUser.name;
        
        // Show admin menu item if user is admin
        if (currentUser.role === 'admin') {
            const adminMenuItem = document.getElementById('adminMenuItem');
            if (adminMenuItem) {
                adminMenuItem.style.display = 'block';
            }
        }
    }

    // Load initial page
    loadPage('dashboard');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        isAuthenticated = false;
        localStorage.removeItem('dmkygab_user');
        localStorage.removeItem('dmkygab_token');
        
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginForm').reset();
        
        // Hide admin menu item
        const adminMenuItem = document.getElementById('adminMenuItem');
        if (adminMenuItem) {
            adminMenuItem.style.display = 'none';
        }
    }
}

// Navigation Functions
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const logoutBtn = document.getElementById('logoutBtn');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            document.querySelectorAll('.sidebar-menu li').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
            
            // Load the corresponding page
            const page = this.getAttribute('data-page');
            loadPage(page);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

// Page Loading Functions
function loadPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show the requested page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.classList.add('active');

        // Load page content
        switch(pageName) {
            case 'dashboard':
                // Dashboard is already loaded in HTML
                break;
            case 'tenants':
                loadTenantsPage();
                break;
            case 'maintenance':
                loadMaintenancePage();
                break;
            case 'leases':
                loadLeasesPage();
                break;
            case 'financials':
                loadFinancialsPage();
                break;
            case 'analytics':
                loadAnalyticsPage();
                break;
            case 'admin':
                loadAdminPage();
                break;
        }
    }
}

function loadTenantsPage() {
    const content = `
        <div class="page-header">
            <h1>Tenant Management</h1>
            <p>Manage all your tenants and their information</p>
        </div>

        <div class="search-filter-bar">
            <div class="search-box">
                <input type="text" id="tenantSearch" placeholder="Search tenants by name, unit, or email...">
                <i class="fas fa-search"></i>
            </div>
            <select id="tenantStatusFilter">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
            </select>
            <button class="btn btn-primary" onclick="openAddTenantModal()">
                <i class="fas fa-plus"></i> Add Tenant
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Unit</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Rent</th>
                        <th>Lease End</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="tenantsTableBody">
                    ${renderTenantsTable()}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('tenantsPage').innerHTML = content;
}

function renderTenantsTable() {
    return sampleTenants.map(tenant => `
        <tr>
            <td><strong>${tenant.name}</strong></td>
            <td>Unit ${tenant.unit}</td>
            <td>${tenant.email}</td>
            <td>${tenant.phone}</td>
            <td>$${tenant.rent.toLocaleString()}</td>
            <td>${tenant.leaseEnd}</td>
            <td><span class="status-badge normal">${tenant.status}</span></td>
            <td>
                <button class="btn btn-secondary" onclick="viewTenant(${tenant.id})" style="padding: 5px 10px; font-size: 12px;">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function loadMaintenancePage() {
    const content = `
        <div class="page-header">
            <h1>Maintenance Requests</h1>
            <p>Track and manage all maintenance requests</p>
        </div>

        <div class="search-filter-bar">
            <div class="search-box">
                <input type="text" placeholder="Search maintenance requests...">
                <i class="fas fa-search"></i>
            </div>
            <select>
                <option value="">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
            </select>
            <select>
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>
            <button class="btn btn-primary" onclick="openAddMaintenanceModal()">
                <i class="fas fa-plus"></i> New Request
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Unit</th>
                        <th>Tenant</th>
                        <th>Issue</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Assigned To</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderMaintenanceTable()}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('maintenancePage').innerHTML = content;
}

function renderMaintenanceTable() {
    return sampleMaintenanceRequests.map(req => `
        <tr>
            <td>#${req.id}</td>
            <td>Unit ${req.unit}</td>
            <td>${req.tenant}</td>
            <td><strong>${req.issue}</strong></td>
            <td><span class="status-badge ${req.priority}">${req.priority}</span></td>
            <td><span class="status-badge normal">${req.status}</span></td>
            <td>${req.date}</td>
            <td>${req.assignedTo || 'Unassigned'}</td>
            <td>
                <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                    <i class="fas fa-edit"></i> Edit
                </button>
            </td>
        </tr>
    `).join('');
}

function loadLeasesPage() {
    const content = `
        <div class="page-header">
            <h1>Lease Management</h1>
            <p>Manage all property leases and agreements</p>
        </div>

        <div class="search-filter-bar">
            <div class="search-box">
                <input type="text" placeholder="Search leases...">
                <i class="fas fa-search"></i>
            </div>
            <select>
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
            </select>
            <button class="btn btn-primary" onclick="openAddLeaseModal()">
                <i class="fas fa-plus"></i> New Lease
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Lease ID</th>
                        <th>Unit</th>
                        <th>Tenant</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Monthly Rent</th>
                        <th>Deposit</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderLeasesTable()}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('leasesPage').innerHTML = content;
}

function renderLeasesTable() {
    return sampleLeases.map(lease => `
        <tr>
            <td>#${lease.id}</td>
            <td>Unit ${lease.unit}</td>
            <td>${lease.tenant}</td>
            <td>${lease.startDate}</td>
            <td>${lease.endDate}</td>
            <td>$${lease.rent.toLocaleString()}</td>
            <td>$${lease.deposit.toLocaleString()}</td>
            <td><span class="status-badge normal">${lease.status}</span></td>
            <td>
                <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function loadFinancialsPage() {
    const content = `
        <div class="page-header">
            <h1>Financial Management</h1>
            <p>Track rent payments, invoices, and financial analytics</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-dollar-sign"></i>
                </div>
                <div class="stat-info">
                    <h3>Total Collected (This Month)</h3>
                    <p class="stat-number">$85,400</p>
                    <small class="stat-change positive">+12% from last month</small>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-info">
                    <h3>Pending Payments</h3>
                    <p class="stat-number">$12,650</p>
                    <small class="stat-change">5 tenants</small>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-file-invoice-dollar"></i>
                </div>
                <div class="stat-info">
                    <h3>Invoices Sent</h3>
                    <p class="stat-number">42</p>
                    <small class="stat-change">This month</small>
                </div>
            </div>
        </div>

        <div class="search-filter-bar">
            <div class="search-box">
                <input type="text" placeholder="Search payments...">
                <i class="fas fa-search"></i>
            </div>
            <select>
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
            </select>
            <button class="btn btn-primary">
                <i class="fas fa-file-invoice"></i> Generate Invoice
            </button>
        </div>

        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Payment ID</th>
                        <th>Unit</th>
                        <th>Tenant</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${renderPaymentsTable()}
                </tbody>
            </table>
        </div>
    `;
    document.getElementById('financialsPage').innerHTML = content;
}

function renderPaymentsTable() {
    return samplePayments.map(payment => `
        <tr class="${payment.status === 'overdue' ? 'overdue' : ''}">
            <td>#${payment.id}</td>
            <td>Unit ${payment.unit}</td>
            <td>${payment.tenant}</td>
            <td>$${payment.amount.toLocaleString()}</td>
            <td>${payment.date}</td>
            <td>${payment.method}</td>
            <td><span class="status-badge ${payment.status === 'paid' ? 'normal' : payment.status === 'overdue' ? 'urgent' : 'high'}">${payment.status}</span></td>
            <td>
                <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        </tr>
    `).join('');
}

function loadAnalyticsPage() {
    const content = `
        <div class="page-header">
            <h1>Analytics & Statistics</h1>
            <p>View detailed analytics and performance metrics</p>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon blue">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="stat-info">
                    <h3>Occupancy Rate</h3>
                    <p class="stat-number">92%</p>
                    <small class="stat-change positive">+3% from last quarter</small>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon green">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <div class="stat-info">
                    <h3>Revenue (YTD)</h3>
                    <p class="stat-number">$924,800</p>
                    <small class="stat-change positive">+18% from last year</small>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon orange">
                    <i class="fas fa-tools"></i>
                </div>
                <div class="stat-info">
                    <h3>Avg. Maintenance Time</h3>
                    <p class="stat-number">2.5 days</p>
                    <small class="stat-change positive">-0.5 days improvement</small>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon purple">
                    <i class="fas fa-star"></i>
                </div>
                <div class="stat-info">
                    <h3>Tenant Satisfaction</h3>
                    <p class="stat-number">4.5/5</p>
                    <small class="stat-change positive">+0.3 from last survey</small>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h2>Monthly Revenue Trend</h2>
                <div style="padding: 20px; text-align: center; color: var(--text-light);">
                    <i class="fas fa-chart-area" style="font-size: 48px; margin: 20px;"></i>
                    <p>Revenue chart visualization would be displayed here</p>
                    <p style="font-size: 12px;">Integration with Chart.js or similar library recommended</p>
                </div>
            </div>

            <div class="dashboard-card">
                <h2>Maintenance Request Distribution</h2>
                <div style="padding: 20px; text-align: center; color: var(--text-light);">
                    <i class="fas fa-chart-pie" style="font-size: 48px; margin: 20px;"></i>
                    <p>Pie chart visualization would be displayed here</p>
                    <p style="font-size: 12px;">Showing distribution by priority and status</p>
                </div>
            </div>
        </div>
    `;
    document.getElementById('analyticsPage').innerHTML = content;
}

// Admin Page
async function loadAdminPage() {
    if (!currentUser || currentUser.role !== 'admin') {
        showMessage('Access denied. Admin privileges required.', 'error');
        loadPage('dashboard');
        return;
    }

    showLoading(true);

    try {
        const token = localStorage.getItem('dmkygab_token');
        const response = await fetch(`${API_BASE_URL}/admin/pending-users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load pending users');
        }

        const content = `
            <div class="page-header">
                <h1>User Approval Management</h1>
                <p>Review and approve user registration requests</p>
            </div>

            <div class="stats-grid" style="margin-bottom: 30px;">
                <div class="stat-card">
                    <div class="stat-icon orange">
                        <i class="fas fa-user-clock"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Pending Approvals</h3>
                        <p class="stat-number">${data.users.length}</p>
                        <small>Awaiting review</small>
                    </div>
                </div>
            </div>

            ${data.users.length === 0 ? `
                <div style="text-align: center; padding: 50px; background: #f9f9f9; border-radius: 10px;">
                    <i class="fas fa-check-circle" style="font-size: 64px; color: #28a745; margin-bottom: 20px;"></i>
                    <h2>All Caught Up!</h2>
                    <p style="color: #666;">No pending user approvals at the moment.</p>
                </div>
            ` : `
                <div class="data-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Registration Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${data.users.map(user => `
                                <tr id="user-row-${user.id}">
                                    <td><strong>${user.name}</strong></td>
                                    <td>${user.email}</td>
                                    <td>${user.phone || 'N/A'}</td>
                                    <td><span class="status-badge normal">${user.role}</span></td>
                                    <td>${new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button class="btn btn-primary" onclick="approveUser(${user.id})" style="padding: 5px 10px; font-size: 12px; margin-right: 5px;">
                                            <i class="fas fa-check"></i> Approve
                                        </button>
                                        <button class="btn btn-secondary" onclick="rejectUser(${user.id})" style="padding: 5px 10px; font-size: 12px; background: #dc3545;">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        `;

        document.getElementById('adminPage').innerHTML = content;
    } catch (error) {
        showMessage(error.message || 'Failed to load pending users', 'error');
        document.getElementById('adminPage').innerHTML = `
            <div class="page-header">
                <h1>User Approval Management</h1>
                <p>Error loading pending users</p>
            </div>
            <div style="text-align: center; padding: 50px;">
                <p style="color: #dc3545;">${error.message}</p>
            </div>
        `;
    } finally {
        showLoading(false);
    }
}

async function approveUser(userId) {
    if (!confirm('Are you sure you want to approve this user?')) {
        return;
    }

    showLoading(true);

    try {
        const token = localStorage.getItem('dmkygab_token');
        const response = await fetch(`${API_BASE_URL}/admin/approve-user/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to approve user');
        }

        showMessage('User approved successfully!', 'success');
        
        // Remove the row from the table
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
            row.remove();
        }

        // Reload the page to update stats
        setTimeout(() => loadAdminPage(), 1000);
    } catch (error) {
        showMessage(error.message || 'Failed to approve user', 'error');
    } finally {
        showLoading(false);
    }
}

async function rejectUser(userId) {
    if (!confirm('Are you sure you want to reject this user? This action cannot be undone.')) {
        return;
    }

    showLoading(true);

    try {
        const token = localStorage.getItem('dmkygab_token');
        const response = await fetch(`${API_BASE_URL}/admin/reject-user/${userId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to reject user');
        }

        showMessage('User rejected successfully', 'info');
        
        // Remove the row from the table
        const row = document.getElementById(`user-row-${userId}`);
        if (row) {
            row.remove();
        }

        // Reload the page to update stats
        setTimeout(() => loadAdminPage(), 1000);
    } catch (error) {
        showMessage(error.message || 'Failed to reject user', 'error');
    } finally {
        showLoading(false);
    }
}

// Notification Functions
function initializeNotifications() {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationPanel = document.getElementById('notificationPanel');
    const closeNotifications = document.getElementById('closeNotifications');

    if (notificationIcon) {
        notificationIcon.addEventListener('click', function() {
            notificationPanel.classList.toggle('active');
        });
    }

    if (closeNotifications) {
        closeNotifications.addEventListener('click', function() {
            notificationPanel.classList.remove('active');
        });
    }
}

// Modal Functions (Placeholder implementations)
function openAddTenantModal() {
    alert('Add Tenant Modal - This would open a form to add a new tenant');
}

function openAddMaintenanceModal() {
    alert('Add Maintenance Request Modal - This would open a form to create a new maintenance request');
}

function openAddLeaseModal() {
    alert('Add Lease Modal - This would open a form to create a new lease');
}

function viewTenant(tenantId) {
    const tenant = sampleTenants.find(t => t.id === tenantId);
    if (tenant) {
        alert(`Tenant Details:\n\nName: ${tenant.name}\nUnit: ${tenant.unit}\nEmail: ${tenant.email}\nPhone: ${tenant.phone}\nRent: $${tenant.rent}\nLease End: ${tenant.leaseEnd}`);
    }
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Email verification helper functions
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
        const response = await fetch(`${API_BASE_URL}/auth/send-verification-code`, {
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
        <div class="form-group" style="margin-top: 10px;">
            <label for="verificationCodeInput">
                <i class="fas fa-key"></i> Verification Code
            </label>
            <input type="text" id="verificationCodeInput" placeholder="Enter 6-digit code" maxlength="6" pattern="[0-9]{6}" required>
            <button type="button" class="btn btn-primary" id="verifyCodeBtn" style="margin-top: 10px; width: 100%;">
                <i class="fas fa-check"></i> Verify Code
            </button>
            <div id="verificationStatus" style="margin-top: 10px; text-align: center;"></div>
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
        const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
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
        statusDiv.innerHTML = '<span style="color: #28a745; font-weight: bold;"><i class="fas fa-check-circle"></i> Email verified!</span>';
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> Verified';
        btn.style.backgroundColor = '#28a745';
        
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

// UI Helper functions
function showMessage(message, type = 'info') {
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

function showLoading(show = true) {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
                <div style="border: 5px solid #f3f3f3; border-top: 5px solid #667eea; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                <p style="margin: 0; color: #333;">Loading...</p>
            </div>
        `;
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
        
        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(spinner);
    }
    spinner.style.display = show ? 'flex' : 'none';
}

// Export functions for global access
window.loadPage = loadPage;
window.openAddTenantModal = openAddTenantModal;
window.openAddMaintenanceModal = openAddMaintenanceModal;
window.openAddLeaseModal = openAddLeaseModal;
window.viewTenant = viewTenant;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
