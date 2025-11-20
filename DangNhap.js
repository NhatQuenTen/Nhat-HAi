// ==========================================
// ĐĂNG NHẬP - LOGIN SYSTEM
// ==========================================

class AuthSystem {
    constructor() {
        this.users = this.loadUsers();
        this.currentUser = this.getCurrentUser();
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

    // Get current logged in user
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Set current user
    setCurrentUser(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUser = user;
    }

    // Clear current user (logout)
    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
    }

    // Find user by email or phone
    findUser(emailOrPhone) {
        return this.users.find(user => 
            user.email.toLowerCase() === emailOrPhone.toLowerCase() || 
            user.phone === emailOrPhone
        );
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

    // Login user
    login(emailOrPhone, password, rememberMe = false) {
        // Find user
        const user = this.findUser(emailOrPhone);
        
        if (!user) {
            throw new Error('Tài khoản không tồn tại!');
        }

        // Check password
        if (user.password !== password) {
            throw new Error('Mật khẩu không chính xác!');
        }

        // Set login session
        this.setCurrentUser({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            phone: user.phone,
            accountType: user.accountType,
            companyName: user.companyName,
            loginTime: new Date().toISOString()
        });

        // Remember me feature
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('lastUser', emailOrPhone);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('lastUser');
        }

        return this.currentUser;
    }
}

// Initialize Auth System
const auth = new AuthSystem();

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

// Validate login form
function validateLoginForm(emailOrPhone, password) {
    const errors = [];

    // Check empty fields
    if (!emailOrPhone.trim()) {
        errors.push('Vui lòng nhập email hoặc số điện thoại!');
    }

    if (!password.trim()) {
        errors.push('Vui lòng nhập mật khẩu!');
    }

    // Validate email or phone format
    if (emailOrPhone.trim()) {
        const isEmail = auth.validateEmail(emailOrPhone);
        const isPhone = auth.validatePhone(emailOrPhone);
        
        if (!isEmail && !isPhone) {
            errors.push('Email hoặc số điện thoại không hợp lệ!');
        }
    }

    return errors;
}

// Handle login form submission
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (window.location.pathname.includes('DangNhap.html') && auth.currentUser) {
    const confirmRedirect = confirm('Bạn đã đăng nhập rồi! Chuyển đến trang chủ?');
    if (confirmRedirect) {
        window.location.href = 'TimUngVien.html';
        return;
    }
    // else không làm gì, giữ currentUser
}

    // Load remembered user
    const rememberMe = localStorage.getItem('rememberMe');
    const lastUser = localStorage.getItem('lastUser');
    
    if (rememberMe === 'true' && lastUser) {
        document.getElementById('loginEmail').value = lastUser;
        document.getElementById('rememberMe').checked = true;
    }

    // Login form submit
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailOrPhone = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate form
        const errors = validateLoginForm(emailOrPhone, password);
        
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
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Attempt login
            const user = auth.login(emailOrPhone, password, rememberMe);
            
            // Success
            showNotification(`Chào mừng ${user.fullName}! Đang chuyển hướng...`, 'success');
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'TimUngVien.html';
            }, 1500);
            
        } catch (error) {
            // Error
            showNotification(error.message, 'danger');
            
            // Reset button
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
            
            // Clear password field on error
            document.getElementById('loginPassword').value = '';
        }
    });

    // Social login buttons
    document.querySelectorAll('.btn-social').forEach(btn => {
        btn.addEventListener('click', function() {
            const provider = this.textContent.trim();
            showNotification(`Đăng nhập với ${provider} - Tính năng đang phát triển`, 'info');
        });
    });

    // Forgot password
    const forgotPasswordLink = document.querySelector('a[href="#"]');
    if (forgotPasswordLink && forgotPasswordLink.textContent.includes('Quên mật khẩu')) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = prompt('Nhập email của bạn để đặt lại mật khẩu:');
            
            if (email) {
                if (auth.validateEmail(email)) {
                    const user = auth.findUser(email);
                    
                    if (user) {
                        showNotification(`Link đặt lại mật khẩu đã được gửi đến ${email}`, 'success');
                    } else {
                        showNotification('Email không tồn tại trong hệ thống!', 'danger');
                    }
                } else {
                    showNotification('Email không hợp lệ!', 'danger');
                }
            }
        });
    }

    // Add enter key support
    document.getElementById('loginEmail').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('loginPassword').focus();
        }
    });

    document.getElementById('loginPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

// Create sample users on first load (for testing)
if (localStorage.getItem('users') === null) {
    const sampleUsers = [
        {
            id: 1,
            email: 'admin@example.com',
            password: '12345678',
            fullName: 'Quản Trị Viên',
            phone: '0123456789',
            accountType: 'employer',
            companyName: 'Công ty ABC',
            companySize: '51-200 nhân viên',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            email: 'user@example.com',
            password: 'password123',
            fullName: 'Nguyễn Văn A',
            phone: '0987654321',
            accountType: 'candidate',
            createdAt: new Date().toISOString()
        }
    ];
    
    localStorage.setItem('users', JSON.stringify(sampleUsers));
    console.log('Sample users created for testing');
    console.log('Login credentials:');
    console.log('- admin@example.com / 12345678');
    console.log('- user@example.com / password123');
}
