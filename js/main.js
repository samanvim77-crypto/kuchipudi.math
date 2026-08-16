document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('homeBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const homePage = document.getElementById('homePage');
    const contentPage = document.getElementById('contentPage');
    const contentArea = document.getElementById('contentArea');
    const navItemsHome = document.querySelectorAll('#navListHome li');

    // Go Home Button
    homeBtn.addEventListener('click', () => {
        contentPage.style.display = 'none';
        homePage.style.display = 'flex';
        homeBtn.style.display = 'none';
        const breadcrumbNav = document.getElementById('breadcrumbNav');
        if (breadcrumbNav) breadcrumbNav.style.display = 'none';
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.style.display = 'block';
    });

    // Video Crossfade for smooth looping
    const bgVideo = document.getElementById('bgVideo');
    if (bgVideo && bgVideo.tagName === 'VIDEO') {
        bgVideo.addEventListener('timeupdate', () => {
            const fadeDuration = 0.5; // seconds
            const timeLeft = bgVideo.duration - bgVideo.currentTime;
            
            // Fade out at the end, fade in at the beginning
            if (timeLeft < fadeDuration) {
                bgVideo.style.opacity = Math.max(0, timeLeft / fadeDuration);
            } else if (bgVideo.currentTime < fadeDuration) {
                bgVideo.style.opacity = Math.min(1, bgVideo.currentTime / fadeDuration);
            } else {
                bgVideo.style.opacity = 1;
            }
        });
    }

    // Logout Functionality
    window.logout = function() {
        sessionStorage.removeItem('natyaAuth');
        window.location.replace('login.html');
    };

    // Navigation from Home SideBar
    navItemsHome.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.target;
            loadSection(target);
        });
    });

    // Modal Elements
    const mathModal = document.getElementById('mathModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalMudraImg = document.getElementById('modalMudraImg');
    const modalMudraName = document.getElementById('modalMudraName');
    const modalMudraPlacement = document.getElementById('modalMudraPlacement');
    const modalMathContent = document.getElementById('modalMathContent');
    const animationOverlay = document.getElementById('animationOverlay');

    const breadcrumbNav = document.getElementById('breadcrumbNav');
    
    // Build an array of sections for next/prev navigation
    const sections = Array.from(navItemsHome).map(item => ({
        target: item.dataset.target,
        title: item.textContent.replace(/^\d+\.\s*/, '') // Remove numbering for cleaner UI
    }));

    // Section Content Generator
    function loadSection(target) {
        // Hide home page, show content page
        homePage.style.display = 'none';
        contentPage.style.display = 'block';
        homeBtn.style.display = 'block';
        if (breadcrumbNav) breadcrumbNav.style.display = 'flex';
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.style.display = 'none';

        // Update Breadcrumb
        const currentSection = sections.find(s => s.target === target);
        if (breadcrumbNav && currentSection) {
            breadcrumbNav.innerHTML = `<span>Home</span> &gt; ${currentSection.title}`;
        }

        contentArea.style.opacity = 0;
        setTimeout(() => {
            // Get section content and append Next/Prev buttons
            contentArea.innerHTML = getHTMLForSection(target) + getNavigationButtons(target);
            contentPage.scrollTop = 0;
            contentArea.style.opacity = 1;
            
            // Re-attach mudra card listeners (Only for Math sections 4 and 5)
            if (target === 'math-asamyutha' || target === 'math-samyutha') {
                const mudraCards = contentArea.querySelectorAll('.mudra-card');
                mudraCards.forEach(card => {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', (e) => {
                        if (e.target.classList.contains('pronounce-btn')) return;
                        const name = card.querySelector('h3').textContent;
                        const mudra = [...asamyuthaHastas, ...samyuthaHastas].find(m => m.name === name);
                        if (mudra) openMudraModal(mudra);
                    });
                });
            } else if (target === 'equations') {
                // Attach equation card listeners for Section 7: The Dancing Equations
                const eqCards = contentArea.querySelectorAll('.equation-card');
                console.log(`[Dancing Equations] Found ${eqCards.length} equation cards to bind.`);
                eqCards.forEach((card, index) => {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        const titleEl = card.querySelector('h3');
                        if (!titleEl) {
                            console.error(`[Dancing Equations] Card at index ${index} lacks an h3 element.`);
                            return;
                        }
                        const title = titleEl.textContent.trim();
                        console.log(`[Dancing Equations] Card clicked: "${title}"`);
                        const eq = dancingEquations.find(e => e.title.toLowerCase() === title.toLowerCase());
                        if (eq) {
                            console.log(`[Dancing Equations] Matching metadata found. Opening modal...`);
                            openEquationModal(eq);
                        } else {
                            console.error(`[Dancing Equations] No matching metadata found for title: "${title}"`);
                        }
                    });
                });
            } else {
                // For non-math sections, make cards non-clickable
                const mudraCards = contentArea.querySelectorAll('.mudra-card');
                mudraCards.forEach(card => {
                    card.style.cursor = 'default';
                });
            }

            // Section 8 Subject Card Click Listeners (Animations)
            if (target === 'fusion') {
                console.log("Binding card click listeners for Section 8 fusion subjects...");
                const statusText = document.getElementById('fusion-status-text');
                if (statusText) {
                    if (typeof window.openFusionModal === 'function') {
                        statusText.textContent = "Click on each card to show interactive animation...";
                        statusText.style.color = "var(--gold)";
                        statusText.style.textShadow = "0 0 8px var(--gold)";
                    } else {
                        statusText.textContent = "Error: window.openFusionModal not found!";
                        statusText.style.color = "#ff4d4d";
                        statusText.style.textShadow = "0 0 8px #ff4d4d";
                    }
                }
                const subjectCards = contentArea.querySelectorAll('.subject-card');
                console.log(`Found ${subjectCards.length} cards.`);
                subjectCards.forEach(card => {
                    card.style.cursor = 'pointer';
                    card.addEventListener('click', () => {
                        let name = card.dataset.subject;
                        if (!name) {
                            const h3 = card.querySelector('h3');
                            if (h3) name = h3.textContent.trim();
                        }
                        console.log(`Clicked on subject card: ${name}`);
                        if (!name) {
                            console.error("Could not find subject name!");
                            return;
                        }
                        const subData = fusionSubjects.find(s => s.name.toLowerCase() === name.toLowerCase());
                        if (subData) {
                            console.log("Subject data found:", subData);
                            if (typeof window.openFusionModal === 'function') {
                                console.log("Calling window.openFusionModal...");
                                window.openFusionModal(subData);
                            } else {
                                console.error("window.openFusionModal is not defined in window scope!");
                                alert("Error: Animation module not fully loaded. Check browser console.");
                            }
                        } else {
                            console.error(`Could not find subject data for name: ${name}`);
                        }
                    });
                });
            }

            // Bind Next/Prev button events
            const prevBtn = document.getElementById('prevSectionBtn');
            const nextBtn = document.getElementById('nextSectionBtn');
            if (prevBtn) prevBtn.addEventListener('click', () => loadSection(prevBtn.dataset.target));
            if (nextBtn) nextBtn.addEventListener('click', () => loadSection(nextBtn.dataset.target));

        }, 100);
    }

    function getNavigationButtons(currentTarget) {
        const index = sections.findIndex(s => s.target === currentTarget);
        if (index === -1) return '';

        const prev = index > 0 ? sections[index - 1] : null;
        const next = index < sections.length - 1 ? sections[index + 1] : null;

        let html = '<div class="page-nav-controls">';
        if (prev) {
            html += `<button id="prevSectionBtn" class="nav-btn" data-target="${prev.target}">&#8592; Previous: ${prev.title}</button>`;
        } else {
            html += `<button class="nav-btn" disabled>&#8592; Previous</button>`;
        }

        if (next) {
            html += `<button id="nextSectionBtn" class="nav-btn" data-target="${next.target}">Next: ${next.title} &#8594;</button>`;
        } else {
            html += `<button class="nav-btn" disabled>Next &#8594;</button>`;
        }
        html += '</div>';

        return html;
    }

    function openEquationModal(eq) {
        // Clear existing labels if any
        const existingLabels = animationOverlay.parentNode.querySelectorAll('.animation-label');
        existingLabels.forEach(l => l.remove());

        // Hide mudra image and set a dark background for contrast
        modalMudraImg.style.display = 'none';
        modalMudraImg.src = '';
        const visualContainer = modalMudraImg.parentElement;
        if (visualContainer) {
            visualContainer.style.background = '#0e0202'; // Very dark, premium theme-appropriate background
        }

        modalMudraName.textContent = eq.title;
        modalMudraPlacement.textContent = eq.equation;
        
        modalMathContent.innerHTML = `
            <div class="math-concept-item">
                <p><strong>Definition:</strong> ${eq.desc}</p>
            </div>
            <div class="math-concept-item">
                <p><strong>Dance Perspective:</strong> Observe the visual trajectory formed by the dancer's limbs or movement patterns.</p>
            </div>
        `;
        
        mathModal.style.display = 'flex';
        createEquationAnimation(eq);
    }

    function createEquationAnimation(eq) {
        animationOverlay.innerHTML = '';
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 400 400");
        svg.setAttribute("style", "width:100%; height:100%; position:absolute; top:0; left:0;");
        animationOverlay.appendChild(svg);

        const title = eq.title.toLowerCase();
        console.log("Creating creative animation for:", title);

        // Inject dynamic keyframe animation helper
        const dynamicStyle = document.createElement('style');
        dynamicStyle.innerHTML = `
            @keyframes pulseSymmetry {
                0% { transform: scale(0.98); opacity: 0.8; }
                100% { transform: scale(1.02); opacity: 1; }
            }
        `;
        animationOverlay.appendChild(dynamicStyle);

        if (title === 'linear functions') {
            // Draw baseline coordinates
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 200, x2: 350, y2: 200, stroke: 'rgba(255,215,0,0.2)', 'stroke-width': 2, 'stroke-dasharray': '5,5' }));
            
            // Linear horizontal track (Eye gaze trajectory)
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 200, x2: 350, y2: 200, class: 'animated-line', style: 'stroke:var(--gold); stroke-width:4;' }));
            
            // Gliding pointer (The pupil/focus point tracking horizontally)
            const eyePointer = createSVGElement('circle', { cx: 50, cy: 200, r: 10, fill: 'red', filter: 'drop-shadow(0 0 8px red)' });
            const eyeAnim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            eyeAnim.setAttribute("attributeName", "cx");
            eyeAnim.setAttribute("values", "50;350;50");
            eyeAnim.setAttribute("dur", "4s");
            eyeAnim.setAttribute("repeatCount", "indefinite");
            eyePointer.appendChild(eyeAnim);
            svg.appendChild(eyePointer);

            // Adding secondary vertical tracking line to form coordinate projection
            const projectionLine = createSVGElement('line', { x1: 50, y1: 50, x2: 50, y2: 350, stroke: 'rgba(255,215,0,0.1)', 'stroke-width': 1 });
            const projAnim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            projAnim.setAttribute("attributeName", "x1");
            projAnim.setAttribute("values", "50;350;50");
            projAnim.setAttribute("dur", "4s");
            projAnim.setAttribute("repeatCount", "indefinite");
            const projAnimX2 = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            projAnimX2.setAttribute("attributeName", "x2");
            projAnimX2.setAttribute("values", "50;350;50");
            projAnimX2.setAttribute("dur", "4s");
            projAnimX2.setAttribute("repeatCount", "indefinite");
            projectionLine.appendChild(projAnim);
            projectionLine.appendChild(projAnimX2);
            svg.appendChild(projectionLine);

        } else if (title === 'circle') {
            // Origin Center point
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 6, fill: 'red' }));
            
            // Dotted reference perimeter
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 110, fill: 'none', stroke: 'rgba(255,215,0,0.2)', 'stroke-width': 2, 'stroke-dasharray': '5,5' }));
            
            // Animated circle path
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 110, class: 'animated-circle', style: 'stroke:var(--gold); stroke-width:4;' }));
            
            // Rotating vector arm and trace marker
            const circleGroup = createSVGElement('g', { transform: 'translate(200, 200)' });
            const radiusLine = createSVGElement('line', { x1: 0, y1: 0, x2: 110, y2: 0, stroke: 'var(--gold)', 'stroke-width': 2 });
            const traceDot = createSVGElement('circle', { cx: 110, cy: 0, r: 8, fill: 'red', filter: 'drop-shadow(0 0 5px red)' });
            
            const rotateAnim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
            rotateAnim.setAttribute("attributeName", "transform");
            rotateAnim.setAttribute("type", "rotate");
            rotateAnim.setAttribute("from", "0 0 0");
            rotateAnim.setAttribute("to", "360 0 0");
            rotateAnim.setAttribute("dur", "4s");
            rotateAnim.setAttribute("repeatCount", "indefinite");
            
            circleGroup.appendChild(rotateAnim);
            circleGroup.appendChild(radiusLine);
            circleGroup.appendChild(traceDot);
            svg.appendChild(circleGroup);

        } else if (title === 'sine waves') {
            // Wave trace coordinates
            let d = "M 50 200";
            let valuesX = [];
            let valuesY = [];
            for (let x = 50; x <= 350; x += 6) {
                const y = 200 + Math.sin((x - 50) / 25) * 80;
                d += ` L ${x} ${y}`;
                valuesX.push(x);
                valuesY.push(y);
            }
            // Draw axis
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 200, x2: 350, y2: 200, stroke: 'rgba(255,215,0,0.15)', 'stroke-width': 2 }));
            
            // Animated wave path
            svg.appendChild(createSVGElement('path', { d, fill: 'none', class: 'animated-line', style: 'stroke:var(--gold); stroke-width:4;' }));
            
            // Tracer dot representing head oscillation (Attami) gliding along the wave path
            const tracer = createSVGElement('circle', { cx: 50, cy: 200, r: 8, fill: 'red', filter: 'drop-shadow(0 0 6px red)' });
            const tracerAnimX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            tracerAnimX.setAttribute("attributeName", "cx");
            tracerAnimX.setAttribute("values", valuesX.join(';'));
            tracerAnimX.setAttribute("dur", "4s");
            tracerAnimX.setAttribute("repeatCount", "indefinite");
            
            const tracerAnimY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            tracerAnimY.setAttribute("attributeName", "cy");
            tracerAnimY.setAttribute("values", valuesY.join(';'));
            tracerAnimY.setAttribute("dur", "4s");
            tracerAnimY.setAttribute("repeatCount", "indefinite");
            
            tracer.appendChild(tracerAnimX);
            tracer.appendChild(tracerAnimY);
            svg.appendChild(tracer);

        } else if (title === 'parabolic motion') {
            // Draw ground level
            svg.appendChild(createSVGElement('line', { x1: 30, y1: 320, x2: 370, y2: 320, stroke: 'rgba(255,215,0,0.3)', 'stroke-width': 3 }));
            
            // Parabolic path (dancer's jump trajectory)
            let d = "M 50 320 Q 200 60 350 320";
            svg.appendChild(createSVGElement('path', { d, fill: 'none', class: 'animated-line', style: 'stroke:var(--gold); stroke-width:4;' }));
            
            // Generate parabolic leap points using quadratic Bezier curve formulas
            let leapX = [];
            let leapY = [];
            for (let t = 0; t <= 1.001; t += 0.04) {
                const cx = (1-t)*(1-t)*50 + 2*(1-t)*t*200 + t*t*350;
                const cy = (1-t)*(1-t)*320 + 2*(1-t)*t*60 + t*t*320;
                leapX.push(cx);
                leapY.push(cy);
            }

            // Pulsing tracer dot representing the dancer jumping
            const jumper = createSVGElement('circle', { cx: 50, cy: 320, r: 10, fill: 'red', filter: 'drop-shadow(0 0 6px red)' });
            const jumperX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            jumperX.setAttribute("attributeName", "cx");
            jumperX.setAttribute("values", leapX.join(';'));
            jumperX.setAttribute("dur", "3s");
            jumperX.setAttribute("repeatCount", "indefinite");
            
            const jumperY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            jumperY.setAttribute("attributeName", "cy");
            jumperY.setAttribute("values", leapY.join(';'));
            jumperY.setAttribute("dur", "3s");
            jumperY.setAttribute("repeatCount", "indefinite");
            
            jumper.appendChild(jumperX);
            jumper.appendChild(jumperY);
            svg.appendChild(jumper);

        } else if (title === 'reflection symmetry') {
            // Central mirror line
            svg.appendChild(createSVGElement('line', { x1: 200, y1: 40, x2: 200, y2: 360, stroke: 'red', 'stroke-width': 2, 'stroke-dasharray': '6,4', class: 'animated-line' }));
            
            // Left mirror side (Symmetric small triangle)
            const leftSide = createSVGElement('g');
            leftSide.appendChild(createSVGElement('polygon', { points: "150,200 180,180 180,220", fill: 'rgba(255,215,0,0.15)', stroke: 'var(--gold)', 'stroke-width': 3 }));
            leftSide.style.transformOrigin = "170px 200px";
            leftSide.style.animation = "pulseSymmetry 2.5s infinite alternate ease-in-out";
            svg.appendChild(leftSide);
            
            // Right mirror side (Perfect mirror of the left across x=200 axis)
            const rightSide = createSVGElement('g');
            rightSide.appendChild(createSVGElement('polygon', { points: "250,200 220,180 220,220", fill: 'rgba(255,215,0,0.15)', stroke: 'var(--gold)', 'stroke-width': 3 }));
            rightSide.style.transformOrigin = "230px 200px";
            rightSide.style.animation = "pulseSymmetry 2.5s infinite alternate ease-in-out";
            svg.appendChild(rightSide);

        } else if (title === 'angular rotation') {
            // Center spin origin (Dancer's rotation axis)
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 8, fill: 'var(--gold)' }));

            // Pre-calculate variables demonstrating conservation of angular momentum:
            // 1. Slow outer rotation: Radius = 110
            // 2. Arms pull in: Radius drops to 40, spin speed increases by 3x!
            // 3. Arms push back out: Radius goes to 110, spin speed decreases.
            let spinX = [];
            let spinY = [];
            let rTrace = [];
            const steps = 150;
            
            for (let i = 0; i <= steps; i++) {
                const pct = i / steps;
                let currentR = 110;
                let currentAngle = 0;
                
                if (pct < 0.33) {
                    // Slow rotation at outer radius (110)
                    currentR = 110;
                    currentAngle = pct * 3 * Math.PI * 2;
                } else if (pct < 0.66) {
                    // Arms pull in (110 -> 40), rotational velocity increases
                    const localPct = (pct - 0.33) * 3;
                    currentR = 110 - localPct * 70;
                    currentAngle = 3 * Math.PI * 2 + localPct * 6 * Math.PI * 2; // Extra speed!
                } else {
                    // Arms push back out (40 -> 110), spin slows down
                    const localPct = (pct - 0.66) * 3;
                    currentR = 40 + localPct * 70;
                    currentAngle = 9 * Math.PI * 2 + localPct * 3 * Math.PI * 2;
                }
                
                const cx = 200 + Math.cos(currentAngle) * currentR;
                const cy = 200 + Math.sin(currentAngle) * currentR;
                spinX.push(cx);
                spinY.push(cy);
                rTrace.push(currentR);
            }

            // Radial dashed boundary circle representing boundary contraction/expansion
            const dashBoundary = createSVGElement('circle', { cx: 200, cy: 200, r: 110, fill: 'none', stroke: 'rgba(255,215,0,0.15)', 'stroke-width': 2, 'stroke-dasharray': '5,5' });
            const rAnim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            rAnim.setAttribute("attributeName", "r");
            rAnim.setAttribute("values", rTrace.join(';'));
            rAnim.setAttribute("dur", "6s");
            rAnim.setAttribute("repeatCount", "indefinite");
            dashBoundary.appendChild(rAnim);
            svg.appendChild(dashBoundary);

            // Dancer's hands/tracer point
            const spinDot = createSVGElement('circle', { cx: 310, cy: 200, r: 10, fill: 'red', filter: 'drop-shadow(0 0 6px red)' });
            const spinAnimX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            spinAnimX.setAttribute("attributeName", "cx");
            spinAnimX.setAttribute("values", spinX.join(';'));
            spinAnimX.setAttribute("dur", "6s");
            spinAnimX.setAttribute("repeatCount", "indefinite");
            const spinAnimY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            spinAnimY.setAttribute("attributeName", "cy");
            spinAnimY.setAttribute("values", spinY.join(';'));
            spinAnimY.setAttribute("dur", "6s");
            spinAnimY.setAttribute("repeatCount", "indefinite");
            
            spinDot.appendChild(spinAnimX);
            spinDot.appendChild(spinAnimY);
            svg.appendChild(spinDot);

        } else if (title === 'arithmetic sequences') {
            // Sequence grid axis
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 220, x2: 350, y2: 220, stroke: 'rgba(255,215,0,0.2)', 'stroke-width': 2 }));
            
            // Draw sequential beat nodes
            for (let i = 0; i < 5; i++) {
                const x = 70 + i * 65;
                
                // Draw target node
                svg.appendChild(createSVGElement('circle', { cx: x, cy: 220, r: 16, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 2, class: 'animated-circle' }));
                
                // Node indices (a_1, a_2...)
                const indexText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                indexText.setAttribute("x", x); indexText.setAttribute("y", 265);
                indexText.setAttribute("fill", "var(--gold)"); indexText.setAttribute("font-size", "14");
                indexText.setAttribute("text-anchor", "middle");
                indexText.textContent = `a_${i+1}`;
                svg.appendChild(indexText);
                
                // Add calculation difference text (+d) between nodes
                if (i > 0) {
                    const diffText = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    diffText.setAttribute("x", x - 32.5); diffText.setAttribute("y", 195);
                    diffText.setAttribute("fill", "red"); diffText.setAttribute("font-size", "14");
                    diffText.setAttribute("text-anchor", "middle");
                    diffText.textContent = "+d";
                    svg.appendChild(diffText);
                }
            }

            // Stepping foot (Rhythmic sequence stepper jumping from beat to beat)
            const stepper = createSVGElement('circle', { cx: 70, cy: 220, r: 10, fill: 'red', filter: 'drop-shadow(0 0 6px red)' });
            const stepperX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            stepperX.setAttribute("attributeName", "cx");
            stepperX.setAttribute("values", "70;135;200;265;330;70");
            stepperX.setAttribute("keyTimes", "0;0.2;0.4;0.6;0.8;1");
            stepperX.setAttribute("dur", "5s");
            stepperX.setAttribute("repeatCount", "indefinite");
            
            const stepperY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            stepperY.setAttribute("attributeName", "cy");
            stepperY.setAttribute("values", "220;170;220;170;220;170;220;170;220;170;220");
            stepperY.setAttribute("keyTimes", "0;0.1;0.2;0.3;0.4;0.5;0.6;0.7;0.8;0.9;1");
            stepperY.setAttribute("dur", "5s");
            stepperY.setAttribute("repeatCount", "indefinite");
            
            stepper.appendChild(stepperX);
            stepper.appendChild(stepperY);
            svg.appendChild(stepper);

        } else if (title === 'coordinate geometry') {
            // Draw XY Cartesian Grid
            for (let i = 1; i < 8; i++) {
                svg.appendChild(createSVGElement('line', { x1: i * 50, y1: 0, x2: i * 50, y2: 400, stroke: 'rgba(255,215,0,0.05)', 'stroke-width': 1 }));
                svg.appendChild(createSVGElement('line', { x1: 0, y1: i * 50, x2: 400, y2: i * 50, stroke: 'rgba(255,215,0,0.05)', 'stroke-width': 1 }));
            }
            // Draw main axes
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 340, x2: 350, y2: 340, stroke: 'rgba(255,215,0,0.3)', 'stroke-width': 2, class: 'animated-line' }));
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 40, x2: 50, y2: 340, stroke: 'rgba(255,215,0,0.3)', 'stroke-width': 2, class: 'animated-line' }));
            
            const originTxt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            originTxt.setAttribute("x", "30"); originTxt.setAttribute("y", "360");
            originTxt.setAttribute("fill", "var(--gold)"); originTxt.setAttribute("font-size", "12");
            originTxt.textContent = "(0,0)";
            svg.appendChild(originTxt);

            // Create 3 coordinate points (Dancers in stage formation)
            // Moving from origin (50,340) to their respective coordinates:
            // Point 1: (110, 270)
            // Point 2: (290, 270)
            // Point 3: (200, 110)
            const dot1 = createSVGElement('circle', { cx: 50, cy: 340, r: 8, fill: 'red', filter: 'drop-shadow(0 0 4px red)' });
            const dot1x = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot1x.setAttribute("attributeName", "cx"); dot1x.setAttribute("values", "50;110;110;50"); dot1x.setAttribute("dur", "6s"); dot1x.setAttribute("repeatCount", "indefinite");
            const dot1y = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot1y.setAttribute("attributeName", "cy"); dot1y.setAttribute("values", "340;270;270;340"); dot1y.setAttribute("dur", "6s"); dot1y.setAttribute("repeatCount", "indefinite");
            dot1.appendChild(dot1x); dot1.appendChild(dot1y);

            const dot2 = createSVGElement('circle', { cx: 50, cy: 340, r: 8, fill: 'cyan', filter: 'drop-shadow(0 0 4px cyan)' });
            const dot2x = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot2x.setAttribute("attributeName", "cx"); dot2x.setAttribute("values", "50;290;290;50"); dot2x.setAttribute("dur", "6s"); dot2x.setAttribute("repeatCount", "indefinite");
            const dot2y = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot2y.setAttribute("attributeName", "cy"); dot2y.setAttribute("values", "340;270;270;340"); dot2y.setAttribute("dur", "6s"); dot2y.setAttribute("repeatCount", "indefinite");
            dot2.appendChild(dot2x); dot2.appendChild(dot2y);

            const dot3 = createSVGElement('circle', { cx: 50, cy: 340, r: 8, fill: 'magenta', filter: 'drop-shadow(0 0 4px magenta)' });
            const dot3x = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot3x.setAttribute("attributeName", "cx"); dot3x.setAttribute("values", "50;200;200;50"); dot3x.setAttribute("dur", "6s"); dot3x.setAttribute("repeatCount", "indefinite");
            const dot3y = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            dot3y.setAttribute("attributeName", "cy"); dot3y.setAttribute("values", "340;110;110;340"); dot3y.setAttribute("dur", "6s"); dot3y.setAttribute("repeatCount", "indefinite");
            dot3.appendChild(dot3x); dot3.appendChild(dot3y);

            // Stage boundary polygon forming a triangle
            const triangle = createSVGElement('polygon', { points: "110,270 290,270 200,110", fill: 'rgba(255,215,0,0.15)', stroke: 'var(--gold)', 'stroke-width': 2 });
            const triOpacity = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            triOpacity.setAttribute("attributeName", "opacity");
            triOpacity.setAttribute("values", "0;0;1;1;0;0");
            triOpacity.setAttribute("keyTimes", "0;0.35;0.45;0.8;0.9;1");
            triOpacity.setAttribute("dur", "6s");
            triOpacity.setAttribute("repeatCount", "indefinite");
            triangle.appendChild(triOpacity);

            svg.appendChild(triangle);
            svg.appendChild(dot1);
            svg.appendChild(dot2);
            svg.appendChild(dot3);

        } else if (title === 'modular arithmetic') {
            // Circular Timeline representing modulo n repeating cycle
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 220, r: 100, fill: 'none', stroke: 'rgba(255,215,0,0.2)', 'stroke-width': 2, class: 'animated-circle' }));
            
            // Loop coordinate configurations
            let mathTexts = [];
            for (let i = 0; i < 16; i++) {
                const currentBeat = i + 1;
                const modResult = currentBeat % 8 === 0 ? 0 : currentBeat % 8;
                mathTexts.push(`Beat ${currentBeat} ≡ ${modResult} (mod 8)`);
            }

            // Calculation status box
            const displayMath = document.createElementNS("http://www.w3.org/2000/svg", "text");
            displayMath.setAttribute("x", "200"); displayMath.setAttribute("y", "70");
            displayMath.setAttribute("fill", "var(--gold)"); displayMath.setAttribute("font-size", "22");
            displayMath.setAttribute("text-anchor", "middle"); displayMath.setAttribute("font-weight", "bold");
            
            const textAnim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            textAnim.setAttribute("attributeName", "textContent");
            textAnim.setAttribute("values", mathTexts.join(';'));
            textAnim.setAttribute("dur", "12s");
            textAnim.setAttribute("repeatCount", "indefinite");
            displayMath.appendChild(textAnim);
            svg.appendChild(displayMath);

            // Draw beat nodes around the modular clock
            const moduloX = [];
            const moduloY = [];
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 - Math.PI/2;
                const cx = 200 + Math.cos(angle) * 100;
                const cy = 220 + Math.sin(angle) * 100;
                moduloX.push(cx);
                moduloY.push(cy);

                // Small node anchor
                svg.appendChild(createSVGElement('circle', { cx, cy, r: 6, fill: 'var(--gold)' }));

                // Node indices (0 to 7)
                const nodeVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
                nodeVal.setAttribute("x", 200 + Math.cos(angle) * 125);
                nodeVal.setAttribute("y", 220 + Math.sin(angle) * 125 + 5);
                nodeVal.setAttribute("fill", "rgba(255,215,0,0.6)");
                nodeVal.setAttribute("font-size", "14");
                nodeVal.setAttribute("text-anchor", "middle");
                nodeVal.textContent = i;
                svg.appendChild(nodeVal);
            }

            // Generate ticking tracking points (16 total steps)
            const tickXArr = [];
            const tickYArr = [];
            for (let i = 0; i < 16; i++) {
                const idx = i % 8;
                tickXArr.push(moduloX[idx]);
                tickYArr.push(moduloY[idx]);
            }
            tickXArr.push(tickXArr[0]);
            tickYArr.push(tickYArr[0]);

            // Modular pointer ticking beat by beat discrete
            const tickIndicator = createSVGElement('circle', { cx: 200, cy: 120, r: 12, fill: 'red', filter: 'drop-shadow(0 0 6px red)' });
            const clockTickX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            clockTickX.setAttribute("attributeName", "cx"); clockTickX.setAttribute("values", tickXArr.join(';'));
            clockTickX.setAttribute("dur", "12s"); clockTickX.setAttribute("repeatCount", "indefinite"); clockTickX.setAttribute("calcMode", "discrete");
            const clockTickY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            clockTickY.setAttribute("attributeName", "cy"); clockTickY.setAttribute("values", tickYArr.join(';'));
            clockTickY.setAttribute("dur", "12s"); clockTickY.setAttribute("repeatCount", "indefinite"); clockTickY.setAttribute("calcMode", "discrete");
            
            tickIndicator.appendChild(clockTickX);
            tickIndicator.appendChild(clockTickY);
            svg.appendChild(tickIndicator);

        } else if (title === 'wave functions') {
            // Wave 1: Translating Left (Cyan)
            const w1G = createSVGElement('g');
            let d1 = "M -100 200";
            for (let x = -100; x <= 500; x += 10) {
                const y = 200 + Math.sin(x / 30) * 40;
                d1 += ` L ${x} ${y}`;
            }
            const wave1 = createSVGElement('path', { d: d1, fill: 'none', stroke: 'cyan', 'stroke-width': 2, opacity: 0.5 });
            const animW1 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
            animW1.setAttribute("attributeName", "transform"); animW1.setAttribute("type", "translate");
            animW1.setAttribute("from", "0 0"); animW1.setAttribute("to", "188.4 0"); // Sine cycle period
            animW1.setAttribute("dur", "4s"); animW1.setAttribute("repeatCount", "indefinite");
            w1G.appendChild(wave1);
            w1G.appendChild(animW1);
            svg.appendChild(w1G);

            // Wave 2: Translating Right (Magenta)
            const w2G = createSVGElement('g');
            let d2 = "M -100 200";
            for (let x = -100; x <= 500; x += 10) {
                const y = 200 + Math.sin(x / 30) * 40;
                d2 += ` L ${x} ${y}`;
            }
            const wave2 = createSVGElement('path', { d: d2, fill: 'none', stroke: 'magenta', 'stroke-width': 2, opacity: 0.5 });
            const animW2 = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
            animW2.setAttribute("attributeName", "transform"); animW2.setAttribute("type", "translate");
            animW2.setAttribute("from", "0 0"); animW2.setAttribute("to", "-188.4 0");
            animW2.setAttribute("dur", "4s"); animW2.setAttribute("repeatCount", "indefinite");
            w2G.appendChild(wave2);
            w2G.appendChild(animW2);
            svg.appendChild(w2G);

            // Wave 3: Morphing Combined Wave (Gold) demonstrating constructive & destructive interference
            // Phase morph targets: constructive -> destructive (flat) -> constructive (inv) -> destructive -> constructive
            let dComb0 = "M 50 200";
            let dComb1 = "M 50 200";
            let dComb2 = "M 50 200";
            let dComb3 = "M 50 200";
            
            for (let x = 50; x <= 350; x += 10) {
                const ang = (x - 50) / 30;
                dComb0 += ` L ${x} ${200 + Math.sin(ang) * 80}`; // Constructive Peak
                dComb1 += ` L ${x} 200`;                           // Flat Destructive
                dComb2 += ` L ${x} ${200 - Math.sin(ang) * 80}`; // Constructive Trough
                dComb3 += ` L ${x} 200`;                           // Flat Destructive
            }
            
            const combWave = createSVGElement('path', { d: dComb0, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 5, filter: 'drop-shadow(0 0 5px var(--gold))' });
            const combWaveAnim = document.createElementNS("http://www.w3.org/2000/svg", "animate");
            combWaveAnim.setAttribute("attributeName", "d");
            combWaveAnim.setAttribute("values", `${dComb0};${dComb1};${dComb2};${dComb3};${dComb0}`);
            combWaveAnim.setAttribute("dur", "4s");
            combWaveAnim.setAttribute("repeatCount", "indefinite");
            combWave.appendChild(combWaveAnim);
            svg.appendChild(combWave);

        } else {
            // Default fallback
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 50, fill: 'var(--gold)', opacity: '0.3' }));
        }
    }

    function openMudraModal(mudra) {
        // Show mudra image and reset background
        modalMudraImg.style.display = 'block';
        const visualContainer = modalMudraImg.parentElement;
        if (visualContainer) {
            visualContainer.style.background = '#fff'; // Standard white background for mudras
        }

        modalMudraImg.src = mudra.image;
        modalMudraName.textContent = mudra.name;
        modalMudraPlacement.textContent = mudra.placement;
        
        modalMathContent.innerHTML = mudra.math ? mudra.math.map(m => `
            <div class="math-concept-item">
                <p>${m}</p>
            </div>
        `).join('') : `<p>${mudra.nonMathDesc || 'No mathematical analysis for this gesture.'}</p>`;
        
        mathModal.style.display = 'flex';
        createMathAnimation(mudra);
    }

    function closeModal() {
        mathModal.style.display = 'none';
        animationOverlay.innerHTML = '';
        
        // Restore defaults
        modalMudraImg.style.display = 'block';
        const visualContainer = modalMudraImg.parentElement;
        if (visualContainer) {
            visualContainer.style.background = '#fff';
        }
    }

    closeModalBtn.addEventListener('click', closeModal);
    mathModal.addEventListener('click', (e) => {
        if (e.target === mathModal) closeModal();
    });

    function createMathAnimation(mudra) {
        animationOverlay.innerHTML = '';
        // Clear any existing labels
        const existingLabels = animationOverlay.parentNode.querySelectorAll('.animation-label');
        existingLabels.forEach(l => l.remove());

        if (!mudra.math) return;

        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 400 400");
        svg.setAttribute("class", "math-svg-overlay");
        animationOverlay.appendChild(svg);

        const durationPerStep = 6; // Snappier duration
        const totalConcepts = mudra.math.length;
        const totalSteps = totalConcepts + 1; // +1 for the combined view
        const totalDuration = totalSteps * durationPerStep;
        
        // Dynamic Keyframes to ensure ZERO overlap
        const pStep = 100 / totalSteps;
        const pFadeIn = pStep * 0.1;
        const pFadeOut = pStep * 0.9;

        const dynamicStyle = document.createElement('style');
        dynamicStyle.innerHTML = `
            @keyframes dynamicSequenceFade {
                0% { opacity: 0; }
                ${pFadeIn}% { opacity: 1; }
                ${pFadeOut}% { opacity: 1; }
                ${pStep}% { opacity: 0; }
                100% { opacity: 0; }
            }
            @keyframes dynamicLabelFade {
                0% { opacity: 0; transform: translate(-50%, -10px); }
                ${pFadeIn}% { opacity: 1; transform: translate(-50%, 0); }
                ${pFadeOut}% { opacity: 1; transform: translate(-50%, 0); }
                ${pStep}% { opacity: 0; transform: translate(-50%, -10px); }
                100% { opacity: 0; transform: translate(-50%, -10px); }
            }
        `;
        animationOverlay.appendChild(dynamicStyle);
        
        // Individual Phases
        mudra.math.forEach((concept, index) => {
            const delay = index * durationPerStep;

            // Individual Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'animation-label';
            labelDiv.textContent = concept.split(':')[0].trim();
            labelDiv.style.animation = `dynamicLabelFade ${totalDuration}s ${delay}s infinite`;
            animationOverlay.parentNode.appendChild(labelDiv);

            // Individual SVG Group
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.style.animation = `dynamicSequenceFade ${totalDuration}s ${delay}s infinite`;
            g.style.opacity = "0";
            svg.appendChild(g);
            renderAnimationStep(g, concept.toLowerCase(), false, index);
        });

        // Combined Phase
        const combinedDelay = totalConcepts * durationPerStep;
        const combinedG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        combinedG.style.animation = `dynamicSequenceFade ${totalDuration}s ${combinedDelay}s infinite`;
        combinedG.style.opacity = "0";
        svg.appendChild(combinedG);

        const combinedLabel = document.createElement('div');
        combinedLabel.className = 'animation-label combined-label';
        combinedLabel.innerHTML = `<strong>Combined View:</strong><br>${mudra.math.map(m => m.split(':')[0].trim()).join(' & ')}`;
        combinedLabel.style.animation = `dynamicLabelFade ${totalDuration}s ${combinedDelay}s infinite`;
        animationOverlay.parentNode.appendChild(combinedLabel);

        mudra.math.forEach((concept, index) => {
            renderAnimationStep(combinedG, concept.toLowerCase(), true, index);
        });
    }

    function renderAnimationStep(container, concept, isCombined = false, index = 0) {
        // Distinct color palette for combined views
        const combinedColors = ['#00FFFF', '#FF00FF', '#00FF00', '#FFFF00', '#FF8C00'];
        const strokeColor = isCombined ? combinedColors[index % combinedColors.length] : 'rgba(255, 0, 0, 0.6)';
        const strokeWidth = isCombined ? 4 : 3;
        const shadowStyle = isCombined ? 'filter: drop-shadow(0 0 5px rgba(0,0,0,0.8));' : '';

        if (concept.includes('parallel')) {
            for (let i = 0; i < 4; i++) {
                container.appendChild(createSVGElement('line', {
                    x1: 100 + (i * 40), y1: 50,
                    x2: 100 + (i * 40), y2: 350,
                    class: 'animated-line',
                    style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; ${shadowStyle}`
                }));
            }
        } else if (concept.includes('angle') || concept.includes('perpendicular') || concept.includes('90')) {
            container.appendChild(createSVGElement('path', {
                d: "M 150 100 L 150 300 L 300 300",
                fill: 'none',
                class: 'animated-line',
                style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; ${shadowStyle}`
            }));
        } else if (concept.includes('circle') || concept.includes('round') || concept.includes('cylinder') || concept.includes('radius')) {
            container.appendChild(createSVGElement('circle', {
                cx: 200, cy: 200, r: 120,
                class: 'animated-circle',
                style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; ${shadowStyle}`
            }));
        } else if (concept.includes('symmetry') || concept.includes('mirror') || concept.includes('reflection')) {
            container.appendChild(createSVGElement('line', {
                x1: 200, y1: 50, x2: 200, y2: 350,
                class: 'animated-line',
                style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; stroke-dasharray: 10, 5; ${shadowStyle}`
            }));
        } else if (concept.includes('point') || concept.includes('vertex')) {
            container.appendChild(createSVGElement('circle', {
                cx: 200, cy: 200, r: 10,
                class: 'animated-point',
                style: `fill: ${strokeColor}; ${shadowStyle}`
            }));
        } else if (concept.includes('triangle') || concept.includes('v-shape') || concept.includes('intersect') || concept.includes('vertex')) {
            container.appendChild(createSVGElement('path', {
                d: "M 100 150 L 200 300 L 300 150",
                fill: 'none',
                class: 'animated-line',
                style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; ${shadowStyle}`
            }));
        } else {
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x2 = 200 + Math.cos(angle) * 150;
                const y2 = 200 + Math.sin(angle) * 150;
                container.appendChild(createSVGElement('line', {
                    x1: 200, y1: 200, x2: x2, y2: y2,
                    class: 'animated-line',
                    style: `stroke: ${strokeColor}; stroke-width: ${strokeWidth}; ${shadowStyle}`
                }));
            }
        }
    }

    function createSVGElement(tag, attrs) {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (let k in attrs) el.setAttribute(k, attrs[k]);
        return el;
    }

    // A helper to pronounce text using Indian English voice if available
    window.pronounceText = function(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            
            // Wait for voices to load if not already
            let voices = window.speechSynthesis.getVoices();
            const setVoice = () => {
                voices = window.speechSynthesis.getVoices();
                const indianVoice = voices.find(voice => voice.lang === 'hi-IN' || voice.lang === 'en-IN');
                if (indianVoice) {
                    utterance.voice = indianVoice;
                }
                window.speechSynthesis.speak(utterance);
            };

            if (voices.length !== 0) {
                setVoice();
            } else {
                window.speechSynthesis.onvoiceschanged = setVoice;
            }
        } else {
            alert("Pronunciation not supported in this browser.");
        }
    };

    function getHTMLForSection(target) {
        switch(target) {
            case 'intro':
                return `
                    <h2 class="section-title">1. Introduction to Kuchipudi</h2>
                    <div class="content-block">
                        <p><strong>Origin and History:</strong> Kuchipudi originated in a village named Kuchipudi in the Indian state of Andhra Pradesh. It developed as a religious art form linked to traveling bards, temples, and spiritual beliefs. Rooted in the ancient Hindu text 'Natya Shastra', it was traditionally performed by male Brahmins known as Bhagavathalus.</p><br>
                        <p><strong>Dance-Drama Tradition:</strong> Unlike purely solo dance forms, Kuchipudi is uniquely known for its dance-drama roots. Performers act out roles with dialogue, seamlessly integrating pure dance (Nritta), expressive dance (Nritya), and theatrical storytelling (Natya).</p><br>
                        <p><strong>Expressions and Mudras:</strong> Hand gestures (Mudras) and facial expressions (Abhinaya) are the primary vocabulary of this art. A dancer can communicate complex narratives, emotions, natural elements, and deep philosophical concepts without speaking a single word.</p><br>
                        <p><strong>Cultural Significance:</strong> It is not just a dance, but a devotional offering. Kuchipudi bridges the gap between the divine and the audience, often depicting tales of Lord Krishna, Shiva, and mythological epics.</p><br>
                        <p><strong>Evolution:</strong> Over centuries, it evolved from male-only troupes performing in village squares to a highly sophisticated classical art form performed by all genders on prestigious global stages.</p>
                    </div>
                `;
            case 'asamyutha':
                return `
                    <h2 class="section-title">2. Asamyutha Hastas</h2>
                    <div class="content-block">
                        <p><strong>What is a Mudra?</strong> A 'Mudra' is a symbolic hand gesture used in Indian classical dance and spiritual practices. It acts as a visual sign language, allowing the dancer to vividly describe objects, emotions, people, and actions.</p><br>
                        <p><strong>Types of Mudras:</strong> There are two main categories of hand gestures in classical dance:<br>
                        1. <em>Asamyutha Hastas:</em> Single-hand gestures where only one hand is used to form a shape.<br>
                        2. <em>Samyutha Hastas:</em> Double-hand gestures where both hands are combined to convey a meaning.</p><br>
                        <p><strong>Definition of Asamyutha Hastas:</strong> Asamyutha Hastas are the foundational single-hand gestures. There are 28 primary Asamyutha Hastas mentioned in the Abhinaya Darpana text, forming the basic alphabet of the dance language.</p>
                    </div>
                    <div class="mudra-grid">
                        ${asamyuthaHastas.map(m => `
                            <div class="mudra-card">
                                <div class="mudra-image-container">
                                    <img src="${m.image}" alt="${m.name}">
                                </div>
                                <div class="mudra-info">
                                    <h3>${m.name}</h3>
                                    <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px;">${m.placement}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'samyutha':
                return `
                    <h2 class="section-title">3. Samyutha Hastas</h2>
                    <div class="content-block">
                        <p><strong>Definition:</strong> Samyutha Hastas are double-hand gestures, requiring both hands to be used simultaneously to convey a combined meaning.</p>
                    </div>
                    <div class="mudra-grid">
                        ${samyuthaHastas.map(m => `
                            <div class="mudra-card">
                                <div class="mudra-image-container">
                                    <img src="${m.image}" alt="${m.name}">
                                </div>
                                <div class="mudra-info">
                                    <h3>${m.name}</h3>
                                    <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 10px;">${m.placement}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'math-asamyutha':
                return `
                    <h2 class="section-title">4. Mathematical Harmony in Asamyutha Hastas</h2>
                    <div class="content-block">
                        <p>Discover the hidden geometric structures and mathematical principles within each single-hand gesture. The mathematical importance is shown below each gesture.</p>
                        <p style="color: var(--gold); font-style: italic;">(Click any card to see animated mathematical visualization)</p>
                    </div>
                    <div class="mudra-grid">
                        ${asamyuthaHastas.map(m => `
                            <div class="mudra-card">
                                <div class="mudra-image-container">
                                    <img src="${m.image}" alt="${m.name}">
                                </div>
                                <div class="mudra-info">
                                    <h3>${m.name}</h3>
                                    <p style="font-size: 0.9rem; opacity: 0.8;">${m.placement}</p>
                                    <button class="pronounce-btn" onclick="pronounceText('${m.name}')">🔊 Pronounce</button>
                                    
                                    <div class="math-info-box">
                                        <p>Mathematical Concept:</p>
                                        <div class="math-concepts">${m.math.map(concept => `<div style="margin-bottom:8px;">${concept}</div>`).join('')}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'math-samyutha':
                return `
                    <h2 class="section-title">5. Mathematical Harmony in Samyutha Hastas</h2>
                    <div class="content-block">
                        <p>Double-hand gestures inherently demonstrate complex symmetry, mirroring, and spatial coordination. The mathematical importance is shown below each gesture.</p>
                        <p style="color: var(--gold); font-style: italic;">(Click any card to see animated mathematical visualization)</p>
                    </div>
                    <div class="mudra-grid">
                        ${samyuthaHastas.map(m => `
                            <div class="mudra-card">
                                <div class="mudra-image-container">
                                    <img src="${m.image}" alt="${m.name}">
                                </div>
                                <div class="mudra-info">
                                    <h3>${m.name}</h3>
                                    <p style="font-size: 0.9rem; opacity: 0.8;">${m.placement}</p>
                                    <button class="pronounce-btn" onclick="pronounceText('${m.name}')">🔊 Pronounce</button>
                                    
                                    <div class="math-info-box">
                                        <p>Mathematical Concept:</p>
                                        <div class="math-concepts">${m.math.map(concept => `<div style="margin-bottom:8px;">${concept}</div>`).join('')}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'non-math':
                return `
                    <h2 class="section-title">6. Non-Mathematical Dimensions of Mudras</h2>
                    <div class="content-block">
                        <p>Not every mudra in Kuchipudi is connected to mathematics. Some hastas are deeply rooted in spirituality, emotions, storytelling, mythology, and artistic imagination. These gestures highlight the expressive beauty of classical dance beyond calculations, geometry, and rhythm.</p>
                    </div>
                    <div class="mudra-grid">
                        ${[...asamyuthaHastas, ...samyuthaHastas].filter(m => m.nonMath).map(m => `
                            <div class="mudra-card" style="border-color: #ffb6c1;">
                                <div class="mudra-image-container">
                                    <img src="${m.image}" alt="${m.name}" style="filter: sepia(0.5);">
                                </div>
                                <div class="mudra-info">
                                    <h3 style="color: #ffb6c1;">${m.name}</h3>
                                    <p style="font-size: 0.9rem; margin-bottom: 10px;">${m.nonMathDesc}</p>
                                    <button class="pronounce-btn" style="border-color:#ffb6c1; color:#ffb6c1;" onclick="pronounceText('${m.name}')">🔊 Pronounce</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'equations':
                return `
                    <h2 class="section-title">7. The Dancing Equations</h2>
                    <div class="content-block">
                        <p>Visual demonstration of how dance movements generate mathematical functions and geometric structures.</p>
                        <p style="color: var(--gold); font-style: italic;">(Click any equation to see animated function visualization)</p>
                    </div>
                    <div class="equations-section">
                        ${dancingEquations.map(eq => `
                            <div class="equation-card">
                                <div class="equation-visual">${eq.symbol}</div>
                                <div>
                                    <h3 style="color:var(--gold); margin-bottom:5px;">${eq.title}</h3>
                                    <p style="margin-bottom:5px; font-style:italic;">${eq.equation}</p>
                                    <p style="font-size: 1rem;">${eq.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'fusion':
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
                return `
                    <h2 class="section-title">8. The Fusion of Subjects and Traditions</h2>
                    <div id="fusion-status-indicator" style="text-align:center; margin:-20px auto 30px; font-family:'Cinzel', serif; font-size:0.95rem; color:var(--cream); letter-spacing:1px; background:rgba(128,0,0,0.15); padding:12px; border:1px dashed var(--glass-border); border-radius:30px; max-width:600px;">
                        <span id="fusion-status-text" style="color:#ff4d4d; font-weight:bold; text-shadow:0 0 5px rgba(255,0,0,0.5);">Connecting modules...</span>
                    </div>
                    <div class="subject-fusion">
                        ${fusionSubjects.map(sub => `
                            <div class="subject-card" data-subject="${sub.name}">
                                <div style="display:flex; align-items:center; gap:15px; margin-bottom:15px;">
                                    <div class="subject-icon-circle">${subjectIcons[sub.name] || '🎨'}</div>
                                    <h3 style="margin:0;">${sub.name}</h3>
                                </div>
                                <p style="font-size:1rem; line-height: 1.6;">${sub.content}</p>
                            </div>
                        `).join('')}
                    </div>
                `;
            case 'conclusion':
                return `
                    <h2 class="section-title">9. Conclusion</h2>
                    <div class="conclusion-box">
                        <p class="quote">"Mathematics becomes magical when expressed through Kuchipudi."</p>
                        
                        <div class="conclusion-extended-info">
                            <p>This journey through the mathematical landscape of Kuchipudi reveals that art and science are not two separate worlds, but two different languages describing the same universal harmony. From the precise geometry of a single mudra to the complex modular arithmetic of a 32-beat rhythm cycle, every aspect of this classical dance is a testament to human logic and creativity.</p>
                            <p>Interdisciplinary learning allows us to see the world with a "third eye"—one that recognizes the physics in a leap, the biology in a gesture, and the algebra in a rhythmic pattern. By bridging these gaps, we foster a deeper appreciation for our cultural heritage while sharpening our academic intellect.</p>
                            <p>As we conclude, remember that mathematics is not just found in textbooks; it is felt in the rhythm of the feet, seen in the symmetry of the hands, and experienced in the soul of the dancer.</p>
                        </div>

                        <div id="thankYouTrigger" class="arrow-trigger">
                            <div class="arrow-icon">▼</div>
                            <p>Click to Conclude</p>
                        </div>
                    </div>

                    <div id="thankYouOverlay" class="thank-you-overlay">
                        <div class="thank-you-content">
                            <h1 class="thank-you-text">THANK YOU</h1>
                            <div class="lotus-icon">🪷</div>
                            <button class="btn" style="margin-top:40px; border:1px solid var(--gold);" onclick="goBackHome()">Return to Home</button>
                        </div>
                    </div>
                `;
            default:
                return '<h2>Section not found</h2>';
        }
    }
});

// Global trigger for Thank You (needs to be outside DOMContentLoaded if added dynamically)
document.addEventListener('click', (e) => {
    const trigger = e.target.closest('#thankYouTrigger');
    if (trigger) {
        const overlay = document.getElementById('thankYouOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            overlay.style.animation = 'fadeIn 1.5s forwards';
        }
    }
});

// Logout: clear auth and go to login page
function doLogout() {
    sessionStorage.removeItem('natyaAuth');
    window.location.href = 'login.html';
}

// Return to main home page from Thank You overlay
function goBackHome() {
    const overlay = document.getElementById('thankYouOverlay');
    if (overlay) overlay.style.display = 'none';
    const contentPage = document.getElementById('contentPage');
    const homePage = document.getElementById('homePage');
    const homeBtn = document.getElementById('homeBtn');
    const breadcrumbNav = document.getElementById('breadcrumbNav');
    const logoutBtn = document.getElementById('logoutBtn');
    if (contentPage) contentPage.style.display = 'none';
    if (homePage) homePage.style.display = 'flex';
    if (homeBtn) homeBtn.style.display = 'none';
    if (breadcrumbNav) breadcrumbNav.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'block';
}

