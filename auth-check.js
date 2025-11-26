/**
 * Authentication Check Middleware
 * Kiểm tra người dùng đã đăng nhập chưa
 * Redirect về trang đăng nhập nếu chưa
 */

(function() {
    'use strict';
    
    // Các trang yêu cầu đăng nhập
    const protectedPages = [
        'Trang-Quan-Li-dang-tin.html',
        'Trang-Dang-Tin-Tuyen-Dung.html',
        'TimUngVien.html',
        'HoSoDaUngTuyen.html',
        'HoSoDaLuu.html',
        'Trang-cai-dat.html'
    ];
    
    // Lấy tên file hiện tại
    const currentPage = window.location.pathname.split('/').pop();
    
    // Kiểm tra xem trang hiện tại có cần đăng nhập không
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage) {
        // Kiểm tra trạng thái đăng nhập
        const currentUser = localStorage.getItem('currentUser');
        
        if (!currentUser) {
            // Chưa đăng nhập, lưu URL hiện tại để redirect về sau khi đăng nhập
            sessionStorage.setItem('redirectUrl', window.location.href);
            
            // Hiển thị thông báo
            alert('Vui lòng đăng nhập để tiếp tục!');
            
            // Redirect về trang đăng nhập
            window.location.href = 'DangNhap.html';
        } else {
            // Đã đăng nhập, parse user data
            try {
                const user = JSON.parse(currentUser);
                console.log('Người dùng đã đăng nhập:', user.email);
                
                // Lấy thông tin đầy đủ từ users array nếu currentUser chỉ có thông tin cơ bản
                if (!user.accountType) {
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const fullUser = users.find(u => u.id === user.id);
                    if (fullUser) {
                        // Kiểm tra loại tài khoản
                        if (fullUser.accountType !== 'employer') {
                            alert('Chỉ tài khoản nhà tuyển dụng mới có thể truy cập trang này!');
                            window.location.href = 'index.html';
                        }
                    } else {
                        // User không tồn tại trong database
                        localStorage.removeItem('currentUser');
                        alert('Phiên đăng nhập không hợp lệ!');
                        window.location.href = 'DangNhap.html';
                    }
                } else {
                    // currentUser đã có accountType
                    if (user.accountType !== 'employer') {
                        alert('Chỉ tài khoản nhà tuyển dụng mới có thể truy cập trang này!');
                        window.location.href = 'index.html';
                    }
                }
            } catch (e) {
                // Dữ liệu currentUser không hợp lệ
                localStorage.removeItem('currentUser');
                window.location.href = 'DangNhap.html';
            }
        }
    }
    
    // Helper function để lấy thông tin user hiện tại
    window.getCurrentUser = function() {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return null;
        
        try {
            return JSON.parse(currentUser);
        } catch (e) {
            return null;
        }
    };
    
    // Helper function để lấy userId hiện tại
    window.getCurrentUserId = function() {
        const user = window.getCurrentUser();
        return user ? user.id : null;
    };
    
    // Helper function để logout
    window.logout = function() {
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'DangNhap.html';
        }
    };
    
})();
