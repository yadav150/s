/* ============================================================
   script.js — Personal Portfolio Website
   Author: Yadav Subba
   Description: All interactivity — hamburger menu, scroll effects,
   animations, counters, typing, form validation, and more.
   ============================================================ */

(function() {
    'use strict';

    // ============================================================
    // 1. DOM REFERENCES
    // ============================================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progress-bar');
    const scrollTopBtn = document.getElementById('scroll-top');
    const typedTitle = document.getElementById('typed-title');
    const cursor = document.getElementById('cursor');
    const currentYearSpan = document.getElementById('current-year');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    // ============================================================
    // 2. TYPING EFFECT
    // ============================================================
    const titles = ['Web Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Creative Coder'];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 120;

    function typeEffect() {
        const currentTitle = titles[titleIndex];
        if (isDeleting) {
            // Remove character
            typedTitle.textContent = currentTitle.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 60;
        } else {
            // Add character
            typedTitle.textContent = currentTitle.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 120;
        }

        // If completed typing a word
        if (!isDeleting && charIndex === currentTitle.length) {
            typingSpeed = 2000; // pause before deleting
            isDeleting = true;
        }
        // If deleted completely
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            titleIndex = (titleIndex + 1) % titles.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Start typing when page loads
    window.addEventListener('load', () => {
        setTimeout(typeEffect, 500);
    });

    // ============================================================
    // 3. HAMBURGER MENU
    // ============================================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
        hamburger.setAttribute('aria-expanded', expanded);
    });

    // Close menu on link click (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ============================================================
    // 4. STICKY NAVBAR + ACTIVE LINK HIGHLIGHT + SCROLL PROGRESS
    // ============================================================
    const sections = document.querySelectorAll('section[id]');

    function updateNavAndProgress() {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollY / docHeight) * 100;
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';

        // Sticky navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });

        // Scroll-to-top button visibility
        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateNavAndProgress);
    window.addEventListener('load', updateNavAndProgress);

    // ============================================================
    // 5. SMOOTH SCROLLING (for anchor links)
    // ============================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================================
    // 6. SCROLL-TO-TOP BUTTON
    // ============================================================
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================================
    // 7. INTERSECTION OBSERVER — FADE ANIMATIONS
    // ============================================================
    const fadeElements = document.querySelectorAll('.fade-element');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const fadeType = el.getAttribute('data-fade') || 'up';
                el.classList.add('fade-' + fadeType);
                // Add a small delay if data-delay is present
                const delay = parseInt(el.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    el.classList.add('visible');
                }, delay);
                fadeObserver.unobserve(el);
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(el => fadeObserver.observe(el));

    // ============================================================
    // 8. ANIMATED COUNTERS (Stat numbers)
    // ============================================================
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (isNaN(target)) return;
                let current = 0;
                const increment = Math.ceil(target / 60); // smooth animation over ~60 frames
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        el.textContent = target;
                        clearInterval(timer);
                    } else {
                        el.textContent = current;
                    }
                }, 20);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ============================================================
    // 9. CONTACT FORM VALIDATION
    // ============================================================
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const messageInput = document.getElementById('form-message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, errorEl) {
        input.classList.add('error');
        errorEl.classList.add('visible');
    }

    function clearError(input, errorEl) {
        input.classList.remove('error');
        errorEl.classList.remove('visible');
    }

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;

        // Name
        const name = nameInput.value.trim();
        if (name === '') {
            showError(nameInput, nameError);
            isValid = false;
        } else {
            clearError(nameInput, nameError);
        }

        // Email
        const email = emailInput.value.trim();
        if (email === '' || !validateEmail(email)) {
            showError(emailInput, emailError);
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Message
        const message = messageInput.value.trim();
        if (message === '') {
            showError(messageInput, messageError);
            isValid = false;
        } else {
            clearError(messageInput, messageError);
        }

        if (isValid) {
            // Simulate sending
            formSuccess.classList.remove('hidden');
            contactForm.reset();
            // Hide success after 5 seconds
            setTimeout(() => {
                formSuccess.classList.add('hidden');
            }, 5000);
        }
    });

    // Clear errors on input
    [nameInput, emailInput, messageInput].forEach((input, index) => {
        input.addEventListener('input', function() {
            const errorEls = [nameError, emailError, messageError];
            if (this.value.trim() !== '') {
                clearError(this, errorEls[index]);
            }
        });
    });

    // ============================================================
    // 10. CURRENT YEAR IN FOOTER
    // ============================================================
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

})(); // end IIFE
