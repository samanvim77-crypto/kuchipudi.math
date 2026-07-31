/**
 * fusionAnim.js
 * Interdisciplinary Cinematic Overlay Modal (70% Horizontal Visual, 30% Details Panel)
 */

function init() {
    console.log("fusionAnim.js: Initializing overlay modal system.");

    // DOM Elements
    const fusionModal = document.getElementById('fusionModal');
    const closeFusionModalBtn = document.getElementById('closeFusionModal');
    const fusionCanvas = document.getElementById('fusionCanvas');
    const fusionSvgOverlay = document.getElementById('fusionSvgOverlay');
    const fusionSubjectIcon = document.getElementById('fusionSubjectIcon');
    const fusionSubjectName = document.getElementById('fusionSubjectName');
    const fusionSubjectDesc = document.getElementById('fusionSubjectDesc');

    if (!fusionCanvas) return;

    const ctx = fusionCanvas.getContext('2d');
    let animationFrameId = null;
    let currentSubject = null;
    let particles = [];
    let startTimestamp = null;
    
    // Horizontal aspect ratio canvas viewport dimensions
    const canvasWidth = 700;
    const canvasHeight = 500;

    fusionCanvas.width = canvasWidth;
    fusionCanvas.height = canvasHeight;

    // Golden ambient particle class (currently kept empty/disabled per request)
    function initParticles() {
        particles = [];
    }

    // Main render loop
    function render(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Subject specific canvas render overlays
        drawSubjectCanvas(elapsed);

        animationFrameId = requestAnimationFrame(render);
    }

    // Dynamic Canvas Renderer (Volumetric light, gradients, diyas, etc.)
    function drawSubjectCanvas(elapsed) {
        const timeSec = elapsed / 1000;
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;

        if (currentSubject === 'History') {
            const sunriseProgress = Math.min(1, timeSec / 4.5);
            const radius = 100 + sunriseProgress * 280;
            const alpha = 0.28 * sunriseProgress;

            const grad = ctx.createRadialGradient(centerX, centerY - 80, 5, centerX, centerY - 80, radius);
            grad.addColorStop(0, `rgba(255, 140, 0, ${alpha})`);
            grad.addColorStop(0.5, `rgba(128, 0, 0, ${alpha * 0.3})`);
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        else if (currentSubject === 'Sanskrit') {
            const pulse = 0.05 + Math.sin(timeSec * 1.5) * 0.025;
            const grad = ctx.createRadialGradient(centerX, centerY, 20, centerX, centerY, 300);
            grad.addColorStop(0, `rgba(255, 215, 0, ${pulse})`);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
        else if (currentSubject === 'Biology') {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.035)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 4; i++) {
                ctx.beginPath();
                const offset = Math.cos(timeSec * 1.2 + i) * 15;
                ctx.arc(centerX, centerY, 130 + i * 28 + offset, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
        else if (currentSubject === 'Physics') {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.07)';
            ctx.lineWidth = 2.5;
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.scale(1, 0.32);
            ctx.rotate(timeSec * 0.8);
            
            ctx.beginPath();
            ctx.arc(0, 0, 160, 0, Math.PI * 2);
            ctx.stroke();

            const dotX = Math.cos(timeSec * 2) * 160;
            const dotY = Math.sin(timeSec * 2) * 160;
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
            ctx.beginPath();
            ctx.arc(dotX, dotY, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
        else if (currentSubject === 'Music') {
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.16)';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let x = 0; x < canvasWidth; x += 4) {
                const y = centerY + Math.sin(x * 0.025 - timeSec * 4) * 25 * Math.sin(timeSec * 1.5);
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        else if (currentSubject === 'Psychology') {
            const waveSpeed = 80;
            const maxRadius = 350;
            for (let i = 0; i < 3; i++) {
                const startDelay = i * 1.2;
                if (timeSec > startDelay) {
                    const radius = ((timeSec - startDelay) * waveSpeed) % maxRadius;
                    const alpha = Math.max(0, 1 - radius / maxRadius) * 0.22;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY - 30, radius, 0, Math.PI * 2);
                    ctx.strokeStyle = `rgba(255, 0, 120, ${alpha})`;
                    ctx.lineWidth = 2.5;
                    ctx.stroke();
                }
            }
        }
        else if (currentSubject === 'Spirituality') {
            const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
            const pulse = 0.08 + Math.sin(timeSec * 1.5) * 0.02;
            gradient.addColorStop(0, `rgba(255, 215, 0, ${pulse})`);
            gradient.addColorStop(0.6, `rgba(255, 180, 0, ${pulse * 0.3})`);
            gradient.addColorStop(1, 'rgba(0,0,0,0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(350, 0);
            ctx.lineTo(canvasWidth, canvasHeight - 100);
            ctx.lineTo(canvasWidth, canvasHeight);
            ctx.lineTo(0, canvasHeight);
            ctx.closePath();
            ctx.fill();

            // Flickering clay diyas at bottom
            drawDiyas(timeSec);
        }
    }

    function drawDiyas(timeSec) {
        const centerY = canvasHeight / 2;
        const diyas = [
            { x: 120, y: canvasHeight - 60, delay: 0 },
            { x: 350, y: canvasHeight - 50, delay: 2 },
            { x: 580, y: canvasHeight - 60, delay: 4 }
        ];

        diyas.forEach(d => {
            const flicker = Math.sin(timeSec * 18 + d.delay) * 2.2 + Math.cos(timeSec * 8) * 1.2;
            const flameHeight = 18 + flicker;

            ctx.fillStyle = '#8E4A23';
            ctx.beginPath();
            ctx.arc(d.x, d.y, 18, 0, Math.PI, false);
            ctx.closePath();
            ctx.fill();

            const flameGrad = ctx.createRadialGradient(d.x, d.y - 12, 1, d.x, d.y - 12, 20);
            flameGrad.addColorStop(0, 'rgba(255, 255, 220, 0.95)');
            flameGrad.addColorStop(0.35, 'rgba(255, 130, 0, 0.85)');
            flameGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = flameGrad;

            ctx.beginPath();
            ctx.moveTo(d.x - 9, d.y - 4);
            ctx.quadraticCurveTo(d.x - 9, d.y - 15, d.x, d.y - 4 - flameHeight);
            ctx.quadraticCurveTo(d.x + 9, d.y - 15, d.x + 9, d.y - 4);
            ctx.closePath();
            ctx.fill();
        });
    }

    // High Fidelity SVG Layout Choreographer
    function loadSvgAnimation(subject) {
        fusionSvgOverlay.innerHTML = '';
    }

    // Open subject modal overlay
    window.openFusionModal = function(subjectData) {
        console.log("openFusionModal triggered with data:", subjectData);
        currentSubject = subjectData.name;
        
        // Subject icon mapping
        const subjectIcons = {
            "History": "🗺️",
            "Sanskrit": "📜",
            "Biology": "🧬",
            "Physics": "⚛️",
            "Literature": "📖",
            "Music": "🎵",
            "Psychology": "🧠",
            "Spirituality": "✨",
            "Cultural Studies": "🏛️"
        };
        fusionSubjectIcon.textContent = subjectIcons[currentSubject] || '🎨';
        fusionSubjectName.textContent = `${currentSubject} in Kuchipudi`;
        
        // Load details directly into description panel
        fusionSubjectDesc.innerHTML = `
            <p>${subjectData.content}</p>
        `;

        // Load background image or canvas
        const bgImgElement = document.getElementById('fusionBgImage');
        if (bgImgElement) {
            const imgSubjects = ['History', 'Sanskrit', 'Biology', 'Physics', 'Literature', 'Music', 'Psychology', 'Spirituality', 'Cultural Studies'];
            if (imgSubjects.includes(currentSubject)) {
                const fileStem = currentSubject.toLowerCase().replace(/\s+/g, '_');
                bgImgElement.src = `images/${fileStem}_fusion.jpg`;
                bgImgElement.style.display = 'block';
                fusionCanvas.style.display = 'none';
            } else {
                bgImgElement.style.display = 'none';
                bgImgElement.src = '';
                fusionCanvas.style.display = 'block';
            }
        }

        // Reset canvas and SVG overlays
        initParticles();
        loadSvgAnimation(currentSubject);
        
        // Display modal
        fusionModal.style.display = 'flex';
        
        // Start animation loops
        startTimestamp = null;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
    };

    // Close subject modal overlay
    function closeFusionModal() {
        fusionModal.style.display = 'none';
        currentSubject = null;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        fusionSvgOverlay.innerHTML = '';
        const floatChars = document.querySelectorAll('.glowing-sanskrit-char');
        floatChars.forEach(fc => fc.remove());

        const bgImgElement = document.getElementById('fusionBgImage');
        if (bgImgElement) {
            bgImgElement.style.display = 'none';
            bgImgElement.src = '';
        }
        fusionCanvas.style.display = 'block';
    }

    // DOM Bindings
    closeFusionModalBtn.addEventListener('click', closeFusionModal);
    
    fusionModal.addEventListener('click', (e) => {
        if (e.target === fusionModal) closeFusionModal();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
