// ==========================================
// ĐĂNG KÝ - REGISTRATION SYSTEM
// ==========================================

class RegistrationSystem {
    constructor() {
        this.users = this.loadUsers();
    }

    // Load users from localStorage
    loadUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Generate unique ID
    generateId() {
        return this.users.length > 0 
            ? Math.max(...this.users.map(u => u.id)) + 1 
            : 1;
    }

    // Check if email exists
    emailExists(email) {
        return this.users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Check if phone exists
    phoneExists(phone) {
        return this.users.some(user => user.phone === phone);
    }

    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone format (Vietnamese)
    validatePhone(phone) {
        const re = /^(0|\+84)[0-9]{9,10}$/;
        return re.test(phone);
    }

    // Validate password strength
    validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Mật khẩu phải có ít nhất 8 ký tự');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Mật khẩu phải chứa chữ thường');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Mật khẩu phải chứa chữ in hoa');
        }
        
        if (!/[0-9]/.test(password)) {
            errors.push('Mật khẩu phải chứa số');
        }
        
        return errors;
    }

    // Calculate password strength
    getPasswordStrength(password) {
        let strength = 0;
        
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        
        return strength;
    }

    // Register new user
    register(userData) {
        // Check if email already exists
        if (this.emailExists(userData.email)) {
            throw new Error('Email đã được đăng ký!');
        }

        // Check if phone already exists
        if (this.phoneExists(userData.phone)) {
            throw new Error('Số điện thoại đã được đăng ký!');
        }

        // Create new user with full information
        const newUser = {
            id: this.generateId(),
            accountType: userData.accountType || 'employer',
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            companyName: userData.companyName || '',
            companySize: userData.companySize || '',
            createdAt: new Date().toISOString(),
            verified: false,
            loginAlert: true,
            // Company data structure for settings page
            companyData: {
                name: userData.companyName || '',
                size: userData.companySize || '',
                taxCode: '',
                location: '',
                address: '',
                phone: '',
                industries: []
            },
            // Contact info
            contactEmail: userData.email,
            address: '',
            avatar: ''
        };

        // Add to users array
        this.users.push(newUser);

        // Save to localStorage
        this.saveUsers();

        return newUser;
    }
}

// Initialize Registration System
const registration = new RegistrationSystem();

// Account Type - Chỉ dành cho Nhà tuyển dụng
// Không cần function selectAccountType nữa vì chỉ có 1 loại tài khoản

// Toggle Password Visibility
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}

// Update Password Strength Indicator
function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText').querySelector('span');
    
    const strength = registration.getPasswordStrength(password);
    
    const strengths = ['Yếu', 'Trung bình', 'Khá', 'Mạnh'];
    const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
    const widths = ['25%', '50%', '75%', '100%'];

    if (password.length === 0) {
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = '#e5e7eb';
        strengthText.textContent = 'Yếu';
        strengthText.style.color = '#6b7280';
    } else {
        strengthBar.style.width = widths[strength] || '0%';
        strengthBar.style.backgroundColor = colors[strength] || '#e5e7eb';
        strengthText.textContent = strengths[strength] || 'Yếu';
        strengthText.style.color = colors[strength] || '#6b7280';
    }
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Validate registration form
function validateRegistrationForm(formData) {
    const errors = [];

    // Validate full name
    if (!formData.fullName.trim()) {
        errors.push('Vui lòng nhập họ và tên!');
    } else if (formData.fullName.trim().length < 3) {
        errors.push('Họ và tên phải có ít nhất 3 ký tự!');
    }

    // Validate phone
    if (!formData.phone.trim()) {
        errors.push('Vui lòng nhập số điện thoại!');
    } else if (!registration.validatePhone(formData.phone)) {
        errors.push('Số điện thoại không hợp lệ! (VD: 0123456789)');
    }

    // Validate email
    if (!formData.email.trim()) {
        errors.push('Vui lòng nhập email!');
    } else if (!registration.validateEmail(formData.email)) {
        errors.push('Email không hợp lệ!');
    }

    // Validate company name for employer (luôn bắt buộc)
    if (!formData.companyName.trim()) {
        errors.push('Vui lòng nhập tên công ty!');
    }

    // Validate password
    if (!formData.password) {
        errors.push('Vui lòng nhập mật khẩu!');
    } else {
        const passwordErrors = registration.validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            errors.push(...passwordErrors);
        }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
        errors.push('Vui lòng nhập xác nhận mật khẩu!');
    } else if (formData.password !== formData.confirmPassword) {
        errors.push('Mật khẩu xác nhận không khớp!');
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
        errors.push('Vui lòng đồng ý với điều khoản dịch vụ!');
    }

    return errors;
}

