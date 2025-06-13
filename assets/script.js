document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const blurContainer = document.querySelector('.blur-container');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let spotlightRadius = 100;
    let isMouseMoving = false;
    let mouseMoveTimeout;
    
    // Set light mode as default
    document.documentElement.setAttribute('data-theme', 'light');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Function to toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Reset spotlight when switching to light mode
        if (newTheme === 'light') {
            spotlightRadius = 100;
            document.documentElement.style.setProperty('--spotlight-radius', `${spotlightRadius}px`);
        }
    }
    
    // Toggle dark mode on button click
    darkModeToggle.addEventListener('click', toggleTheme);

    // Toggle dark mode on 'D' key press
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
            toggleTheme();
        }
    });

    // Handle mouse movement for spotlight effect
    document.addEventListener('mousemove', (e) => {
        // Only apply spotlight effect in dark mode
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMouseMoving = true;
            
            // Update spotlight position
            document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
            
            // Increase spotlight radius while moving
            spotlightRadius = Math.min(spotlightRadius + 1, 150);
            document.documentElement.style.setProperty('--spotlight-radius', `${spotlightRadius}px`);
            
            // Clear previous timeout
            clearTimeout(mouseMoveTimeout);
            
            // Set timeout to decrease radius when mouse stops moving
            mouseMoveTimeout = setTimeout(() => {
                isMouseMoving = false;
                const decreaseRadius = () => {
                    if (!isMouseMoving && spotlightRadius > 100) {
                        spotlightRadius = Math.max(spotlightRadius - 1, 100);
                        document.documentElement.style.setProperty('--spotlight-radius', `${spotlightRadius}px`);
                        requestAnimationFrame(decreaseRadius);
                    }
                };
                decreaseRadius();
            }, 100);
        }
    });

    // Reset spotlight when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            spotlightRadius = 100;
            document.documentElement.style.setProperty('--spotlight-radius', `${spotlightRadius}px`);
        }
    });

    // Smooth scrolling for navigation clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000; // 1 second for navigation clicks
                let start = null;

                function easeInOutCubic(t) {
                    return t < 0.5
                        ? 4 * t * t * t
                        : 1 - Math.pow(-2 * t + 2, 3) / 2;
                }

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    const ease = easeInOutCubic(progress);
                    const finalPosition = startPosition + (distance * ease);

                    window.scrollTo({
                        top: finalPosition,
                        behavior: 'auto'
                    });

                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    } else {
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'auto'
                        });
                    }
                }

                requestAnimationFrame(animation);
            }
        });
    });

    // Scroll highlight functionality
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
            } else {
                document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);
    window.addEventListener('load', highlightNavLink);
}); 