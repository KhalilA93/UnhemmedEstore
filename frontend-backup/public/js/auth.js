// Authentication functionality
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = this.token ? JSON.parse(localStorage.getItem('user') || '{}') : null;
        this.init();
    }

    init() {
        // Set up form event listeners
        this.setupFormListeners();
        this.setupPasswordStrength();
        this.updateAuthUI();
    }

    setupFormListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Forgot password form
        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => this.handleForgotPassword(e));
        }

        // Reset password form
        const resetPasswordForm = document.getElementById('resetPasswordForm');
        if (resetPasswordForm) {
            resetPasswordForm.addEventListener('submit', (e) => this.handleResetPassword(e));
        }

        // Logout buttons
        document.querySelectorAll('.logout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLogout(e));
        });
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('passwordStrengthBar');
        const passwordHelp = document.getElementById('passwordHelp');

        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', (e) => {
                const password = e.target.value;
                const strength = this.calculatePasswordStrength(password);
                this.updatePasswordStrength(strength, strengthBar, passwordHelp);
            });
        }

        // Confirm password validation
        const confirmPasswordInput = document.getElementById('confirmPassword');
        if (confirmPasswordInput && passwordInput) {
            confirmPasswordInput.addEventListener('input', (e) => {
                this.validatePasswordMatch(passwordInput.value, e.target.value);
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            symbols: /[^A-Za-z0-9]/.test(password)
        };

        Object.values(checks).forEach(check => {
            if (check) score++;
        });

        return {
            score,
            checks,
            strength: score < 2 ? 'weak' : score < 4 ? 'fair' : score < 5 ? 'good' : 'strong'
        };
    }

    updatePasswordStrength(strength, strengthBar, passwordHelp) {
        const percentage = (strength.score / 5) * 100;
        strengthBar.style.width = `${percentage}%`;
        strengthBar.className = `password-strength-fill strength-${strength.strength}`;

        const messages = {
            weak: 'Password is too weak',
            fair: 'Password is fair',
            good: 'Password is good',
            strong: 'Password is strong'
        };

        if (passwordHelp) {
            passwordHelp.textContent = messages[strength.strength];
            passwordHelp.className = `text-${strength.strength === 'weak' ? 'danger' : strength.strength === 'fair' ? 'warning' : 'success'}`;
        }
    }

    validatePasswordMatch(password, confirmPassword) {
        const confirmInput = document.getElementById('confirmPassword');
        if (confirmInput) {
            if (password !== confirmPassword && confirmPassword.length > 0) {
                confirmInput.setCustomValidity('Passwords do not match');
                confirmInput.classList.add('is-invalid');
            } else {
                confirmInput.setCustomValidity('');
                confirmInput.classList.remove('is-invalid');
            }
        }
    }    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.setLoading(form, true);
            
            // Demo login functionality
            if (this.isValidDemoCredentials(data.email, data.password)) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Create user object
                const user = {
                    isLoggedIn: true,
                    name: this.getDemoUserName(data.email),
                    email: data.email,
                    loginTime: new Date().toISOString(),
                    rememberMe: data.rememberMe || false
                };
                
                // Store user data
                localStorage.setItem('user', JSON.stringify(user));
                if (data.rememberMe) {
                    localStorage.setItem('authToken', 'demo_token_' + Date.now());
                }
                
                this.user = user;
                this.showAlert('Login successful! Redirecting...', 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/';
                    window.location.href = redirectUrl;
                }, 1500);
            } else {
                this.showAlert('Invalid email or password. Try demo@demo.com / demo', 'danger');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            this.setLoading(form, false);
        }
    }

    isValidDemoCredentials(email, password) {
        // Demo credentials for testing
        const demoUsers = [
            { email: 'john@example.com', password: 'password123' },
            { email: 'jane@example.com', password: 'password123' },
            { email: 'admin@unhemmed.com', password: 'admin123' },
            { email: 'demo@demo.com', password: 'demo' }
        ];
        
        return demoUsers.some(user => user.email === email && user.password === password);
    }

    getDemoUserName(email) {
        const demoUsers = {
            'john@example.com': 'John Doe',
            'jane@example.com': 'Jane Smith', 
            'admin@unhemmed.com': 'Admin User',
            'demo@demo.com': 'Demo User'
        };
        return demoUsers[email] || email.split('@')[0];
    }

    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Validate password match
        if (data.password !== data.confirmPassword) {
            this.showAlert('Passwords do not match', 'danger');
            return;
        }

        try {
            this.setLoading(form, true);
            const response = await this.makeRequest('/api/auth/register', 'POST', data);
            
            if (response.success) {
                this.setAuthData(response.data.token, response.data);
                this.showAlert('Registration successful! Welcome to Unhemmed!', 'success');
                
                // Redirect after short delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            } else {
                this.showAlert(response.message || 'Registration failed', 'danger');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            this.setLoading(form, false);
        }
    }

    async handleForgotPassword(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        try {
            this.setLoading(form, true);
            const response = await this.makeRequest('/api/auth/forgot-password', 'POST', data);
            
            if (response.success) {
                this.showAlert('Password reset email sent! Check your inbox.', 'success');
                form.reset();
            } else {
                this.showAlert(response.message || 'Failed to send reset email', 'danger');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            this.setLoading(form, false);
        }
    }

    async handleResetPassword(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            this.showAlert('Invalid reset token', 'danger');
            return;
        }

        // Validate password match
        if (data.password !== data.confirmPassword) {
            this.showAlert('Passwords do not match', 'danger');
            return;
        }

        try {
            this.setLoading(form, true);
            const response = await this.makeRequest(`/api/auth/reset-password/${token}`, 'PUT', {
                password: data.password
            });
            
            if (response.success) {
                this.showAlert('Password reset successful! Redirecting to login...', 'success');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else {
                this.showAlert(response.message || 'Password reset failed', 'danger');
            }
        } catch (error) {
            this.showAlert('Network error. Please try again.', 'danger');
        } finally {
            this.setLoading(form, false);
        }
    }

    async handleLogout(e) {
        e.preventDefault();
        
        try {
            await this.makeRequest('/api/auth/logout', 'POST');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.clearAuthData();
            window.location.href = '/login';
        }
    }

    async makeRequest(url, method = 'GET', data = null) {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            options.headers.Authorization = `Bearer ${this.token}`;
        }

        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);
        return await response.json();
    }

    setAuthData(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateAuthUI();
    }

    clearAuthData() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.updateAuthUI();
    }

    updateAuthUI() {
        // Update navigation for authenticated/unauthenticated users
        const authLinks = document.querySelectorAll('.auth-link');
        const guestLinks = document.querySelectorAll('.guest-link');
        const userInfo = document.querySelectorAll('.user-info');

        if (this.isAuthenticated()) {
            authLinks.forEach(link => link.style.display = 'block');
            guestLinks.forEach(link => link.style.display = 'none');
            userInfo.forEach(info => {
                info.textContent = this.user.firstName || 'User';
            });
        } else {
            authLinks.forEach(link => link.style.display = 'none');
            guestLinks.forEach(link => link.style.display = 'block');
        }
    }

    setLoading(form, loading) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.fa-spinner');

        if (loading) {
            submitBtn.disabled = true;
            btnText.classList.add('d-none');
            spinner.classList.remove('d-none');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            spinner.classList.add('d-none');
        }
    }

    showAlert(message, type) {
        const alertContainer = document.getElementById('alertContainer');
        if (!alertContainer) return;

        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Export for use in other scripts
window.authManager = authManager;