// Handle registration form submission
document.addEventListener('DOMContentLoaded', function() {
    // Password strength checker
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        updatePasswordStrength(this.value);
    });

    // Real-time validation
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (email && registration.emailExists(email)) {
            showNotification('Email này đã được đăng ký!', 'warning');
            this.focus();
        }
    });

    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        const phone = this.value.trim();
        if (phone && registration.phoneExists(phone)) {
            showNotification('Số điện thoại này đã được đăng ký!', 'warning');
            this.focus();
        }
    });

    // Phone number formatting
    phoneInput.addEventListener('input', function() {
        // Remove non-numeric characters
        this.value = this.value.replace(/[^0-9+]/g, '');
    });

    // Register form submit
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data - Chỉ cho Nhà tuyển dụng
        const formData = {
            accountType: 'employer', // Cố định là employer
            fullName: document.getElementById('fullName').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            agreeTerms: document.getElementById('agreeTerms').checked,
            companyName: document.getElementById('companyName').value.trim(),
            companySize: document.getElementById('companySize').value
        };

        // Validate form
        const errors = validateRegistrationForm(formData);
        
        if (errors.length > 0) {
            showNotification(errors.join('<br>'), 'danger');
            return;
        }

        // Get submit button
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalHTML = submitBtn.innerHTML;
        
        // Show loading
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang xử lý...';
        submitBtn.disabled = true;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Remove confirm password and agreeTerms from data to save
            const { confirmPassword, agreeTerms, ...userData } = formData;
            
            // Attempt registration
            const newUser = registration.register(userData);
            
            // Success
            showNotification(
                `Đăng ký thành công!<br>Vui lòng kiểm tra email <strong>${newUser.email}</strong> để xác thực tài khoản.`,
                'success'
            );
            
            // Redirect to login after short delay
            setTimeout(() => {
                window.location.href = 'DangNhap.html';
            }, 2500);
            
        } catch (error) {
            // Error
            showNotification(error.message, 'danger');
            
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
        }
    });

    // Social register buttons
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.textContent.trim();
            showNotification(`Đăng ký với ${provider} - Tính năng đang phát triển`, 'info');
        });
    });

    // Terms and privacy links
    const termsLinks = document.querySelectorAll('a[href="#"]');
    termsLinks.forEach(link => {
        if (link.textContent.includes('Điều khoản') || link.textContent.includes('Chính sách')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                showNotification(`${this.textContent} - Tính năng đang phát triển`, 'info');
            });
        }
    });

    // Add character counter for password
    passwordInput.addEventListener('input', function() {
        const length = this.value.length;
        const minLength = 8;
        
        if (length > 0 && length < minLength) {
            this.setCustomValidity(`Cần thêm ${minLength - length} ký tự nữa`);
        } else {
            this.setCustomValidity('');
        }
    });

    // Match password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    confirmPasswordInput.addEventListener('input', function() {
        const password = document.getElementById('password').value;
        
        if (this.value && this.value !== password) {
            this.setCustomValidity('Mật khẩu không khớp');
        } else {
            this.setCustomValidity('');
        }
    });
});
