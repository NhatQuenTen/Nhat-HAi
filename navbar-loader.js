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

// Load navbar khi DOM sẵn sàng
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}
