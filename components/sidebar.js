/**
 * Sidebar Management System - Enhanced Version
 * Handles sidebar state, active menu, collapse/expand, mobile responsive
 * With smooth animations and enhanced user experience
 */

class SidebarManager {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.toggleBtn = null;
        this.mobileBtn = null;
        this.mainContent = null;
        this.isCollapsed = false;
        this.isMobile = window.innerWidth < 992;
        
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Get elements
        this.sidebar = document.getElementById('sidebar');
        this.overlay = document.getElementById('sidebarOverlay');
        this.toggleBtn = document.getElementById('sidebarToggle');
        this.mobileBtn = document.getElementById('mobileMenuBtn');
        this.mainContent = document.getElementById('mainContent');

        if (!this.sidebar) {
            console.error('Sidebar element not found');
            return;
        }

        // Load saved state
        this.loadState();

        // Set active menu based on current page
        this.setActiveMenu();

        // Update user info in sidebar footer
        this.updateUserInfo();

        // Bind events
        this.bindEvents();

        // Bind user menu events
        this.bindUserMenuEvents();

        // Check mobile on resize
        this.handleResize();

        // Add entrance animation
        this.addEntranceAnimation();
    }

    bindEvents() {
        // Desktop toggle
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Mobile toggle
        if (this.mobileBtn) {
            this.mobileBtn.addEventListener('click', () => this.toggleMobile());
        }

        // Overlay click
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeMobile());
        }

        // Window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.handleResize(), 150);
        });

        // Menu links click
        const menuLinks = this.sidebar.querySelectorAll('.sidebar-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add ripple effect
                this.createRipple(e, link);
                
                if (this.isMobile) {
                    setTimeout(() => this.closeMobile(), 300);
                }
            });

            // Add hover sound effect (optional)
            link.addEventListener('mouseenter', () => {
                link.style.setProperty('--hover-scale', '1');
            });
        });

        // User profile click
        const userProfile = this.sidebar.querySelector('.sidebar-user');
        if (userProfile) {
            userProfile.addEventListener('click', () => {
                this.showUserMenu();
            });
        }
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('collapsed');
            if (this.mainContent) {
                this.mainContent.classList.add('collapsed');
            }
        } else {
            this.sidebar.classList.remove('collapsed');
            if (this.mainContent) {
                this.mainContent.classList.remove('collapsed');
            }
        }

        // Save state
        this.saveState();

        // Trigger custom event
        window.dispatchEvent(new CustomEvent('sidebarToggle', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    toggleMobile() {
        const isOpen = this.sidebar.classList.toggle('mobile-open');
        this.overlay.classList.toggle('active');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        // Animate mobile button
        if (this.mobileBtn) {
            const icon = this.mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('bi-list');
                icon.classList.toggle('bi-x-lg');
            }
        }
    }

    closeMobile() {
        this.sidebar.classList.remove('mobile-open');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';

        // Reset mobile button icon
        if (this.mobileBtn) {
            const icon = this.mobileBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('bi-x-lg');
                icon.classList.add('bi-list');
            }
        }
    }

    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth < 992;

        // If switching from mobile to desktop
        if (wasMobile && !this.isMobile) {
            this.closeMobile();
            this.sidebar.classList.remove('mobile-open');
        }

        // If switching from desktop to mobile
        if (!wasMobile && this.isMobile) {
            this.sidebar.classList.remove('collapsed');
            if (this.mainContent) {
                this.mainContent.classList.remove('collapsed');
            }
        }
    }

    setActiveMenu() {
        // Get current page filename
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Remove all active classes
        const allLinks = this.sidebar.querySelectorAll('.sidebar-link');
        allLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Find and set active link with animation
        allLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href === currentPage || currentPage.includes(href))) {
                link.classList.add('active');
                // Scroll into view if needed
                setTimeout(() => {
                    link.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
        });

        // Alternative: Use data-route attribute
        const route = this.getCurrentRoute();
        if (route) {
            const routeLink = this.sidebar.querySelector(`[data-route="${route}"]`);
            if (routeLink) {
                routeLink.classList.add('active');
            }
        }
    }

    getCurrentRoute() {
        const page = window.location.pathname.split('/').pop();
        const routeMap = {
            'index.html': 'index',
            'Trang-quản-lí-đăng-tin.html': 'dang-tin',
            'TimUngVien.html': 'tim-ung-vien',
            'Trang-quan-ly-dang-tin.html': 'dang-tin'
        };
        return routeMap[page] || null;
    }

    createRipple(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 0;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    addEntranceAnimation() {
        // Add staggered animation to menu items
        const menuItems = this.sidebar.querySelectorAll('.sidebar-menu-item');
        menuItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.05}s`;
        });
    }

    showUserMenu() {
        // You can implement a dropdown menu here
        console.log('User menu clicked');
        // Example: Show a modal or dropdown with user options
    }

    bindUserMenuEvents() {
        const sidebarUser = this.sidebar.querySelector('#sidebarUser');
        const userMenu = this.sidebar.querySelector('#sidebarUserMenu');
        const logoutBtn = this.sidebar.querySelector('#logoutBtn');

        if (!sidebarUser || !userMenu) return;

        // Toggle user menu on click
        sidebarUser.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
            
            // Update chevron direction
            const chevron = sidebarUser.querySelector('.sidebar-user-dropdown i');
            if (chevron) {
                if (userMenu.classList.contains('show')) {
                    chevron.classList.remove('bi-chevron-up');
                    chevron.classList.add('bi-chevron-down');
                } else {
                    chevron.classList.remove('bi-chevron-down');
                    chevron.classList.add('bi-chevron-up');
                }
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (userMenu && !sidebarUser.contains(e.target)) {
                userMenu.classList.remove('show');
                const chevron = sidebarUser.querySelector('.sidebar-user-dropdown i');
                if (chevron) {
                    chevron.classList.remove('bi-chevron-down');
                    chevron.classList.add('bi-chevron-up');
                }
            }
        });

        // Handle logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }
    }

    handleLogout() {
        // Show confirmation
        if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // Clear current user session
            localStorage.removeItem('currentUser');
            
            // Show notification
            this.showLogoutNotification();
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'DangNhap.html';
            }, 1000);
        }
    }

    showLogoutNotification() {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'logout-toast';
        toast.innerHTML = `
            <i class="bi bi-check-circle-fill"></i>
            <span>Đăng xuất thành công!</span>
        `;
        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    updateUserInfo() {
        // Get current user from localStorage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;

        // Get full user data
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userData = users.find(u => u.id === currentUser.id);
        if (!userData) return;

        // Update avatar
        const avatarElement = this.sidebar.querySelector('.sidebar-user-avatar');
        if (avatarElement) {
            if (userData.avatar) {
                avatarElement.innerHTML = `<img src="${userData.avatar}" alt="Avatar">`;
            } else {
                avatarElement.innerHTML = '<i class="bi bi-person-circle"></i>';
            }
        }

        // Update name
        const nameElement = this.sidebar.querySelector('.sidebar-user-name');
        if (nameElement) {
            nameElement.textContent = userData.companyName || userData.fullName || 'Người dùng';
        }

        // Update email
        const emailElement = this.sidebar.querySelector('.sidebar-user-email');
        if (emailElement) {
            emailElement.textContent = userData.email || userData.phone || '';
        }
    }

    saveState() {
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);
    }

    loadState() {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved === 'true' && !this.isMobile) {
            this.isCollapsed = true;
            this.sidebar.classList.add('collapsed');
            if (this.mainContent) {
                this.mainContent.classList.add('collapsed');
            }
        }
    }
}

// Add ripple animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Auto-initialize when script loads
const sidebarManager = new SidebarManager();

// Export for manual control if needed
window.SidebarManager = SidebarManager;
window.sidebarManager = sidebarManager;
