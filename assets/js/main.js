document.addEventListener('DOMContentLoaded', function() {

    // --- 1. GLOBAL INITIALIZATIONS & HELPERS ---
    
    // Initialize Particles.js
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 }},
                "color": { "value": "#8A2BE2" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 0.8, "opacity_min": 0.1, "sync": false }},
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1.2, "direction": "none", "random": true, "straight": false, "out_mode": "out" }
            },
            "interactivity": { "detect_on": "canvas" },
            "retina_detect": true
        });
    }

    // Initialize Floating Dots Background (used on some pages)
    if (document.getElementById('floatingDots')) {
        const container = document.getElementById('floatingDots');
        const dotCount = 30;
        for (let i = 0; i < dotCount; i++) {
            const dot = document.createElement('div');
            dot.classList.add('floating-dot');
            const size = Math.random() * 3.5 + 2;
            dot.style.width = `${size}px`;
            dot.style.height = `${size}px`;
            dot.style.left = `${Math.random() * 100}%`;
            dot.style.top = `${Math.random() * 100}%`;
            if (i % 2 === 0) {
                 dot.style.background = 'rgba(164, 94, 255, 0.5)';
                 dot.style.animationDuration = (Math.random() * 20 + 25) + 's';
            } else {
                 dot.style.background = 'rgba(255, 255, 255, 0.7)';
                 dot.style.animationDuration = (Math.random() * 20 + 30) + 's';
            }
            container.appendChild(dot);
        }
    }

    // GSAP Plugin Registration
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. HEADER & NAVIGATION ---
    
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (header) {
        // Make header appear on scroll up, hide on scroll down
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 50) {
                header.classList.remove('scrolled-up');
                header.classList.remove('scrolled-down');
            } else if (currentScroll > lastScroll && !header.classList.contains('scrolled-down')) {
                header.classList.add('scrolled-down');
                header.classList.remove('scrolled-up');
            } else if (currentScroll < lastScroll && header.classList.contains('scrolled-down')) {
                header.classList.add('scrolled-up');
                header.classList.remove('scrolled-down');
            }
            lastScroll = currentScroll;
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            // Toggle body scroll
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 3. GLOBAL SCROLL-TRIGGERED ANIMATIONS ---
    // UPDATED: Tuned for a faster, smoother, more dynamic feel with creative effects.

    gsap.utils.toArray('.anim-group').forEach(group => {
        const anims = group.querySelectorAll('h1, h2, h3, h4, p, .cta-button, .logo-grid i, .service-card, .stat-card, .testimonial-card, .team-member, .faq-item, .process-step, .feature-card, .work-item, .blog-post-card, .view-all-work-btn, .service-image, .service-content > *, .service-features li, .industry-card, .filter-buttons, .portfolio-item, .pricing-card, .icon-item, .contact-wrapper > *, .step-item, .job-card, .no-openings');
        
        if (anims.length > 0) {
            gsap.from(anims, {
                y: 60,
                opacity: 0,
                skewY: 5,
                duration: 1,     
                ease: "expo.out",
                stagger: 0.1,
                scrollTrigger: {
                    trigger: group,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            });
        }
    });

    // --- 4. PAGE-SPECIFIC LOGIC ---

    // Home Page: Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        statNumbers.forEach(el => {
            gsap.to(el, {
                innerText: +el.dataset.target,
                duration: 3,
                roundProps: "innerText",
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // Portfolio Page: Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    const shouldShow = (filterValue === 'all' || itemCategory === filterValue);

                     gsap.to(item, {
                         duration: 0.6,
                         opacity: shouldShow ? 1 : 0,
                         scale: shouldShow ? 1 : 0.9,
                         y: shouldShow ? 0 : 20,
                         ease: "expo.out",
                         onStart: () => { if(shouldShow) item.style.display = 'block'; },
                         onComplete: () => { if(!shouldShow) item.style.display = 'none'; }
                     });
                });
            });
        });
    }
    
    // Pricing Page: Card Selection & Hero Icons Animation
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        pricingCards.forEach(card => {
            card.addEventListener('click', () => {
                pricingCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
            });
        });

        const iconItems = document.querySelectorAll('.icon-item');
        iconItems.forEach(item => {
            const delay = parseFloat(item.getAttribute('data-delay')) || 0;
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.5 + delay,
                ease: "back.out(1.7)"
            });
        });
    }

    // FAQ Accordion Logic (Shared)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other active items
                faqItems.forEach(i => {
                    if (i.classList.contains('active') && i !== item) {
                        i.classList.remove('active');
                    }
                });

                // Toggle the clicked item
                item.classList.toggle('active');
            });
        });
    }
});
