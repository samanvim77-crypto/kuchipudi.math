/**
 * mathAnim.js
 * 40-second looping canvas animation of mathematical graphics
 * over the Kuchipudi classical dancer image.
 */

(function () {
    const canvas = document.getElementById('mathCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const LOOP = 40000; // 40 seconds in ms

    // ── Colours ──────────────────────────────────────────────
    const NEON_BLUE   = 'rgba(80, 180, 255, ';
    const NEON_GOLD   = 'rgba(255, 210, 60, ';
    const NEON_CYAN   = 'rgba(0, 230, 200, ';
    const NEON_WHITE  = 'rgba(255, 255, 255, ';

    // ── Resize canvas to its CSS size ────────────────────────
    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('load', resize);

    // Also resize when the background video loads/starts playing to sync layouts perfectly
    const bgVideo = document.querySelector('.dancer-canvas-wrap video');
    if (bgVideo) {
        bgVideo.addEventListener('loadedmetadata', resize);
        bgVideo.addEventListener('play', resize);
    }

    // ── Utility helpers ──────────────────────────────────────
    const W = () => canvas.width;
    const H = () => canvas.height;

    /** Linear interpolation */
    const lerp = (a, b, t) => a + (b - a) * t;

    /** Clamp 0‥1 */
    const clamp01 = t => Math.max(0, Math.min(1, t));

    /** Ease in/out cubic */
    const easeIO = t => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;

    /**
     * Envelope: given current time `t` (0‥1 of the segment),
     * fade in over `fi`, sustain, fade out over `fo`.
     */
    function envelope(t, fi = 0.12, fo = 0.12) {
        if (t < fi)  return easeIO(t / fi);
        if (t > 1 - fo) return easeIO((1 - t) / fo);
        return 1;
    }

    /** Glow text helper */
    function glowText(text, x, y, color, alpha, size = 16, blur = 18) {
        ctx.save();
        ctx.shadowColor = color + '1)';
        ctx.shadowBlur  = blur;
        ctx.fillStyle   = color + alpha + ')';
        ctx.font        = `bold ${size}px "Courier New", monospace`;
        ctx.fillText(text, x, y);
        ctx.restore();
    }

    /** Draw a glowing line segment */
    function glowLine(x1, y1, x2, y2, color, alpha, width = 1.5, blur = 12) {
        ctx.save();
        ctx.shadowColor   = color + '1)';
        ctx.shadowBlur    = blur;
        ctx.strokeStyle   = color + alpha + ')';
        ctx.lineWidth     = width;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
    }

    /** Draw a partial arc (progress 0‥1) */
    function glowArc(cx, cy, r, startA, endA, color, alpha, width = 1.5, prog = 1) {
        ctx.save();
        ctx.shadowColor = color + '1)';
        ctx.shadowBlur  = 16;
        ctx.strokeStyle = color + alpha + ')';
        ctx.lineWidth   = width;
        ctx.beginPath();
        const delta = endA - startA;
        ctx.arc(cx, cy, r, startA, startA + delta * prog, false);
        ctx.stroke();
        ctx.restore();
    }

    // ══════════════════════════════════════════════════════════
    //  SEGMENT DRAW FUNCTIONS  (each receives phase 0‥1)
    // ══════════════════════════════════════════════════════════

    /**
     * 1 – Coordinate grid fades in from centre
     *   (  0 s →  6 s )
     */
    function drawGrid(ph) {
        const a  = envelope(ph) * 0.35;
        const cx = W() * 0.5, cy = H() * 0.5;
        const step = Math.min(W(), H()) * 0.08;
        const cols = Math.ceil(W() / step) + 2;
        const rows = Math.ceil(H() / step) + 2;

        ctx.save();
        ctx.shadowColor = NEON_BLUE + '0.8)';
        ctx.shadowBlur  = 8;
        ctx.strokeStyle = NEON_BLUE + a + ')';
        ctx.lineWidth   = 0.8;

        for (let i = -cols; i <= cols; i++) {
            const x = cx + i * step;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H()); ctx.stroke();
        }
        for (let j = -rows; j <= rows; j++) {
            const y = cy + j * step;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W(), y); ctx.stroke();
        }

        // Axes – brighter
        ctx.strokeStyle = NEON_BLUE + (a * 2.5) + ')';
        ctx.lineWidth   = 1.5;
        ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W(), cy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H()); ctx.stroke();

        // Axis labels
        if (a > 0.1) {
            glowText('x', W() - 18, cy - 10, NEON_BLUE, a * 2.5, 14, 10);
            glowText('y', cx + 8,   18,       NEON_BLUE, a * 2.5, 14, 10);
        }
        ctx.restore();
    }

    /**
     * 2 – Equation labels float around dancer
     *   (  4 s → 12 s )
     */
    const EQ_LABELS = [
        { text: 'sin θ',        rx: 0.15, ry: 0.30 },
        { text: 'cos θ',        rx: 0.75, ry: 0.28 },
        { text: 'f(x) = ax²',   rx: 0.12, ry: 0.65 },
        { text: 'πr²',          rx: 0.78, ry: 0.60 },
        { text: '∑ n = n(n+1)/2',rx: 0.20, ry: 0.82 },
        { text: 'Δ = b²−4ac',   rx: 0.62, ry: 0.80 },
        { text: '∞',            rx: 0.50, ry: 0.14 },
        { text: 'θ = 45°',      rx: 0.70, ry: 0.42 },
    ];

    function drawEquations(ph) {
        const a = envelope(ph);
        EQ_LABELS.forEach((eq, i) => {
            const delay = i / EQ_LABELS.length;
            const localPh = clamp01((ph - delay * 0.3) / 0.7);
            if (localPh <= 0) return;
            const alpha = envelope(localPh) * a * 0.95;
            const floatY = Math.sin(Date.now() * 0.001 + i * 1.2) * 6;
            const x = W() * eq.rx;
            const y = H() * eq.ry + floatY;
            glowText(eq.text, x, y, NEON_GOLD, alpha, 15, 20);
        });
    }

    /**
     * 3 – Expanding circles (spins → circular equations)
     *   (  8 s → 16 s )
     */
    function drawCircles(ph) {
        const a   = envelope(ph);
        const cx  = W() * 0.5;
        const cy  = H() * 0.42;
        const max = Math.min(W(), H()) * 0.44;

        for (let k = 0; k < 4; k++) {
            const tOff   = k * 0.18;
            const localT = clamp01((ph - tOff) / (1 - tOff));
            const r      = localT * max * (0.3 + k * 0.22);
            const alpha  = a * (1 - localT * 0.6) * 0.7;
            const color  = k % 2 === 0 ? NEON_BLUE : NEON_GOLD;
            glowArc(cx, cy, r, 0, Math.PI * 2, color, alpha, 1.2 + k * 0.3);

            // radius label
            if (alpha > 0.2 && r > 20) {
                glowText(`r=${Math.round(r)}`, cx + r * 0.72, cy - r * 0.72, color, alpha * 0.9, 12, 10);
            }
        }

        // Circle equation label
        if (a > 0.5) {
            glowText('x² + y² = r²', cx - 55, cy + max * 0.55, NEON_WHITE, a * 0.9, 16, 22);
        }
    }

    /**
     * 4 – Symmetry / reflection lines + angle arc
     *  ( 14 s → 22 s )
     */
    function drawSymmetry(ph) {
        const a  = envelope(ph);
        const cx = W() * 0.50;
        const cy = H() * 0.45;

        // Vertical axis of symmetry
        glowLine(cx, H() * 0.05, cx, H() * 0.92, NEON_CYAN, a * 0.8, 1.5, 18);

        // Mirror lines at 45° and 135°
        const len = Math.min(W(), H()) * 0.45;
        glowLine(cx - len * 0.7, cy - len * 0.7, cx + len * 0.7, cy + len * 0.7, NEON_BLUE, a * 0.55, 1.2, 12);
        glowLine(cx + len * 0.7, cy - len * 0.7, cx - len * 0.7, cy + len * 0.7, NEON_GOLD, a * 0.55, 1.2, 12);

        // Angle arc
        const prog = clamp01(ph * 3);
        glowArc(cx, cy, 60, -Math.PI / 2, 0, NEON_GOLD, a * 0.9, 2, prog);
        if (a > 0.5) glowText('90°', cx + 16, cy - 16, NEON_GOLD, a * 0.9, 14, 12);

        // Label
        glowText('Line of Symmetry', cx + 8, H() * 0.10, NEON_CYAN, a * 0.9, 13, 14);
    }

    /**
     * 5 – Parabola trace (jump → glowing parabola)
     *  ( 20 s → 28 s )
     */
    function drawParabola(ph) {
        const a   = envelope(ph);
        const cx  = W() * 0.5;
        const cy  = H() * 0.78;
        const sw  = W() * 0.45;
        const sh  = H() * 0.38;
        const seg = Math.floor(ph * 120); // draw progressively

        ctx.save();
        ctx.shadowColor = NEON_GOLD + '1)';
        ctx.shadowBlur  = 20;
        ctx.strokeStyle = NEON_GOLD + a * 0.9 + ')';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        for (let i = 0; i <= seg && i <= 120; i++) {
            const t = (i / 120) * 2 - 1;         // -1 → 1
            const x = cx + t * sw;
            const y = cy - (1 - t * t) * sh;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Vertex dot
        if (ph > 0.1) {
            ctx.save();
            ctx.fillStyle = NEON_GOLD + a + ')';
            ctx.shadowColor = NEON_GOLD + '1)';
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(cx, cy - sh, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Equation
        if (a > 0.4) glowText('y = ax²  (Parabola)', cx - 70, cy - sh - 20, NEON_GOLD, a * 0.95, 14, 18);
    }

    /**
     * 6 – Sine / cosine wave (rhythm of beats)
     *  ( 25 s → 33 s )
     */
    function drawWave(ph) {
        const a    = envelope(ph);
        const midY = H() * 0.5;
        const amp  = H() * 0.14;
        const freq = (Math.PI * 2) / (W() * 0.3);
        const shift = Date.now() * 0.002; // animate phase

        // Sine wave
        ctx.save();
        ctx.shadowColor = NEON_BLUE + '1)';
        ctx.shadowBlur  = 16;
        ctx.strokeStyle = NEON_BLUE + a * 0.85 + ')';
        ctx.lineWidth   = 2;
        ctx.beginPath();
        for (let x = 0; x <= W(); x += 2) {
            const y = midY + Math.sin(x * freq + shift) * amp;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Cosine wave (gold, offset)
        ctx.shadowColor = NEON_GOLD + '1)';
        ctx.strokeStyle = NEON_GOLD + a * 0.7 + ')';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        for (let x = 0; x <= W(); x += 2) {
            const y = midY + Math.cos(x * freq + shift) * amp;
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        if (a > 0.5) {
            glowText('y = sin(θ)', 14, midY - amp - 12, NEON_BLUE, a * 0.9, 14, 14);
            glowText('y = cos(θ)', 14, midY + amp + 22, NEON_GOLD, a * 0.9, 14, 14);
        }
    }

    /**
     * 7 – Fibonacci / golden spiral
     *  ( 31 s → 38 s )
     */
    function drawSpiral(ph) {
        const a  = envelope(ph);
        const cx = W() * 0.5;
        const cy = H() * 0.45;

        ctx.save();
        ctx.shadowColor = NEON_CYAN + '1)';
        ctx.shadowBlur  = 20;
        ctx.strokeStyle = NEON_CYAN + a * 0.85 + ')';
        ctx.lineWidth   = 1.8;
        ctx.beginPath();
        const maxTurns = 3.5 * ph;
        for (let i = 0; i <= 600 * ph; i++) {
            const angle = (i / 600) * Math.PI * 2 * maxTurns;
            const r     = (i / 600) * Math.min(W(), H()) * 0.38;
            const x     = cx + Math.cos(angle) * r;
            const y     = cy + Math.sin(angle) * r;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        if (a > 0.5) glowText('φ = (1+√5)/2', cx - 60, cy + H() * 0.38, NEON_CYAN, a * 0.9, 14, 16);
    }

    // ══════════════════════════════════════════════════════════
    //  ALWAYS-ON: floating sparkle particles
    // ══════════════════════════════════════════════════════════
    const SPARKS = Array.from({ length: 28 }, (_, i) => ({
        x: Math.random(),
        y: Math.random(),
        r: 1 + Math.random() * 2.5,
        speed: 0.00012 + Math.random() * 0.00018,
        phase: Math.random() * Math.PI * 2,
        color: i % 3 === 0 ? NEON_GOLD : i % 3 === 1 ? NEON_BLUE : NEON_CYAN,
    }));

    function drawSparks(now) {
        SPARKS.forEach(s => {
            const t = (now * s.speed + s.phase) % (Math.PI * 2);
            const y = (s.y + now * s.speed * 0.04) % 1;
            const x = s.x + Math.sin(t) * 0.025;
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(t));

            ctx.save();
            ctx.shadowColor = s.color + '1)';
            ctx.shadowBlur  = 12;
            ctx.fillStyle   = s.color + alpha + ')';
            ctx.beginPath();
            ctx.arc(x * W(), y * H(), s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    // ══════════════════════════════════════════════════════════
    //  TIMELINE  —  maps seconds → segments
    // ══════════════════════════════════════════════════════════
    const TIMELINE = [
        // [startMs, endMs, drawFn]
        [    0, 7000, drawGrid      ],
        [ 4000,13000, drawEquations ],
        [ 8000,17000, drawCircles   ],
        [14000,23000, drawSymmetry  ],
        [20000,29000, drawParabola  ],
        [25000,34000, drawWave      ],
        [31000,40000, drawSpiral    ],
        // Overlap: grid reappears toward end
        [35000,40000, drawGrid      ],
        // Equations always linger
        [36000,40000, drawEquations ],
    ];

    // ══════════════════════════════════════════════════════════
    //  MAIN RENDER LOOP
    // ══════════════════════════════════════════════════════════
    let startTime = null;

    function render(ts) {
        if (!startTime) startTime = ts;
        const elapsed = (ts - startTime) % LOOP;   // 0 → 40000 ms, looping

        ctx.clearRect(0, 0, W(), H());

        // Draw timeline segments
        TIMELINE.forEach(([s, e, fn]) => {
            if (elapsed >= s && elapsed <= e) {
                const ph = (elapsed - s) / (e - s);
                fn(ph);
            }
        });

        // Sparks run always
        drawSparks(elapsed);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
})();
