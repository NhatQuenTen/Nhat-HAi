$(document).ready(function() {
    
    // Smooth Scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000);
        }
    });

    // Back to Top Button
    const backToTopBtn = $('#backToTop');
    
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            backToTopBtn.addClass('show');
        } else {
            backToTopBtn.removeClass('show');
        }

        // Change navbar background on scroll
        if ($(this).scrollTop() > 50) {
            $('.navbar').addClass('shadow-sm');
        } else {
            $('.navbar').removeClass('shadow-sm');
        }
    });

    backToTopBtn.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 800);
    });

    // Support Chat Toggle
    const supportBtn = $('#supportBtn');
    const supportChatBox = $('#supportChatBox');
    const closeChatBtn = $('#closeChatBtn');

    supportBtn.on('click', function() {
        supportChatBox.toggleClass('show');
        $(this).toggleClass('d-none');
    });

    closeChatBtn.on('click', function() {
        supportChatBox.removeClass('show');
        supportBtn.removeClass('d-none');
    });

    // Click outside chat box to close
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.support-chat-box, .support-btn').length) {
            supportChatBox.removeClass('show');
            supportBtn.removeClass('d-none');
        }
    });

    // Form Validation
    $('#consultForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $(this).find('input[type="text"]').val();
        const email = $(this).find('input[type="email"]').val();
        const phone = $(this).find('input[type="tel"]').val();
        const need = $(this).find('select').val();

        if (!name || !email || !phone || need === 'Chọn nhu cầu') {
            alert('Vui lòng điền đầy đủ thông tin!');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Email không hợp lệ!');
            return false;
        }

        // Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert('Số điện thoại không hợp lệ!');
            return false;
        }

        // Success message
        alert('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        $(this)[0].reset();
    });

    // Animate elements on scroll
    const animateOnScroll = function() {
        $('.feature-card, .service-card, .blog-item').each(function() {
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                $(this).addClass('fade-in');
            }
        });
    };

    $(window).on('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // Blog item click handler
    $('.blog-item').on('click', function() {
        const title = $(this).find('h6').text();
        alert('Đang mở bài viết: ' + title);
    });

    // Client logo hover effect
    $('.client-logo').hover(
        function() {
            $(this).find('img').css('transform', 'scale(1.1)');
        },
        function() {
            $(this).find('img').css('transform', 'scale(1)');
        }
    );

    // Navbar dropdown hover (for desktop)
    if ($(window).width() > 992) {
        $('.navbar .dropdown').hover(
            function() {
                $(this).find('.dropdown-menu').stop(true, true).fadeIn(200);
            },
            function() {
                $(this).find('.dropdown-menu').stop(true, true).fadeOut(200);
            }
        );
    }

    // Add ripple effect to buttons
    $('.btn').on('click', function(e) {
        const ripple = $('<span class="ripple"></span>');
        const btnOffset = $(this).offset();
        const xPos = e.pageX - btnOffset.left;
        const yPos = e.pageY - btnOffset.top;

        ripple.css({
            top: yPos + 'px',
            left: xPos + 'px'
        });

        $(this).append(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // Counter animation for statistics (if you add them later)
    $.fn.countTo = function(options) {
        return this.each(function() {
            const $this = $(this);
            const countTo = parseInt($this.attr('data-count'));
            
            $({ countNum: $this.text() }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function() {
                    $this.text(this.countNum);
                }
            });
        });
    };

    // Initialize tooltips (Bootstrap 5)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Console log for debugging
    console.log('Tìm Việc Nhanh - Website initialized successfully!');

    // New navigation buttons handlers
    $('.navbar .btn-nav-employer').on('click', function() {
        alert('Chức năng đăng ký/đăng nhập cho nhà tuyển dụng sẽ được triển khai.');
        // window.location.href = 'dang-ky-dang-nhap.html';
    });

    $('.navbar .btn-nav-jobseeker').on('click', function() {
        alert('Chuyển hướng đến trang người tìm việc.');
        // window.location.href = 'nguoi-tim-viec.html';
    });
});

// Add CSS for ripple effect dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
