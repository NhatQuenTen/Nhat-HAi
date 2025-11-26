/**
 * Trang Chủ - Modern Interactive Features
 * Back to Top, Support Chat, Form Validation, Smooth Animations
 */

$(document).ready(function() {
    
    // ==================== SMOOTH SCROLLING ====================
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutCubic');
        }
    });

    // ==================== BACK TO TOP BUTTON ====================
    const backToTopBtn = $('#backToTop');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            backToTopBtn.addClass('show');
        } else {
            backToTopBtn.removeClass('show');
        }

        // Navbar shadow on scroll
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm');
        } else {
            $('.navbar').removeClass('shadow-sm');
        }
    });

    backToTopBtn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ 
            scrollTop: 0 
        }, 800, 'easeInOutCubic');
    });

    // ==================== SUPPORT CHAT TOGGLE ====================
    const supportBtn = $('#supportBtn');
    const supportChatBox = $('#supportChatBox');
    const closeChatBtn = $('#closeChatBtn');

    supportBtn.on('click', function(e) {
        e.stopPropagation();
        supportChatBox.toggleClass('active');
    });

    closeChatBtn.on('click', function(e) {
        e.stopPropagation();
        supportChatBox.removeClass('active');
    });

    // Click outside to close chat
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.support-chat-box, .support-btn').length) {
            supportChatBox.removeClass('active');
        }
    });

    // ==================== FORM VALIDATION ====================
    $('#consultForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $(this).find('input[type="text"]').val().trim();
        const email = $(this).find('input[type="email"]').val().trim();
        const phone = $(this).find('input[type="tel"]').val().trim();
        const need = $(this).find('select').val();

        // Validation
        if (!name || !email || !phone || need === 'Chọn nhu cầu') {
            showToast('Vui lòng điền đầy đủ thông tin!', 'error');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast('Email không hợp lệ!', 'error');
            return false;
        }

        // Phone validation (10-11 digits)
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(phone)) {
            showToast('Số điện thoại không hợp lệ! (10-11 chữ số)', 'error');
            return false;
        }

        // Success
        showToast('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
        $(this)[0].reset();
        
        // Optional: Send data to server
        // $.ajax({ ... });
    });

    // ==================== TOAST NOTIFICATION ====================
    function showToast(message, type = 'info') {
        const toast = $(`
            <div class="custom-toast toast-${type}">
                <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}"></i>
                <span>${message}</span>
            </div>
        `);
        
        // Add CSS if not exists
        if (!$('style[data-toast-styles]').length) {
            $('head').append(`
                <style data-toast-styles>
                    .custom-toast {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 1rem 1.5rem;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                        display: flex;
                        align-items: center;
                        gap: 0.75rem;
                        z-index: 10000;
                        animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        font-weight: 500;
                    }
                    .toast-success {
                        border-left: 4px solid #22C55E;
                        color: #16A34A;
                    }
                    .toast-success i {
                        color: #22C55E;
                        font-size: 1.5rem;
                    }
                    .toast-error {
                        border-left: 4px solid #EF4444;
                        color: #DC2626;
                    }
                    .toast-error i {
                        color: #EF4444;
                        font-size: 1.5rem;
                    }
                    @keyframes slideInRight {
                        from {
                            transform: translateX(400px);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                </style>
            `);
        }
        
        $('body').append(toast);
        
        setTimeout(() => {
            toast.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // ==================== CAROUSEL AUTO PLAY ====================
    const testimonialCarousel = $('#testimonialsCarousel');
    if (testimonialCarousel.length) {
        testimonialCarousel.carousel({
            interval: 5000,
            pause: 'hover'
        });
    }

    // ==================== ANIMATE ON SCROLL ====================
    const animateOnScroll = function() {
        $('.feature-card, .service-card, .blog-item, .client-logo').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('animate-in');
            }
        });
    };

    // Trigger on load and scroll
    $(window).on('scroll', animateOnScroll);
    animateOnScroll();

    // ==================== PARALLAX EFFECT ====================
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        $('.hero-section::before').css('transform', 'translateY(' + (scrolled * 0.5) + 'px)');
    });

    // ==================== CLIENT LOGOS GRAYSCALE EFFECT ====================
    $('.client-logo').hover(
        function() {
            $(this).find('img').css('filter', 'grayscale(0%)');
        },
        function() {
            $(this).find('img').css('filter', 'grayscale(100%)');
        }
    );

    // ==================== FEATURE CARD CLICK ====================
    $('.blog-item').on('click', function() {
        const title = $(this).find('h6').text();
        showToast(`Đang mở: ${title}`, 'info');
        // Navigate to blog detail page
        // window.location.href = 'blog-detail.html';
    });

    // ==================== SUPPORT REQUEST ====================
    $('.chat-body button').on('click', function() {
        showToast('Yêu cầu đã được gửi! CSKH sẽ liên hệ lại trong ít phút.', 'success');
        supportChatBox.removeClass('active');
    });

    // ==================== ADD EASING FUNCTION ====================
    $.easing.easeInOutCubic = function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return c/2*t*t*t + b;
        return c/2*((t-=2)*t*t + 2) + b;
    };

    // ==================== LOADING ANIMATION ====================
    $(window).on('load', function() {
        $('body').addClass('loaded');
        $('.feature-card, .service-card').each(function(index) {
            $(this).css('animation-delay', (index * 0.1) + 's');
        });
    });

    // ==================== CONSOLE LOG ====================
    console.log('%c🚀 Tìm Việc Nhanh - Website tuyển dụng hiện đại', 
        'color: #2176FF; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Developed with ❤️ by Nhóm 6', 
        'color: #64748B; font-size: 14px;');
});
