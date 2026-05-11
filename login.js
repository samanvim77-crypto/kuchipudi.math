// Tab Switching Logic
function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');

    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
        tabs[1].classList.remove('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[0].classList.remove('active');
        tabs[1].classList.add('active');
    }
}

// Password Toggle Logic
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Mock Authentication Logic
function handleAuth(type) {
    if (type === 'register') {
        const pass = document.getElementById('reg-pass').value;
        const confirmPass = document.getElementById('reg-confirm-pass').value;
        if (pass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }
    }
    // In a real app, you'd validate and call an API here.
    // For this demo, we'll just redirect to the experience page.
    console.log(`${type} successful! Redirecting...`);
    window.location.href = 'experience.html';
}

// Particle Background Logic
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 4 + 1;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.bottom = `-10px`;
        particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(particle);
    }
}

// Initialize particles on load
window.onload = createParticles;
