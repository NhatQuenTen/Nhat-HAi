// ==================== Settings Page Manager ====================

class SettingsManager {
    constructor() {
        this.currentUser = this.loadUserData();
        this.selectedIndustries = [];
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        if (!this.currentUser) {
            window.location.href = 'DangNhap.html';
            return;
        }

        this.loadUserSettings();
        this.attachEventListeners();
        this.populateIndustryList();
    }

    loadUserData() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return null;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        return users.find(u => u.id === currentUser.id);
    }

    loadUserSettings() {
        // Load account info
        const emailField = document.getElementById('accountEmail');
        const fullNameField = document.getElementById('fullName');
        const phoneField = document.getElementById('phoneNumber');
        const contactEmailField = document.getElementById('contactEmail');
        const contactAddressField = document.getElementById('contactAddress');

        if (emailField) emailField.value = this.currentUser.email || this.currentUser.phone || '';
        if (fullNameField) fullNameField.value = this.currentUser.fullName || '';
        if (phoneField) phoneField.value = this.currentUser.phone || '';
        if (contactEmailField) contactEmailField.value = this.currentUser.contactEmail || this.currentUser.email || '';
        if (contactAddressField) contactAddressField.value = this.currentUser.address || '';

        // Load company info if exists
        const companyData = this.currentUser.companyData || {};
        const taxCodeField = document.getElementById('taxCode');
        const companyNameField = document.getElementById('companyName');
        const companySizeField = document.getElementById('companySize');
        const companyLocationField = document.getElementById('companyLocation');
        const companyAddressField = document.getElementById('companyAddress');
        const companyPhoneField = document.getElementById('companyPhone');

        if (taxCodeField) taxCodeField.value = companyData.taxCode || '';
        if (companyNameField) companyNameField.value = companyData.name || '';
        if (companySizeField) companySizeField.value = companyData.size || '';
        if (companyLocationField) companyLocationField.value = companyData.location || '';
        if (companyAddressField) companyAddressField.value = companyData.address || '';
        if (companyPhoneField) companyPhoneField.value = companyData.phone || '';

        // Load industries
        this.selectedIndustries = companyData.industries || [];
        this.updateIndustryDisplay();

        // Load notification settings
        const loginAlertToggle = document.getElementById('loginAlertToggle');
        if (loginAlertToggle) {
            loginAlertToggle.checked = this.currentUser.loginAlert !== false;
        }

        // Display avatar if exists
        if (this.currentUser.avatar) {
            const avatarPreview = document.getElementById('avatarPreview');
            if (avatarPreview) {
                avatarPreview.innerHTML = `<img src="${this.currentUser.avatar}" alt="Avatar">`;
            }
        }
    }

    attachEventListeners() {
        // Tab switching
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e));
        });

        // Change password
        const changePasswordLink = document.getElementById('changePasswordLink');
        if (changePasswordLink) {
            changePasswordLink.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
                modal.show();
            });
        }

        const submitPasswordChange = document.getElementById('submitPasswordChange');
        if (submitPasswordChange) {
            submitPasswordChange.addEventListener('click', () => this.changePassword());
        }

        // Avatar upload
        const changeAvatarBtn = document.getElementById('changeAvatarBtn');
        const avatarInput = document.getElementById('avatarInput');
        
        if (changeAvatarBtn) {
            changeAvatarBtn.addEventListener('click', () => avatarInput.click());
        }
        
        if (avatarInput) {
            avatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));
        }

        // Update account
        const updateAccountBtn = document.getElementById('updateAccountBtn');
        if (updateAccountBtn) {
            updateAccountBtn.addEventListener('click', () => this.updateAccount());
        }

        // Update company
        const updateCompanyBtn = document.getElementById('updateCompanyBtn');
        if (updateCompanyBtn) {
            updateCompanyBtn.addEventListener('click', () => this.updateCompany());
        }

        // Industry selection
        const industryDropdown = document.getElementById('industryDropdown');
        if (industryDropdown) {
            industryDropdown.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('industryModal'));
                modal.show();
            });
        }

        const confirmIndustry = document.getElementById('confirmIndustry');
        if (confirmIndustry) {
            confirmIndustry.addEventListener('click', () => this.confirmIndustrySelection());
        }

        const industrySearch = document.getElementById('industrySearch');
        if (industrySearch) {
            industrySearch.addEventListener('input', (e) => this.filterIndustries(e.target.value));
        }

        // Upload license
        const uploadLicenseBtn = document.getElementById('uploadLicenseBtn');
        if (uploadLicenseBtn) {
            uploadLicenseBtn.addEventListener('click', () => {
                const modal = new bootstrap.Modal(document.getElementById('uploadLicenseModal'));
                modal.show();
            });
        }

        const selectFileBtn = document.getElementById('selectFileBtn');
        const licenseFileInput = document.getElementById('licenseFileInput');
        
        if (selectFileBtn) {
            selectFileBtn.addEventListener('click', () => licenseFileInput.click());
        }
        
        if (licenseFileInput) {
            licenseFileInput.addEventListener('change', (e) => this.handleLicenseUpload(e));
        }

        // Drag and drop for license upload
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                this.handleLicenseUpload({ target: { files: e.dataTransfer.files } });
            });
        }

        const submitLicense = document.getElementById('submitLicense');
        if (submitLicense) {
            submitLicense.addEventListener('click', () => this.submitLicenseFiles());
        }

        // Login alert toggle
        const loginAlertToggle = document.getElementById('loginAlertToggle');
        if (loginAlertToggle) {
            loginAlertToggle.addEventListener('change', (e) => {
                this.currentUser.loginAlert = e.target.checked;
                this.saveUserData();
                
                const message = e.target.checked ? 
                    'Đã bật cảnh báo đăng nhập' : 
                    'Đã tắt cảnh báo đăng nhập';
                this.showNotification(message, 'info');
            });
        }

        // Add phone number link
        const addPhoneLink = document.getElementById('addPhoneLink');
        if (addPhoneLink) {
            addPhoneLink.addEventListener('click', (e) => {
                e.preventDefault();
                const newPhone = prompt('Nhập số điện thoại thứ hai:');
                if (newPhone) {
                    if (this.validatePhone(newPhone)) {
                        this.showNotification('Đã thêm số điện thoại thứ hai: ' + newPhone, 'success');
                        // You can store this in an array if needed
                    } else {
                        this.showError('Số điện thoại không hợp lệ');
                    }
                }
            });
        }
    }

    switchTab(e) {
        const tabName = e.currentTarget.dataset.tab;
        
        // Update tab buttons
        document.querySelectorAll('.settings-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        e.currentTarget.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetContent = tabName === 'account' ? 
            document.getElementById('accountTab') : 
            document.getElementById('companyTab');
        
        if (targetContent) {
            targetContent.classList.add('active');
        }
    }

    changePassword() {
        const oldPassword = document.getElementById('oldPassword').value.trim();
        const newPassword = document.getElementById('newPassword').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            this.showError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (oldPassword !== this.currentUser.password) {
            this.showError('Mật khẩu cũ không đúng');
            return;
        }

        if (newPassword.length < 8) {
            this.showError('Mật khẩu mới phải có ít nhất 8 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            this.showError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Update password
        this.currentUser.password = newPassword;
        this.saveUserData();

        // Close modal and reset form
        const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
        modal.hide();
        document.getElementById('changePasswordForm').reset();

        this.showSuccess('Đổi mật khẩu thành công!');
    }

    handleAvatarUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            this.showError('Vui lòng chọn file hình ảnh');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            this.showError('Kích thước file không được vượt quá 5MB');
            return;
        }

        // Read and display
        const reader = new FileReader();
        reader.onload = (event) => {
            const avatarPreview = document.getElementById('avatarPreview');
            avatarPreview.innerHTML = `<img src="${event.target.result}" alt="Avatar">`;
            this.currentUser.avatar = event.target.result;
            this.saveUserData();
            
            // Update sidebar avatar
            this.updateSidebarAvatar();
            
            this.showSuccess('Đã cập nhật ảnh đại diện thành công!');
        };
        reader.readAsDataURL(file);
    }

    updateAccount() {
        const fullName = document.getElementById('fullName').value.trim();
        const phoneNumber = document.getElementById('phoneNumber').value.trim();
        const contactEmail = document.getElementById('contactEmail').value.trim();
        const contactAddress = document.getElementById('contactAddress').value.trim();

        // Validation
        if (!fullName || !phoneNumber) {
            this.showError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (phoneNumber && !this.validatePhone(phoneNumber)) {
            this.showError('Số điện thoại không hợp lệ');
            return;
        }

        if (contactEmail && !this.validateEmail(contactEmail)) {
            this.showError('Email không hợp lệ');
            return;
        }

        // Get button and show loading
        const btn = document.getElementById('updateAccountBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang cập nhật...';
        btn.disabled = true;

        // Simulate async operation
        setTimeout(() => {
            // Update user data
            this.currentUser.fullName = fullName;
            this.currentUser.phone = phoneNumber;
            this.currentUser.contactEmail = contactEmail;
            this.currentUser.address = contactAddress;

            this.saveUserData();
            this.showSuccess('Cập nhật thông tin tài khoản thành công!');

            // Update sidebar info
            this.updateSidebarInfo();

            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 800);
    }

    updateCompany() {
        const taxCode = document.getElementById('taxCode').value.trim();
        const companyName = document.getElementById('companyName').value.trim();
        const companySize = document.getElementById('companySize').value;
        const companyLocation = document.getElementById('companyLocation').value;
        const companyAddress = document.getElementById('companyAddress').value.trim();
        const companyPhone = document.getElementById('companyPhone').value.trim();

        // Validation
        if (!taxCode || !companyName || !companySize || !companyLocation || !companyAddress) {
            this.showError('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        // Get button and show loading
        const btn = document.getElementById('updateCompanyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang cập nhật...';
        btn.disabled = true;

        // Simulate async operation
        setTimeout(() => {
            // Update company data
            this.currentUser.companyData = {
                taxCode,
                name: companyName,
                size: companySize,
                location: companyLocation,
                address: companyAddress,
                phone: companyPhone,
                industries: this.selectedIndustries
            };

            // Also update top-level company info
            this.currentUser.companyName = companyName;
            this.currentUser.companySize = companySize;

            this.saveUserData();
            this.showSuccess('Cập nhật thông tin công ty thành công! Đang chờ phê duyệt.');

            // Update sidebar info (company name)
            this.updateSidebarInfo();

            // Reset button
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 800);
    }

    populateIndustryList() {
        const industries = [
            'Công nghệ thông tin',
            'Phát triển phần mềm và dịch vụ công nghệ thông tin (CNTT)',
            'Điện tử - Viễn thông',
            'Kinh doanh - Thương mại',
            'Marketing - Truyền thông',
            'Ngân hàng - Tài chính',
            'Bảo hiểm',
            'Kế toán - Kiểm toán',
            'Xây dựng - Kiến trúc',
            'Bất động sản',
            'Sản xuất - Chế tạo',
            'Cơ khí - Ô tô',
            'Y tế - Dược phẩm',
            'Giáo dục - Đào tạo',
            'Du lịch - Nhà hàng - Khách sạn',
            'Logistics - Vận tải',
            'Nhân sự',
            'Luật - Pháp lý',
            'Nông nghiệp',
            'Môi trường',
            'Thời trang - Mỹ phẩm',
            'Thực phẩm - Đồ uống',
            'Năng lượng',
            'Khai khoáng',
            'In ấn - Xuất bản'
        ];

        const industryList = document.getElementById('industryList');
        if (!industryList) return;

        industryList.innerHTML = industries.map((industry, index) => `
            <div class="industry-item">
                <input type="checkbox" id="industry_${index}" value="${industry}" 
                    ${this.selectedIndustries.includes(industry) ? 'checked' : ''}>
                <label for="industry_${index}">${industry}</label>
            </div>
        `).join('');
    }

    filterIndustries(searchTerm) {
        const items = document.querySelectorAll('.industry-item');
        const term = searchTerm.toLowerCase();

        items.forEach(item => {
            const label = item.querySelector('label').textContent.toLowerCase();
            item.style.display = label.includes(term) ? 'flex' : 'none';
        });
    }

    confirmIndustrySelection() {
        const checkboxes = document.querySelectorAll('#industryList input[type="checkbox"]:checked');
        this.selectedIndustries = Array.from(checkboxes).map(cb => cb.value);
        
        this.updateIndustryDisplay();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('industryModal'));
        modal.hide();
    }

    updateIndustryDisplay() {
        const industryCount = document.getElementById('industryCount');
        const industryTags = document.getElementById('industryTags');

        if (industryCount) {
            industryCount.textContent = this.selectedIndustries.length > 0 ? 
                `${this.selectedIndustries.length} lĩnh vực` : 
                'Chọn lĩnh vực';
        }

        if (industryTags) {
            industryTags.innerHTML = this.selectedIndustries.map(industry => `
                <div class="industry-tag">
                    ${industry}
                    <button type="button" class="remove-tag" onclick="settingsManager.removeIndustry('${industry}')">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            `).join('');
        }
    }

    removeIndustry(industry) {
        this.selectedIndustries = this.selectedIndustries.filter(i => i !== industry);
        this.updateIndustryDisplay();
        
        // Update checkbox in modal
        const checkboxes = document.querySelectorAll('#industryList input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (cb.value === industry) {
                cb.checked = false;
            }
        });
    }

    handleLicenseUpload(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            // Validate
            if (file.size > 5 * 1024 * 1024) {
                this.showError(`File ${file.name} vượt quá 5MB`);
                return;
            }

            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
            if (!allowedTypes.includes(file.type)) {
                this.showError(`File ${file.name} không đúng định dạng`);
                return;
            }

            this.uploadedFiles.push(file);
        });

        this.displayUploadedFiles();
    }

    displayUploadedFiles() {
        const uploadedFilesContainer = document.getElementById('uploadedFiles');
        if (!uploadedFilesContainer) return;

        uploadedFilesContainer.innerHTML = this.uploadedFiles.map((file, index) => `
            <div class="uploaded-file-item">
                <i class="bi bi-file-earmark-pdf"></i>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${this.formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="remove-file" onclick="settingsManager.removeFile(${index})">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `).join('');
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.displayUploadedFiles();
    }

    submitLicenseFiles() {
        if (this.uploadedFiles.length === 0) {
            this.showError('Vui lòng chọn ít nhất một file');
            return;
        }

        // Save file info
        this.currentUser.licenseFiles = this.uploadedFiles.map(file => ({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadDate: new Date().toISOString()
        }));

        this.saveUserData();

        const modal = bootstrap.Modal.getInstance(document.getElementById('uploadLicenseModal'));
        modal.hide();

        this.showSuccess('Tải lên giấy phép thành công! Đang chờ phê duyệt.');
        this.uploadedFiles = [];
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhone(phone) {
        return /^[0-9]{10,11}$/.test(phone);
    }

    saveUserData() {
        // Update in users list
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = this.currentUser;
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Update currentUser
        localStorage.setItem('currentUser', JSON.stringify({
            id: this.currentUser.id,
            email: this.currentUser.email,
            phone: this.currentUser.phone
        }));
    }

    updateSidebarAvatar() {
        // Update avatar in sidebar if it exists
        const sidebarAvatar = document.querySelector('.sidebar-user-avatar');
        if (sidebarAvatar && this.currentUser.avatar) {
            sidebarAvatar.innerHTML = `<img src="${this.currentUser.avatar}" alt="Avatar">`;
        }
    }

    updateSidebarInfo() {
        // Update company name in sidebar
        const sidebarName = document.querySelector('.sidebar-user-name');
        if (sidebarName) {
            sidebarName.textContent = this.currentUser.companyName || this.currentUser.fullName || 'Người dùng';
        }

        // Update email in sidebar
        const sidebarEmail = document.querySelector('.sidebar-user-email');
        if (sidebarEmail) {
            sidebarEmail.textContent = this.currentUser.email || this.currentUser.phone || '';
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'danger');
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.toast-notification');
        existing.forEach(n => n.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `toast-notification toast-${type}`;
        notification.innerHTML = `
            <div class="toast-content">
                <i class="bi ${type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill'} toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button type="button" class="toast-close" onclick="this.parentElement.remove()">
                <i class="bi bi-x"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
}

// Initialize
let settingsManager;
document.addEventListener('DOMContentLoaded', () => {
    settingsManager = new SettingsManager();
});
