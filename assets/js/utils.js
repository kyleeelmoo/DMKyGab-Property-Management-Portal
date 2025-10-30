// UI Utilities - Loading Spinners, Toast Notifications, etc.

// Loading Spinner
const loadingSpinner = {
    show(message = 'Loading...') {
        let spinner = document.getElementById('globalSpinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'globalSpinner';
            spinner.className = 'loading-overlay';
            spinner.innerHTML = `
                <div class="spinner-container">
                    <div class="spinner"></div>
                    <p class="spinner-message">${message}</p>
                </div>
            `;
            document.body.appendChild(spinner);
        }
        spinner.style.display = 'flex';
    },

    hide() {
        const spinner = document.getElementById('globalSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
};

// Toast Notifications
const toast = {
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = this.getIcon(type);
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        const container = this.getContainer();
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove after duration
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(message, duration) {
        this.show(message, 'success', duration);
    },

    error(message, duration) {
        this.show(message, 'error', duration);
    },

    warning(message, duration) {
        this.show(message, 'warning', duration);
    },

    info(message, duration) {
        this.show(message, 'info', duration);
    },

    getIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    },

    getContainer() {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        return container;
    }
};

// Form Validation Utilities
const formValidation = {
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    },

    validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
    },

    showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            let error = formGroup.querySelector('.error-message');
            if (!error) {
                error = document.createElement('small');
                error.className = 'error-message';
                formGroup.appendChild(error);
            }
            error.textContent = message;
            input.classList.add('error');
        }
    },

    clearError(input) {
        const formGroup = input.closest('.form-group');
        if (formGroup) {
            const error = formGroup.querySelector('.error-message');
            if (error) {
                error.remove();
            }
            input.classList.remove('error');
        }
    },

    clearAllErrors(form) {
        const errors = form.querySelectorAll('.error-message');
        errors.forEach(error => error.remove());
        const inputs = form.querySelectorAll('.error');
        inputs.forEach(input => input.classList.remove('error'));
    }
};

// Modal Utilities
const modal = {
    show(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn btn-${btn.type || 'secondary'}" data-action="${btn.action}">
                            ${btn.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 10);

        // Close button
        modal.querySelector('.modal-close').addEventListener('click', () => {
            this.close(modal);
        });

        // Button actions
        buttons.forEach(btn => {
            if (btn.onClick) {
                modal.querySelector(`[data-action="${btn.action}"]`).addEventListener('click', () => {
                    btn.onClick();
                });
            }
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.close(modal);
            }
        });

        return modal;
    },

    close(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
};

// Debounce utility for search
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Export utilities
window.loadingSpinner = loadingSpinner;
window.toast = toast;
window.formValidation = formValidation;
window.modal = modal;
window.debounce = debounce;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
