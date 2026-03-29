// app.js

// GSAP Smooth Animations
gsap.registerPlugin(ScrollTrigger);

// Smooth scroll animation
gsap.to("body", { 
    scrollTrigger: {
        trigger: "#content",
        start: "top top",
        scrub: true,
    },
    duration: 2,
    ease: "power2.inOut",
});

// Button Interactions
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.1, duration: 0.3 });
    });
    button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.3 });
    });
});

// Form Validation
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
    const email = form.querySelector('input[type="email"]').value;
    if (!validateEmail(email)) {
        event.preventDefault();
        alert('Please enter a valid email address.');
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
}

// Theme Toggle
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Modal Management
const openModalButtons = document.querySelectorAll("[data-modal]");
const closeModalButtons = document.querySelectorAll(".close-modal");

openModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modal);
        modal.classList.add('open');
    });
});

closeModalButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('open');
    });
});

// Performance Monitoring
if (window.performance) {
    window.onload = () => {
        const performanceData = window.performance;
        console.log("Performance Data:", performanceData);
    };
}