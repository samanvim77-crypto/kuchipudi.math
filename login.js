// ══════════════════════════════════════════════════════════════
//  PASTE YOUR GOOGLE CLIENT ID HERE (same value as in login.html)
// ══════════════════════════════════════════════════════════════
const YOUR_GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';

// ── Tab Switching Logic ──────────────────────────────────────
function switchTab(tab) {
    const loginForm    = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs         = document.querySelectorAll('.tab-btn');

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

// ── Password Toggle Logic ────────────────────────────────────
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon  = input.nextElementSibling;

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ── Mock Google Sign-In Logic ─────────────────────────────────
function handleGoogleSignIn() {
    console.log("Google Sign-In successful! Redirecting…");
    sessionStorage.setItem('natyaAuth', 'true');
    window.location.href = 'experience.html';
}

// ── Mock Email/Password Auth (redirect same as Google flow) ──
function handleAuth(type) {
    if (type === 'register') {
        const pass        = document.getElementById('reg-pass').value;
        const confirmPass = document.getElementById('reg-confirm-pass').value;
        if (pass !== confirmPass) {
            alert('Passwords do not match!');
            return;
        }
    }
    console.log(`${type} successful! Redirecting…`);
    sessionStorage.setItem('natyaAuth', 'true');
    window.location.href = 'experience.html';
}

// ── Google Identity Services (GIS) Callback ──────────────────
//
//  Called automatically by GIS after the user picks an account.
//  `response.credential` is a signed JWT (ID token).
//
//  What you SHOULD do in production:
//    1. Send response.credential to your backend via fetch/axios.
//    2. Backend verifies the JWT with Google's public keys.
//    3. Backend creates a session / sets a cookie.
//    4. Backend returns success → frontend redirects.
//
//  For this demo we decode the JWT client-side just to log the
//  user's name, then redirect immediately.
//
function handleCredentialResponse(response) {
    try {
        // Decode the JWT payload (base64url → JSON).
        // This is NOT verification — verification must happen server-side.
        const base64Url = response.credential.split('.')[1];
        const base64    = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const userInfo = JSON.parse(jsonPayload);
        console.log('Google sign-in successful:', userInfo.name, userInfo.email);

        // ── TODO: send `response.credential` to your backend here ──
        // fetch('/api/auth/google', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ credential: response.credential })
        // }).then(res => res.json()).then(data => {
        //     if (data.success) window.location.href = 'experience.html';
        // });

        // Demo: redirect straight to experience page
        window.location.href = 'experience.html';

    } catch (err) {
        console.error('Failed to parse Google credential:', err);
        alert('Google Sign-In failed. Please try again.');
    }
}

// ── Hide "Loading Google Sign-In…" note once GIS renders ─────
//
//  GIS renders the button asynchronously. We poll for the iframe
//  that GIS injects and hide the loading note once it appears.
//
function waitForGSIButton() {
    const note = document.getElementById('gsiNote');
    if (!note) return;

    const observer = new MutationObserver(() => {
        const iframe = document.querySelector('.g_id_signin iframe');
        if (iframe) {
            note.style.display = 'none';
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Fallback: hide note after 4 s regardless
    setTimeout(() => {
        if (note) note.style.display = 'none';
    }, 4000);
}

// ── Particle Background ───────────────────────────────────────
function createParticles() {
    const container     = document.getElementById('particles');
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size     = Math.random() * 4 + 1;
        const left     = Math.random() * 100;
        const duration = Math.random() * 10 + 5;
        const delay    = Math.random() * 5;

        particle.style.width     = `${size}px`;
        particle.style.height    = `${size}px`;
        particle.style.left      = `${left}%`;
        particle.style.bottom    = '-10px';
        particle.style.animation = `floatParticle ${duration}s linear ${delay}s infinite`;

        container.appendChild(particle);
    }
}

// ── Initialise on load ────────────────────────────────────────
window.onload = () => {
    createParticles();
    waitForGSIButton();
};
