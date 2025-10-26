document.addEventListener('DOMContentLoaded', function() {

    // --- 1. GLOBAL INITIALIZATIONS & HELPERS ---
    gsap.registerPlugin(ScrollTrigger);

    // --- 2. HEADER & NAVIGATION ---
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let lastScrollTop = 0;

    // Smart Header: Hide on scroll down, show on scroll up
    if (header) {
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                // Scroll Down
                header.classList.add('header-hidden');
            } else {
                // Scroll Up
                header.classList.remove('header-hidden');
            }
            header.classList.toggle('scrolled', scrollTop > 50);
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });
    }
    
    // Mobile Navigation: Toggle menu and prevent body scroll
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent background scrolling
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- 3. GLOBAL SCROLL-TRIGGERED ANIMATIONS ---
    gsap.utils.toArray('.anim-group').forEach(group => {
        const anims = group.querySelectorAll('h1, h2, h3, h4, p, .cta-button, .logo-grid i, .service-card, .stat-card, .testimonial-card, .team-member, .faq-item, .process-step, .feature-card, .work-item, .blog-post-card, .view-all-work-btn, .service-image, .service-content > *, .service-features li, .industry-card, .filter-buttons, .portfolio-item, .pricing-card, .icon-item, .contact-wrapper > *, .step-item, .job-card, .no-openings');
        
        if (anims.length > 0) {
            gsap.from(anims, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.08,
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
                duration: 2.5,
                roundProps: "innerText",
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: el,
                    start: "top 90%",
                    toggleActions: "play none none none"
                }
            });
        });
    }

    // Portfolio Page: Enhanced Filter Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        const portfolioItems = gsap.utils.toArray('.portfolio-item');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filterValue = button.getAttribute('data-filter');
                
                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Animate items
                portfolioItems.forEach(item => {
                    const itemCategory = item.dataset.category;
                    const shouldShow = (filterValue === 'all' || itemCategory === filterValue);
                    
                    // Kill any running animations on the item to prevent conflicts
                    gsap.killTweensOf(item);

                    gsap.to(item, {
                        duration: 0.5,
                        opacity: shouldShow ? 1 : 0,
                        scale: shouldShow ? 1 : 0.95,
                        display: shouldShow ? 'block' : 'none',
                        ease: "expo.out",
                        delay: 0.1 // Small delay for staggering effect
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
            gsap.fromTo(item, 
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.5 + delay,
                    ease: "back.out(1.7)"
                }
            );
        });
    }

    // FAQ Accordion Logic (Shared)
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other items
                faqItems.forEach(i => {
                    if (i !== item && i.classList.contains('active')) {
                        i.classList.remove('active');
                        gsap.to(i.querySelector('.faq-answer'), { maxHeight: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
                    }
                });

                // Toggle the clicked item
                item.classList.toggle('active');
                if (item.classList.contains('active')) {
                    gsap.to(answer, { maxHeight: answer.scrollHeight + 'px', opacity: 1, duration: 0.7, ease: 'expo.out' });
                } else {
                    gsap.to(answer, { maxHeight: 0, opacity: 0, duration: 0.5, ease: 'power2.inOut' });
                }
            });
        });
    }
});
