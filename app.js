/**
 * AxsenWebsite AI - Main Application Logic
 * Modern, Responsive, and Interactive
 */

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initAnimations();
    initMobileMenu();
    initFormHandling();
    initTheme();
    initModals();
    initPWA();
});

// --- Animations ---
function initAnimations() {
    // Hero Section Animations
    gsap.from(".hero-content > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });

    // Scroll Animations for Cards
    gsap.utils.toArray('.glass-card, .ai-tool-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // Floating Animation for Hero Image/Element
    if (document.querySelector('.floating')) {
        gsap.to(".floating", {
            y: -20,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}

// --- Mobile Menu ---
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = menuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });

        // Close menu on link click
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = menuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }
}

// --- Form Handling ---
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const submitSpinner = document.getElementById('submitSpinner');
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                // Success - Redirect to thank you page or show success message
                localStorage.setItem('lastSubmission', JSON.stringify(data));
                window.location.href = 'thank-you.html';
            } else {
                throw new Error(result.error || 'Errore durante l\'invio');
            }
        } catch (error) {
            console.error('Form Error:', error);
            alert('Si è verificato un errore: ' + error.message);
        } finally {
            // Reset loading state
            submitBtn.disabled = false;
            submitText.classList.remove('hidden');
            submitSpinner.classList.add('hidden');
        }
    });
}

// --- Theme Management ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Animation for toggle icon
        gsap.to(themeToggle, { rotate: 360, duration: 0.5, clearProps: "rotate" });
    });
}

// --- Modal Management ---
function initModals() {
    window.showModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            gsap.from(modal.querySelector('.modal-content'), {
                scale: 0.8,
                opacity: 0,
                duration: 0.3,
                ease: "back.out(1.7)"
            });
        }
    };

    window.closeModal = function(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
}

// --- PWA Support ---
function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed', err));
        });
    }

    // Cookie Banner
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner && !localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }

    window.acceptCookies = function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('active');
    };

    window.rejectCookies = function() {
        localStorage.setItem('cookiesAccepted', 'false');
        cookieBanner.classList.remove('active');
    };
}

// --- Lead Score Calculation ---
window.calculateScore = function() {
    const budget = document.getElementById('budget')?.value;
    const message = document.getElementById('message')?.value;
    const scoreElement = document.getElementById('leadScore');
    
    if (!scoreElement) return;

    let score = 0;
    if (budget) score += 40;
    if (message && message.length > 50) score += 40;
    if (message && message.length > 150) score += 20;

    let label = "Bassa";
    let colorClass = "score-low";

    if (score >= 80) {
        label = "Alta";
        colorClass = "score-high";
    } else if (score >= 40) {
        label = "Media";
        colorClass = "score-medium";
    }

    scoreElement.className = `lead-score ${colorClass}`;
    scoreElement.innerHTML = `<i class="fas fa-chart-pie mr-2"></i>Qualità: ${label}`;
};
