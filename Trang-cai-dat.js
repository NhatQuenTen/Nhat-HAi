document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const userEmailEl = document.getElementById('userEmail');
    const passwordDisplayEl = document.getElementById('passwordDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    const changeForm = document.getElementById('changePasswordForm');
    const toggleBtn = document.getElementById('togglePasswordBtn');

    let isShown = false; // trạng thái hiện/ẩn mật khẩu

    // Lấy currentUser từ localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userData = users.find(u => u.id === currentUser.id);

        if (userData) {
            userEmailEl.textContent = userData.email || userData.phone || 'Không có dữ liệu';
            passwordDisplayEl.textContent = '*'.repeat(userData.password.length);

            // Toggle hiển thị mật khẩu
            if (toggleBtn) {
                toggleBtn.addEventListener('click', function() {
                    if (isShown) {
                        passwordDisplayEl.textContent = '*'.repeat(userData.password.length);
                        toggleBtn.textContent = 'Hiện';
                        isShown = false;
                    } else {
                        passwordDisplayEl.textContent = userData.password;
                        toggleBtn.textContent = 'Ẩn';
                        isShown = true;
                    }
                });
            }
        } else {
            userEmailEl.textContent = 'Không tìm thấy người dùng';
            passwordDisplayEl.textContent = '********';
        }
    } else {
        userEmailEl.textContent = 'Chưa đăng nhập';
        passwordDisplayEl.textContent = '********';
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            alert('Đăng xuất thành công!');
            window.location.href = 'DangNhap.html';
        });
    }

    // Đổi mật khẩu
    if (changeForm && currentUser) {
        changeForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const oldPass = document.getElementById('oldPassword').value;
            const newPass = document.getElementById('newPassword').value;
            const confirmPass = document.getElementById('confirmPassword').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userData = users.find(u => u.id === currentUser.id);

            if (!userData) {
                alert('Tài khoản không tồn tại!');
                return;
            }

            if (oldPass !== userData.password) {
                alert('Mật khẩu cũ không đúng!');
                return;
            }

            if (newPass.length < 6) {
                alert('Mật khẩu mới phải từ 6 ký tự trở lên!');
                return;
            }

            if (newPass !== confirmPass) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }

            // Cập nhật mật khẩu
            userData.password = newPass;
            localStorage.setItem('users', JSON.stringify(users));

            // Cập nhật currentUser (không cần lưu mật khẩu thật)
            currentUser.password = newPass;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Cập nhật hiển thị
            passwordDisplayEl.textContent = isShown ? newPass : '*'.repeat(newPass.length);

            alert('Đổi mật khẩu thành công!');
            changeForm.reset();
        });
    }
});
