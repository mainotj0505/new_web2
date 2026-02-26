const typingSpeed = 50;  // slowed further for a more deliberate typing effect
const typingElement = document.getElementById("typing-effect");

function typeWriter(text, element, speed) {
    let i = 0;
    element.textContent = "";
    element.style.whiteSpace = "pre-line";

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.opacity = Math.random() * 0.4;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < 70; i++) particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
}

window.addEventListener("DOMContentLoaded", () => {
    initParticles();
    animateParticles();

    // Safety check for zoom container if not in HTML
    if (!document.querySelector('.bg-zoom-container')) {
        const bgContainer = document.createElement('div');
        bgContainer.className = 'bg-zoom-container';
        document.body.prepend(bgContainer);
    }

    // Entry animation trigger for the title + quote
    const hero = document.querySelector('.hero-container');
    if (hero) {
        setTimeout(() => hero.classList.add('enter'), 120);
    }

    // Typing effect call
    if (typingElement) {
        setTimeout(() => {
            typeWriter("LIMCOMA MULTI-PURPOSE COOPERATIVE", typingElement, typingSpeed);
        }, 1);
    }

    /* =========================================================
       ✅ UPDATED: CONTINUOUS REVEAL (REPLAYS EVERY TIME)
       ========================================================= */
    const revealTargets = document.querySelectorAll('.reveal-on-scroll');

    if (revealTargets.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove('in-view');
                    requestAnimationFrame(() => {
                        entry.target.classList.add('in-view');

                        if (entry.target.classList.contains('about-content')) {
                            applyAboutStagger();
                        }
                    });
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        });

        revealTargets.forEach(el => observer.observe(el));
    }

    /* =========================================================
       ✅ STAGGER EFFECTS FOR ABOUT TEXT (REPLAYS EVERY TIME)
       ========================================================= */
    function applyAboutStagger() {
        const aboutContent = document.querySelector('.about-content');
        if (!aboutContent) return;

        const animItems = aboutContent.querySelectorAll('.about-anim');
        animItems.forEach((el, idx) => {
            const delay = 120 + (idx * 110);
            el.style.transitionDelay = `${delay}ms`;
        });
    }
    applyAboutStagger();

    /* =========================================================
       ✅ ABOUT PHOTO (SUPERHAPPYPIG) — NEW "COMES FROM OUTSIDE"
       - Starts OFFSCREEN while you're in Hero
       - Slides in as you scroll into About
       - Keeps your parallax effect after
       ========================================================= */
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const aboutSection = document.querySelector('#about');
    const aboutImg = document.querySelector('.about-image');

    if (aboutImg && aboutSection) {
        // Add frame class (your existing feature, no HTML change)
        const parent = aboutImg.parentElement;
        if (parent && !parent.classList.contains('about-image-frame')) {
            parent.classList.add('about-image-frame');
        }

        // Defaults for new entrance variables (CSS reads these)
        aboutImg.style.setProperty('--about-enter-x', '220px');     // from outside (right)
        aboutImg.style.setProperty('--about-enter-y', '120px');     // from below
        aboutImg.style.setProperty('--about-enter-rot', '8deg');    // slight rotate
        aboutImg.style.setProperty('--about-enter-opacity', '0');   // hidden

        let ticking = false;

        const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
        const smoothstep = (t) => t * t * (3 - 2 * t); // nice easing

        const updateAboutImage = () => {
            ticking = false;
            if (prefersReduced) return;

            // --- 1) Entrance progress based on scroll toward About section ---
            const rect = aboutSection.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;

            // When About is far below viewport -> progress 0
            // When About top reaches ~55% of viewport -> progress 1 (image settled)
            const startPoint = vh * 0.95; // start anim when section is near bottom
            const endPoint = vh * 0.55;   // fully in place

            const raw = (startPoint - rect.top) / (startPoint - endPoint);
            const t = clamp(raw, 0, 1);
            const ease = smoothstep(t);

            // Coming from outside → to position
            const fromX = 240, toX = 0;
            const fromY = 140, toY = 0;
            const fromRot = 10, toRot = 0;
            const fromOp = 0, toOp = 1;

            const x = (fromX + (toX - fromX) * ease).toFixed(2);
            const y = (fromY + (toY - fromY) * ease).toFixed(2);
            const r = (fromRot + (toRot - fromRot) * ease).toFixed(2);
            const o = (fromOp + (toOp - fromOp) * ease).toFixed(3);

            aboutImg.style.setProperty('--about-enter-x', `${x}px`);
            aboutImg.style.setProperty('--about-enter-y', `${y}px`);
            aboutImg.style.setProperty('--about-enter-rot', `${r}deg`);
            aboutImg.style.setProperty('--about-enter-opacity', `${o}`);

            // --- 2) Your original parallax (kept) ---
            const imgRect = aboutImg.getBoundingClientRect();
            const center = imgRect.top + imgRect.height / 2;
            const delta = (center - vh / 2) / (vh / 2);

            const max = 14;
            const offset = Math.max(-max, Math.min(max, -delta * max));

            aboutImg.style.setProperty('--about-parallax', `${offset}px`);
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateAboutImage);
            }
        };

        // Init + listeners
        updateAboutImage();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', updateAboutImage);
    }

    /* =========================================================
       ✅ HERO BUTTON INTERACTIONS (kept)
       ========================================================= */
    const heroButton = document.querySelector('.btn-primary-custom');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            ripple.className = 'ripple-effect';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });

        heroButton.addEventListener('mouseenter', () => {
            heroButton.style.transform = 'scale(1.07)';
        });
        heroButton.addEventListener('mouseleave', () => {
            heroButton.style.transform = '';
        });
    }
});

