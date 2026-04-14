document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       0. Video Lightbox
       ========================================= */
    const videoThumb = document.getElementById('video-thumb');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = document.getElementById('modal-video');
    const modalClose = document.getElementById('video-modal-close');

    if (videoThumb && videoModal && modalVideo) {
        videoThumb.addEventListener('click', () => {
            videoModal.classList.add('open');
            modalVideo.currentTime = 0;
            modalVideo.play();
        });

        modalClose.addEventListener('click', () => {
            videoModal.classList.remove('open');
            modalVideo.pause();
        });

        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('open');
                modalVideo.pause();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && videoModal.classList.contains('open')) {
                videoModal.classList.remove('open');
                modalVideo.pause();
            }
        });
    }

    /* =========================================
       0. Mobile Menu Toggle
       ========================================= */
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    /* =========================================
       1. Intersection Observer (Fade-in animations)
       ========================================= */
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    /* =========================================
       2. Navbar Hide/Show on Scroll
       ========================================= */
    let prevScrollpos = window.pageYOffset;
    let globalScrollVelocity = 0;
    const navbar = document.querySelector('.navbar');
    
    window.onscroll = function() {
        let currentScrollPos = window.pageYOffset;
        
        // Track kinetic scroll velocity for canvas parallax
        let delta = currentScrollPos - prevScrollpos;
        globalScrollVelocity = delta;

        if (prevScrollpos > currentScrollPos || currentScrollPos < 50) {
            navbar.classList.remove('hidden');
        } else {
            navbar.classList.add('hidden');
        }
        prevScrollpos = currentScrollPos;
    }

    /* =========================================
       3. 3D Card Interactions (Projects, Skills, Experience, Featured)
       ========================================= */
    const cards = document.querySelectorAll('.project-card, .skill-category, .experience-block, .featured-showcase');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            
            // Calculate mouse position strictly bounded between 0 and 1
            const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

            // Set CSS variables for the dynamic glowing border
            card.style.setProperty('--mouse-x', `${x * 100}%`);
            card.style.setProperty('--mouse-y', `${y * 100}%`);
            
            // Calculate 3D tilt angles (-10 to 10 degrees)
            const tiltX = (y - 0.5) * -10;
            const tiltY = (x - 0.5) * 10;
            
            // Generate a dynamic shadow that opposes the tilt direction
            const shadowX = (x - 0.5) * -40;
            const shadowY = (y - 0.5) * -40;

            card.style.transform = `scale3d(1.02, 1.02, 1.02) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            card.style.boxShadow = `${shadowX}px ${shadowY}px 50px rgba(0,0,0,0.6), 0 0 20px rgba(225, 29, 72, 0.1)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)`;
            card.style.boxShadow = `none`;
            // Reset standard border
            card.style.borderColor = 'var(--border-color)';
        });
    });

    /* =========================================
       4. Spatial Network / UMAP Particle Background
       ========================================= */
    const canvas = document.getElementById('data-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }
    
    window.addEventListener('resize', resize);

    let particles = [];
    const mouse = { x: -1000, y: -1000 };
    
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    // Reset mouse when scrolling or touching out of canvas
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    // We simulate 5 "Clusters" matching a single-cell UMAP layout
    const clusters = [
        { cx: width * 0.2, cy: height * 0.3, color: 'rgba(45, 212, 191, ' },  // Teal
        { cx: width * 0.8, cy: height * 0.6, color: 'rgba(65, 137, 240, ' },  // Blueish
        { cx: width * 0.4, cy: height * 0.8, color: 'rgba(168, 85, 247, ' },  // Purple
        { cx: width * 0.7, cy: height * 0.2, color: 'rgba(56, 189, 248, ' },  // Sky Blue
        { cx: width * 0.3, cy: height * 0.6, color: 'rgba(129, 140, 248, ' }  // Indigo
    ];

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Native drifting speed
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            // Dramatically increased radius so dots are highly visible
            this.radius = Math.random() * 2.5 + 2.0;
            
            // Assign a stable cluster for UMAP simulation
            const clusterIdx = Math.floor(Math.random() * clusters.length);
            this.cluster = clusters[clusterIdx];
            
            // Gaussian-like tightly grouped offset from cluster center for UMAP islands
            let radiusDist = Math.pow(Math.random(), 3) * 200; // tighter grouping
            let angle = Math.random() * Math.PI * 2;
            this.offsetX = Math.cos(angle) * radiusDist; 
            this.offsetY = Math.sin(angle) * radiusDist;
        }

        update() {
            // Update cluster centers dynamically on resize
            clusters[0].cx = width * 0.2; clusters[0].cy = height * 0.3;
            clusters[1].cx = width * 0.8; clusters[1].cy = height * 0.6;
            clusters[2].cx = width * 0.4; clusters[2].cy = height * 0.8;
            clusters[3].cx = width * 0.7; clusters[3].cy = height * 0.2;
            clusters[4].cx = width * 0.3; clusters[4].cy = height * 0.6;

            // Target position: drifting slightly around their cluster
            let targetX = this.cluster.cx + this.offsetX;
            let targetY = this.cluster.cy + this.offsetY;

            // Smoothly move towards target (pull factor)
            this.vx += (targetX - this.x) * 0.0005;
            this.vy += (targetY - this.y) * 0.0005;

            // Add slight randomness (Brownian motion)
            this.vx += (Math.random() - 0.5) * 0.1;
            this.vy += (Math.random() - 0.5) * 0.1;

            // Friction / Speed limit
            this.vx *= 0.98;
            this.vy *= 0.98;

            this.x += this.vx;
            this.y += this.vy;

            // Apply smooth scroll parallax effect
            this.y -= globalScrollVelocity * 0.5 * (this.radius / 1.5);

            // Mouse Repulsion Effect
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // If mouse is near, particles shatter away
            let maxDist = 150;
            if (distance < maxDist) {
                let force = (maxDist - distance) / maxDist;
                // Move away from mouse
                this.x -= (dx / distance) * force * 5;
                this.y -= (dy / distance) * force * 5;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            // Stable, bright alpha for pure data visualization look
            let alpha = Math.random() * 0.3 + 0.7; // 0.7 to 1.0 opacity
            ctx.fillStyle = this.cluster.color + alpha + ')';
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        let numParticles = calculateParticleCount();
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }
    }

    function calculateParticleCount() {
        // Thousands of particles for UMAP look
        let area = window.innerWidth * window.innerHeight;
        return Math.min(3000, Math.floor(area / 600));
    }

    // Main render loop
    function animate() {
        ctx.clearRect(0, 0, width, height); // Clear instead of trail
        
        // Decay scroll velocity smoothly
        globalScrollVelocity *= 0.9;
        if (Math.abs(globalScrollVelocity) < 0.1) globalScrollVelocity = 0;
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }
    
    // Start engine
    resize(); // Must be called after Particle class declaration
    animate();
});
