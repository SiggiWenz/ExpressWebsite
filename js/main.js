/**
 * IMC Express - Main JavaScript
 * Handles interactivity and animations
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavigation();
    initScrollAnimations();
    initFormHandling();
    initSmoothScroll();
    initROIAnimation();
    initRotatingHeadline();
});

/**
 * Mobile Navigation Toggle
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

/**
 * Scroll Animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .testimonial-card, .case-study-card, .pricing-card, .benefit-item, .step-card'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

/**
 * Form Handling
 */
function initFormHandling() {
    const demoForm = document.getElementById('demoForm');

    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(demoForm);
            const data = Object.fromEntries(formData);

            // Validate form
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            const submitBtn = demoForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Wird gesendet...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(function() {
                // Show success message
                showNotification('Vielen Dank! Wir melden uns innerhalb von 24 Stunden bei Ihnen.', 'success');

                // Reset form
                demoForm.reset();

                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
}

/**
 * Form Validation
 */
function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Bitte geben Sie Ihren Namen ein.');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
    }

    if (!data.company || data.company.trim() === '') {
        errors.push('Bitte geben Sie Ihr Unternehmen ein.');
    }

    if (!data.privacy) {
        errors.push('Bitte stimmen Sie der Datenschutzerklärung zu.');
    }

    if (errors.length > 0) {
        showNotification(errors[0], 'error');
        return false;
    }

    return true;
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show Notification
 */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px'
    });

    // Add animation keyframes
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }

    document.body.appendChild(notification);

    // Close button handler
    notification.querySelector('.notification-close').addEventListener('click', function() {
        closeNotification(notification);
    });

    // Auto-close after 5 seconds
    setTimeout(function() {
        closeNotification(notification);
    }, 5000);
}

/**
 * Close Notification
 */
function closeNotification(notification) {
    if (notification) {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            notification.remove();
        }, 300);
    }
}

/**
 * Smooth Scroll for Anchor Links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ROI Bar Animation
 */
function initROIAnimation() {
    const roiCard = document.querySelector('.roi-card');

    if (roiCard) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fills = roiCard.querySelectorAll('.roi-fill');
                    fills.forEach(fill => {
                        const targetWidth = fill.style.width;
                        fill.style.width = '0';
                        setTimeout(function() {
                            fill.style.width = targetWidth;
                        }, 200);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(roiCard);
    }
}

/**
 * Counter Animation for Statistics
 */
function animateCounter(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }

    updateCounter();
}

/**
 * Lazy Load Images (if needed)
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

/**
 * Rotating Headline Animation
 * Shows 5 different headlines that rotate with a timer
 */
function initRotatingHeadline() {
    const headlineElement = document.getElementById('rotating-headline');

    if (!headlineElement) return;

    const headlines = [
        'KI-gestützte Automatisierung',
        'Intelligente Content-Erstellung',
        'E-Learning auf Knopfdruck',
        'Automatisierte Kurserstellung',
        'Smart Learning Design'
    ];

    let currentIndex = 0;

    // Set initial headline randomly on page load
    currentIndex = Math.floor(Math.random() * headlines.length);
    headlineElement.textContent = headlines[currentIndex];
    headlineElement.classList.add('headline-animate');

    // Rotate headlines every 4 seconds
    setInterval(function() {
        // Fade out
        headlineElement.classList.add('headline-fade-out');

        setTimeout(function() {
            // Change text
            currentIndex = (currentIndex + 1) % headlines.length;
            headlineElement.textContent = headlines[currentIndex];

            // Fade in
            headlineElement.classList.remove('headline-fade-out');
            headlineElement.classList.add('headline-fade-in');

            setTimeout(function() {
                headlineElement.classList.remove('headline-fade-in');
            }, 500);
        }, 500);
    }, 4000);
}
