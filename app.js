// Meghana's Portfolio - JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Loading Screen
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000);
    });

    // Navigation Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                let offsetTop;
                
                // Special case for home section to scroll to the very top
                if (targetId === 'home') {
                    offsetTop = 0;
                } else {
                    offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                }
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effects
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active navigation link
        updateActiveNavLink();
        
        // Show/hide back to top button
        toggleBackToTopButton();
    });

    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTopButton() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Skill Bar Animation
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillSection = document.getElementById('skills');

    function animateSkillBars() {
        const skillSectionTop = skillSection.offsetTop;
        const skillSectionHeight = skillSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight;

        if (scrollPosition >= skillSectionTop + 100) {
            skillBars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            });
            // Remove event listener after animation to prevent re-triggering
            window.removeEventListener('scroll', animateSkillBars);
        }
    }

    window.addEventListener('scroll', animateSkillBars);

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        // Simple form validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
        }, 2000);
    });

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4CAF50, #45a049)' : 'linear-gradient(135deg, #f44336, #da190b)'};
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        notification.querySelector('.notification-content').style.cssText = `
            display: flex;
            align-items: center;
            gap: 0.5rem;
        `;

        notification.querySelector('.notification-close').style.cssText = `
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            margin-left: auto;
            padding: 0.2rem;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            closeNotification(notification);
        });

        // Auto close after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                closeNotification(notification);
            }
        }, 5000);
    }

    function closeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .leadership-card, .highlight, .tech-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Add CSS for animations
    const animationCSS = `
        .timeline-item,
        .project-card,
        .leadership-card,
        .highlight,
        .tech-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }

        .timeline-item.animate,
        .project-card.animate,
        .leadership-card.animate,
        .highlight.animate,
        .tech-item.animate {
            opacity: 1;
            transform: translateY(0);
        }

        .timeline-item:nth-child(2).animate {
            transition-delay: 0.1s;
        }

        .timeline-item:nth-child(3).animate {
            transition-delay: 0.2s;
        }

        .project-card:nth-child(2).animate {
            transition-delay: 0.2s;
        }

        .project-card:nth-child(3).animate {
            transition-delay: 0.4s;
        }

        .leadership-card:nth-child(2).animate {
            transition-delay: 0.2s;
        }

        .leadership-card:nth-child(3).animate {
            transition-delay: 0.4s;
        }

        .highlight:nth-child(2).animate {
            transition-delay: 0.1s;
        }

        .highlight:nth-child(3).animate {
            transition-delay: 0.2s;
        }
    `;

    // Add animation styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationCSS;
    document.head.appendChild(styleSheet);

    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        heroTitle.innerHTML = 'Hi, I\'m <span class="gradient-text"></span>';
        
        const gradientSpan = heroTitle.querySelector('.gradient-text');
        const nameText = 'Meghana HJ';
        let i = 0;

        function typeWriter() {
            if (i < nameText.length) {
                gradientSpan.textContent += nameText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }

        // Start typing animation after loader is hidden
        setTimeout(typeWriter, 1500);
    }

    // Add hover effect to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (hero && scrolled < hero.offsetHeight) {
            heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add click effect to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes
    const rippleCSS = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    
    const rippleStyleSheet = document.createElement('style');
    rippleStyleSheet.textContent = rippleCSS;
    document.head.appendChild(rippleStyleSheet);

    // Stats counter animation
    const statsNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.hero-stats');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            statsAnimated = true;
            
            statsNumbers.forEach(stat => {
                const finalValue = stat.textContent;
                const numericValue = parseFloat(finalValue);
                const isDecimal = finalValue.includes('.');
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        if (isDecimal) {
                            stat.textContent = currentValue.toFixed(1);
                        } else {
                            stat.textContent = Math.floor(currentValue) + '+';
                        }
                    }
                }, 50);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    // Add custom cursor effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .leadership-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            document.body.style.cursor = 'pointer';
        });
        
        element.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });
    });

    // Easter egg - Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Activate secret pink rain effect
            createPinkRain();
        }
    });

    function createPinkRain() {
        const colors = ['#FF69B4', '#FFB6C1', '#FFC0CB', '#E91E63', '#F48FB1'];
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.innerHTML = '💖';
                heart.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}vw;
                    font-size: ${Math.random() * 20 + 10}px;
                    animation: fall ${Math.random() * 3 + 2}s linear forwards;
                    pointer-events: none;
                    z-index: 10000;
                `;
                
                document.body.appendChild(heart);
                
                setTimeout(() => heart.remove(), 5000);
            }, i * 100);
        }
        
        // Add fall animation if it doesn't exist
        if (!document.querySelector('#fall-animation')) {
            const fallCSS = `
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            
            const fallStyleSheet = document.createElement('style');
            fallStyleSheet.id = 'fall-animation';
            fallStyleSheet.textContent = fallCSS;
            document.head.appendChild(fallStyleSheet);
        }
        
        showNotification('💖 You found the secret pink magic! 💖', 'success');
    }

    console.log('🌸 Welcome to Meghana\'s Portfolio! 🌸');
    console.log('💖 Built with love and lots of pink! 💖');
    console.log('🚀 Try the Konami code for a surprise! 🚀');
});