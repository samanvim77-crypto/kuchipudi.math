document.addEventListener('DOMContentLoaded', () => {
    const homeBtn = document.getElementById('homeBtn');
    const homePage = document.getElementById('homePage');
    const contentPage = document.getElementById('contentPage');
    const contentArea = document.getElementById('contentArea');
    const navItemsHome = document.querySelectorAll('#navListHome li');

    // Go Home Button
    homeBtn.addEventListener('click', () => {
        contentPage.style.display = 'none';
        homePage.style.display = 'flex';
        homeBtn.style.display = 'none';
    });

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

    // Section Content Generator
    function loadSection(target) {
        // Hide home page, show content page
        homePage.style.display = 'none';
        contentPage.style.display = 'block';
        homeBtn.style.display = 'block';

        contentArea.style.opacity = 0;
        setTimeout(() => {
            contentArea.innerHTML = getHTMLForSection(target);
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
            } else {
                // For non-math sections, make cards non-clickable
                const mudraCards = contentArea.querySelectorAll('.mudra-card');
                mudraCards.forEach(card => {
                    card.style.cursor = 'default';
                });
            }

            // Section 7 Equation Listeners
            const eqCards = contentArea.querySelectorAll('.equation-card');
            eqCards.forEach(card => {
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => {
                    const title = card.querySelector('h3').textContent;
                    const eq = dancingEquations.find(e => e.title === title);
                    if (eq) openEquationModal(eq);
                });
            });
        }, 100);
    }

    function openEquationModal(eq) {
        // Clear existing labels if any
        const existingLabels = animationOverlay.parentNode.querySelectorAll('.animation-label');
        existingLabels.forEach(l => l.remove());

        modalMudraImg.src = "https://placehold.co/600x400/800000/FFD700?text=" + encodeURIComponent(eq.title);
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
        console.log("Creating animation for:", title); // Helper for debugging if needed

        // Use more specific matching to avoid overlaps
        if (title === 'linear functions') {
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 350, x2: 350, y2: 50, class: 'animated-line', style: 'stroke:var(--gold); stroke-width:5;' }));
        } else if (title === 'circle') {
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 120, class: 'animated-circle', style: 'stroke:var(--gold); stroke-width:5;' }));
        } else if (title === 'sine waves') {
            let d = "M 50 200";
            for (let x = 50; x <= 350; x += 10) {
                const y = 200 + Math.sin((x - 50) / 30) * 80;
                d += ` L ${x} ${y}`;
            }
            svg.appendChild(createSVGElement('path', { d, fill: 'none', class: 'animated-line', style: 'stroke:var(--gold); stroke-width:5;' }));
        } else if (title === 'parabolic motion') {
            let d = "M 50 350 Q 200 0 350 350";
            svg.appendChild(createSVGElement('path', { d, fill: 'none', class: 'animated-line', style: 'stroke:var(--gold); stroke-width:5;' }));
        } else if (title === 'reflection symmetry') {
            svg.appendChild(createSVGElement('line', { x1: 200, y1: 50, x2: 200, y2: 350, stroke: 'var(--gold)', 'stroke-width': 2, 'stroke-dasharray': '10,5' }));
            svg.appendChild(createSVGElement('path', { d: "M 100 150 L 100 250 L 180 200 Z", fill: 'var(--gold)', opacity: '0.7', class: 'animated-line' }));
            svg.appendChild(createSVGElement('path', { d: "M 300 150 L 300 250 L 220 200 Z", fill: 'var(--gold)', opacity: '0.7', class: 'animated-line' }));
        } else if (title === 'angular rotation') {
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 100, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 2, 'stroke-dasharray': '5,5' }));
            const g = createSVGElement('g', { transform: 'translate(200, 200)' });
            const line = createSVGElement('line', { x1: 0, y1: 0, x2: 100, y2: 0, stroke: 'var(--gold)', 'stroke-width': 5 });
            const dot = createSVGElement('circle', { cx: 100, cy: 0, r: 12, fill: 'red' });
            const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
            anim.setAttribute("attributeName", "transform");
            anim.setAttribute("type", "rotate");
            anim.setAttribute("from", "0 0 0");
            anim.setAttribute("to", "360 0 0");
            anim.setAttribute("dur", "3s");
            anim.setAttribute("repeatCount", "indefinite");
            g.appendChild(anim);
            g.appendChild(line);
            g.appendChild(dot);
            svg.appendChild(g);
        } else if (title === 'arithmetic sequences') {
            for (let i = 0; i < 5; i++) {
                const x = 70 + i * 65;
                const c = createSVGElement('circle', { cx: x, cy: 200, r: 20, fill: 'var(--gold)', opacity: 0.8 });
                c.style.animation = `pulsePoint 1s infinite alternate ${i * 0.2}s`;
                svg.appendChild(c);
                const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
                t.setAttribute("x", x); t.setAttribute("y", 205); t.setAttribute("text-anchor", "middle");
                t.setAttribute("fill", "black"); t.setAttribute("font-weight", "bold"); t.textContent = (i + 1);
                svg.appendChild(t);
            }
        } else if (title === 'coordinate geometry') {
            svg.appendChild(createSVGElement('line', { x1: 50, y1: 200, x2: 350, y2: 200, stroke: 'var(--gold)', 'stroke-width': 3 }));
            svg.appendChild(createSVGElement('line', { x1: 200, y1: 50, x2: 200, y2: 350, stroke: 'var(--gold)', 'stroke-width': 3 }));
            const dot = createSVGElement('circle', { cx: 280, cy: 120, r: 12, fill: 'red' });
            svg.appendChild(dot);
            const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
            t.setAttribute("x", 295); t.setAttribute("y", 110); t.setAttribute("fill", "var(--gold)"); t.setAttribute("font-size", "20"); t.textContent = "(x, y)";
            svg.appendChild(t);
        } else if (title === 'modular arithmetic') {
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 120, fill: 'none', stroke: 'var(--gold)', 'stroke-width': 3 }));
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2 - Math.PI/2;
                const x = 200 + Math.cos(angle) * 120;
                const y = 200 + Math.sin(angle) * 120;
                svg.appendChild(createSVGElement('circle', { cx: x, cy: y, r: 8, fill: 'red' }));
                const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
                t.setAttribute("x", 200 + Math.cos(angle) * 150); t.setAttribute("y", 200 + Math.sin(angle) * 150);
                t.setAttribute("text-anchor", "middle"); t.setAttribute("fill", "var(--gold)"); t.setAttribute("font-size", "18"); t.textContent = i;
                svg.appendChild(t);
            }
        } else if (title === 'wave functions') {
            for (let i = 0; i < 2; i++) {
                let d = "M 50 200";
                for (let x = 50; x <= 350; x += 5) {
                    const y = 200 + Math.sin((x + i*100) / 20) * 60;
                    d += ` L ${x} ${y}`;
                }
                const p = createSVGElement('path', { d, fill: 'none', stroke: i === 0 ? 'cyan' : 'magenta', 'stroke-width': 4, opacity: 0.7, class: 'animated-line' });
                svg.appendChild(p);
            }
        } else {
            // Default circle just in case
            svg.appendChild(createSVGElement('circle', { cx: 200, cy: 200, r: 50, fill: 'var(--gold)', opacity: '0.3' }));
        }
    }

    function openMudraModal(mudra) {
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

        const durationPerStep = 8;
        const totalConcepts = mudra.math.length;
        const totalSteps = totalConcepts + 1; // +1 for the combined view
        const totalDuration = totalSteps * durationPerStep;
        
        // Individual Phases
        mudra.math.forEach((concept, index) => {
            const delay = index * durationPerStep;

            // Individual Label
            const labelDiv = document.createElement('div');
            labelDiv.className = 'animation-label';
            labelDiv.textContent = concept.split(':')[0].trim();
            labelDiv.style.animation = `labelFade ${totalDuration}s ${delay}s infinite`;
            animationOverlay.parentNode.appendChild(labelDiv);

            // Individual SVG Group
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.style.animation = `sequenceFadeFull ${totalDuration}s ${delay}s infinite`;
            g.style.opacity = "0";
            svg.appendChild(g);
            renderAnimationStep(g, concept.toLowerCase());
        });

        // Combined Phase
        const combinedDelay = totalConcepts * durationPerStep;
        const combinedG = document.createElementNS("http://www.w3.org/2000/svg", "g");
        combinedG.style.animation = `sequenceFadeFull ${totalDuration}s ${combinedDelay}s infinite`;
        combinedG.style.opacity = "0";
        svg.appendChild(combinedG);

        const combinedLabel = document.createElement('div');
        combinedLabel.className = 'animation-label combined-label';
        combinedLabel.innerHTML = `<strong>Combined View:</strong><br>${mudra.math.map(m => m.split(':')[0].trim()).join(' & ')}`;
        combinedLabel.style.animation = `labelFade ${totalDuration}s ${combinedDelay}s infinite`;
        animationOverlay.parentNode.appendChild(combinedLabel);

        mudra.math.forEach(concept => {
            renderAnimationStep(combinedG, concept.toLowerCase(), true);
        });
    }

    function renderAnimationStep(container, concept, isCombined = false) {
        // Use different colors in combined view
        const strokeColor = isCombined ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 0, 0, 0.6)';

        if (concept.includes('parallel')) {
            for (let i = 0; i < 4; i++) {
                container.appendChild(createSVGElement('line', {
                    x1: 100 + (i * 40), y1: 50,
                    x2: 100 + (i * 40), y2: 350,
                    class: 'animated-line',
                    style: isCombined ? `stroke: ${strokeColor}; stroke-width: 2;` : ''
                }));
            }
        } else if (concept.includes('angle') || concept.includes('perpendicular') || concept.includes('90')) {
            container.appendChild(createSVGElement('path', {
                d: "M 150 100 L 150 300 L 300 300",
                fill: 'none',
                class: 'animated-line',
                style: isCombined ? `stroke: cyan; stroke-width: 2;` : ''
            }));
        } else if (concept.includes('circle') || concept.includes('round') || concept.includes('cylinder') || concept.includes('radius')) {
            container.appendChild(createSVGElement('circle', {
                cx: 200, cy: 200, r: 120,
                class: 'animated-circle',
                style: isCombined ? `stroke: magenta; stroke-width: 2;` : ''
            }));
        } else if (concept.includes('symmetry') || concept.includes('mirror') || concept.includes('reflection')) {
            container.appendChild(createSVGElement('line', {
                x1: 200, y1: 50, x2: 200, y2: 350,
                class: 'animated-line',
                style: `stroke: ${isCombined ? 'lime' : 'var(--gold)'}; stroke-dasharray: 10, 5;`
            }));
        } else if (concept.includes('point') || concept.includes('vertex')) {
            container.appendChild(createSVGElement('circle', {
                cx: 200, cy: 200, r: 8,
                class: 'animated-point'
            }));
        } else if (concept.includes('triangle') || concept.includes('v-shape') || concept.includes('intersect') || concept.includes('vertex')) {
            container.appendChild(createSVGElement('path', {
                d: "M 100 150 L 200 300 L 300 150",
                fill: 'none',
                class: 'animated-line',
                style: isCombined ? `stroke: orange; stroke-width: 2;` : ''
            }));
        } else {
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x2 = 200 + Math.cos(angle) * 150;
                const y2 = 200 + Math.sin(angle) * 150;
                container.appendChild(createSVGElement('line', {
                    x1: 200, y1: 200, x2: x2, y2: y2,
                    class: 'animated-line'
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
                    <div class="subject-fusion">
                        ${fusionSubjects.map(sub => `
                            <div class="subject-card">
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
                            <button class="btn" style="margin-top:40px; border:1px solid var(--gold);" onclick="document.getElementById('thankYouOverlay').style.display='none'">Return to Home</button>
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

