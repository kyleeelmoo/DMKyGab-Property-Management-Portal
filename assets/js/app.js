// DMKyGab Property Management Portal - Main Application JavaScript

// Authentication State
let currentUser = null;
let isAuthenticated = false;

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
    const savedUser = localStorage.getItem('dmkygab_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isAuthenticated = true;
        showMainApp();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Show loading spinner
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        // Simple validation (in production, this would be server-side)
        if (email && password) {
            currentUser = {
                name: 'John Doe',
                email: email,
                role: 'admin'
            };
            isAuthenticated = true;

            if (rememberMe) {
                localStorage.setItem('dmkygab_user', JSON.stringify(currentUser));
            }

            hideLoading();
            showToast('Login successful! Welcome back.', 'success', 'Success');
            setTimeout(() => showMainApp(), 500);
        } else {
            hideLoading();
            showToast('Please enter valid credentials', 'error', 'Login Failed');
        }
    }, 1000);
}

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    // Validate password
    if (password.length < 8) {
        showToast('Password must be at least 8 characters long', 'error', 'Validation Error');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error', 'Validation Error');
        return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(password)) {
        showToast('Password must include uppercase, lowercase, number, and special character', 'error', 'Validation Error');
        return;
    }

    // Show loading spinner
    showLoading();
    
    // Simulate API call delay
    setTimeout(() => {
        // Create user account (in production, this would be server-side)
        currentUser = {
            name: name,
            email: email,
            phone: phone,
            role: role
        };
        isAuthenticated = true;

        localStorage.setItem('dmkygab_user', JSON.stringify(currentUser));
        
        hideLoading();
        showToast('Registration successful! Welcome to MorataKGab Portal.', 'success', 'Success');
        setTimeout(() => showMainApp(), 500);
    }, 1000);
}

function showMainApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('registerScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';

    if (currentUser) {
        document.getElementById('userNameDisplay').textContent = currentUser.name;
    }

    // Load initial page
    loadPage('dashboard');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        isAuthenticated = false;
        localStorage.removeItem('dmkygab_user');
        
        document.getElementById('mainApp').style.display = 'none';
        document.getElementById('loginScreen').style.display = 'flex';
        document.getElementById('loginForm').reset();
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

// Modal Functions
function openAddTenantModal() {
    openModal('addTenantModal');
}

function openAddMaintenanceModal() {
    openModal('addMaintenanceModal');
}

function submitAddTenant() {
    const name = document.getElementById('tenantName').value;
    const unit = document.getElementById('tenantUnit').value;
    const email = document.getElementById('tenantEmail').value;
    const phone = document.getElementById('tenantPhone').value;
    const rent = document.getElementById('tenantRent').value;
    const leaseEnd = document.getElementById('tenantLeaseEnd').value;

    if (!name || !unit || !email || !phone || !rent || !leaseEnd) {
        showToast('Please fill in all fields', 'error', 'Validation Error');
        return;
    }

    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Add to sample data
        const newTenant = {
            id: sampleTenants.length + 1,
            name: name,
            unit: unit,
            email: email,
            phone: phone,
            rent: parseInt(rent),
            status: 'active',
            leaseEnd: leaseEnd
        };
        sampleTenants.push(newTenant);
        
        hideLoading();
        closeModal('addTenantModal');
        showToast(`Tenant ${name} added successfully!`, 'success', 'Success');
        
        // Refresh the tenants page if it's currently active
        if (document.getElementById('tenantsPage').classList.contains('active')) {
            loadTenantsPage();
        }
        
        // Reset form
        document.getElementById('addTenantForm').reset();
    }, 800);
}

function submitAddMaintenance() {
    const unit = document.getElementById('maintenanceUnit').value;
    const priority = document.getElementById('maintenancePriority').value;
    const issue = document.getElementById('maintenanceIssue').value;
    const details = document.getElementById('maintenanceDetails').value;

    if (!unit || !priority || !issue) {
        showToast('Please fill in all required fields', 'error', 'Validation Error');
        return;
    }

    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Add to sample data
        const newRequest = {
            id: sampleMaintenanceRequests.length + 1,
            unit: unit,
            tenant: 'Current Tenant',
            issue: issue,
            priority: priority,
            status: 'open',
            date: new Date().toISOString().split('T')[0],
            assignedTo: null,
            details: details
        };
        sampleMaintenanceRequests.unshift(newRequest);
        
        hideLoading();
        closeModal('addMaintenanceModal');
        showToast('Maintenance request submitted successfully!', 'success', 'Success');
        
        // Refresh the maintenance page if it's currently active
        if (document.getElementById('maintenancePage').classList.contains('active')) {
            loadMaintenancePage();
        }
        
        // Reset form
        document.getElementById('addMaintenanceForm').reset();
    }, 800);
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

// HTML escape function to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions for global access
window.loadPage = loadPage;
window.openAddTenantModal = openAddTenantModal;
window.openAddMaintenanceModal = openAddMaintenanceModal;
window.openAddLeaseModal = openAddLeaseModal;
window.viewTenant = viewTenant;
window.submitAddTenant = submitAddTenant;
window.submitAddMaintenance = submitAddMaintenance;

// Loading Spinner Functions
function showLoading() {
    let spinner = document.getElementById('loadingSpinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.id = 'loadingSpinner';
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(spinner);
    }
    spinner.classList.add('active');
}

function hideLoading() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.classList.remove('active');
    }
}

// Toast Notification Functions
function showToast(message, type = 'info', title = '') {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    // Escape user input to prevent XSS
    const escapedTitle = title ? escapeHtml(title) : '';
    const escapedMessage = escapeHtml(message);
    
    toast.innerHTML = `
        <i class="fas ${icons[type]}"></i>
        <div class="toast-message">
            ${escapedTitle ? `<strong>${escapedTitle}</strong>` : ''}
            <span>${escapedMessage}</span>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Export new functions
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
