// Load navbar vào trang
async function loadNavbar() {
    try {
        const response = await fetch('navbar.html');
        const html = await response.text();
        
        // Tạo container cho navbar
        const navbarContainer = document.createElement('div');
        navbarContainer.id = 'navbar-container';
        navbarContainer.innerHTML = html;
        
        // Chèn vào đầu body
        document.body.insertBefore(navbarContainer, document.body.firstChild);
        
        // Đánh dấu trang hiện tại active
        setActiveNavLink();
        
        // Khởi tạo các event handlers
        initNavbarEvents();
        
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

// Đánh dấu link active theo trang hiện tại
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Khởi tạo event handlers cho navbar
function initNavbarEvents() {
    // Kiểm tra trạng thái đăng nhập
    checkUserLoginStatus();
    
    // Event cho nút employer - Chuyển đến trang đăng nhập
    const employerBtn = document.querySelector('.btn-nav-employer');
    if (employerBtn) {
        employerBtn.addEventListener('click', function() {
            window.location.href = 'DangNhap.html';
        });
    }

    // Event cho nút jobseeker
    const jobseekerBtn = document.querySelector('.btn-nav-jobseeker');
    if (jobseekerBtn) {
        jobseekerBtn.addEventListener('click', function() {
            alert('Chuyển hướng đến trang người tìm việc.');
        });
    }
    
    // User menu dropdown toggle
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userDropdownMenu = document.getElementById('userDropdownMenu');
    
    if (userMenuTrigger && userDropdownMenu) {
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdownMenu.classList.toggle('show');
        });
        
        // Đóng dropdown khi click bên ngoài
        document.addEventListener('click', function() {
            userDropdownMenu.classList.remove('show');
        });
        
        userDropdownMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                localStorage.removeItem('currentUser');
                window.location.reload();
            }
        });
    }

    // Hover cho dropdown (desktop)
    if (window.innerWidth > 992) {
        const dropdowns = document.querySelectorAll('.navbar .dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.add('show');
            });
            dropdown.addEventListener('mouseleave', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
            });
        });
    }
}

// Kiểm tra và hiển thị user menu nếu đã đăng nhập
function checkUserLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const guestButtons = document.getElementById('guestButtons');
    
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            
            // Hiển thị user menu, ẩn guest buttons
            if (userMenuContainer) userMenuContainer.style.display = 'block';
            if (guestButtons) guestButtons.style.display = 'none';
            
            // Lấy thông tin đầy đủ từ users array
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userData = users.find(u => u.id === user.id) || user;
            
            // Cập nhật avatar ở menu trigger (chỉ cái avatar nhỏ)
            const userAvatar = document.querySelector('.user-avatar');
            if (userData.avatar) {
                if (userAvatar) userAvatar.innerHTML = `<img src="${userData.avatar}" alt="Avatar">`;
            } else {
                if (userAvatar) userAvatar.innerHTML = '<i class="bi bi-person-circle"></i>';
            }
            
            // Cập nhật thông tin user
            const userName = document.getElementById('userName');
            const userFullName = document.getElementById('userFullName');
            const userEmail = document.getElementById('userEmail');
            
            // Lấy tên từ email nếu không có fullName
            const displayName = userData.fullName || userData.email.split('@')[0];
            
            if (userName) userName.textContent = displayName;
            if (userFullName) userFullName.textContent = displayName;
            if (userEmail) userEmail.textContent = userData.email;
            
        } catch (e) {
            console.error('Error parsing user data:', e);
            // Nếu lỗi, hiển thị guest buttons
            if (userMenuContainer) userMenuContainer.style.display = 'none';
            if (guestButtons) guestButtons.style.display = 'flex';
        }
    } else {
        // Chưa đăng nhập, hiển thị guest buttons
        if (userMenuContainer) userMenuContainer.style.display = 'none';
        if (guestButtons) guestButtons.style.display = 'flex';
    }
}

// Load navbar khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
