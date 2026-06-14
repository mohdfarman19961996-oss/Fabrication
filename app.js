document.addEventListener('DOMContentLoaded', () => {
    // 1. Header Scroll Styling
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Nav Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Change icon toggling
            const icon = navToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars-staggered';
            }
        });
        
        // Close menu when links are clicked on mobile
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
            });
        });
    }

    // 3. Active Nav Links on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 120)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 4. Gallery Image Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    // Trigger fade in animation
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transition = 'opacity 0.4s ease';
                    }, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 5. Lightbox Modal
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const triggers = document.querySelectorAll('.lightbox-trigger');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const imgSrc = trigger.getAttribute('href');
            const parent = trigger.closest('.gallery-hover-overlay');
            const title = parent.querySelector('.project-title').textContent;
            const category = parent.querySelector('.project-category').textContent;

            lightboxImg.src = imgSrc;
            lightboxCaption.textContent = `${category} - ${title}`;
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Stop scrolling
        });
    });

    const closeLightbox = () => {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // 6. Welding Sparks Canvas Animation (Hero Section Accent)
    const sparksContainer = document.querySelector('.sparks-container');
    if (sparksContainer) {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        sparksContainer.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        let width = canvas.width = sparksContainer.clientWidth;
        let height = canvas.height = sparksContainer.clientHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = sparksContainer.clientWidth;
            height = canvas.height = sparksContainer.clientHeight;
        });

        const particles = [];
        const maxParticles = 60;
        
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                // Sparks originate from lower center/right where the welding happens
                this.x = width * (0.5 + Math.random() * 0.3); 
                this.y = height * (0.6 + Math.random() * 0.2);
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.7) * 4 - 1; // drift left
                this.speedY = -Math.random() * 6 - 2; // fly upwards
                this.gravity = 0.12;
                this.alpha = 1;
                // Bright sparks color range (orange, yellow, cyan-blue arcs)
                this.color = Math.random() > 0.85 
                    ? `rgba(0, 210, 255, ${this.alpha})` // electrical arc cyan
                    : `rgba(255, ${Math.floor(Math.random() * 150) + 100}, 0, ${this.alpha})`; // orange/yellow spark
                this.decay = Math.random() * 0.015 + 0.01;
            }
            
            update() {
                this.x += this.speedX;
                this.speedY += this.gravity; // drop slightly due to gravity
                this.y += this.speedY;
                this.alpha -= this.decay;
                
                // Color update to fade nicely
                if (this.color.includes('255')) {
                    this.color = `rgba(255, 106, 0, ${this.alpha})`;
                } else {
                    this.color = `rgba(0, 210, 255, ${this.alpha})`;
                }
                
                if (this.alpha <= 0 || this.y > height || this.x < 0 || this.x > width) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                // Add minor glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color.includes('255') ? '#ff6a00' : '#00d2ff';
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    // 7. Form Submission Handling (WhatsApp Redirect with Auto-Hindi Translation)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "अनुवाद किया जा रहा है...";
            submitBtn.disabled = true;
            
            const name = document.getElementById('inquiry-name').value;
            const phone = document.getElementById('inquiry-phone').value;
            const workSelect = document.getElementById('inquiry-work');
            const workType = workSelect.options[workSelect.selectedIndex].text;
            const details = document.getElementById('inquiry-details').value;
            
            // 1. Map Work Type to Hindi
            const workTypeTranslations = {
                "Designer Gates": "डिज़ाइनर गेट (Designer Gate)",
                "Balcony / Window Grills": "बालकनी / खिड़की ग्रिल (Grill & Railings)",
                "Tin Shed Fabrication": "टीन शेड फैब्रिकेशन (Tin Shed)",
                "On-site Construction Work": "साइट पर वेल्डिंग का काम (On-site Work)",
                "Welding & Repairs": "रिपेयरिंग और वेल्डिंग (Repairs)",
                "Other Work": "अन्य काम (Other)"
            };
            const workTypeHindi = workTypeTranslations[workType] || workType;
            
            // Helper function to dynamically translate text to Hindi
            const translateToHindi = async (text) => {
                try {
                    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=hi&dt=t&q=${encodeURIComponent(text)}`);
                    const data = await res.json();
                    if (data && data[0]) {
                        return data[0].map(item => item[0]).join('');
                    }
                } catch (error) {
                    console.error("Translation error:", error);
                }
                return text; // Fallback if API fails
            };

            // 2. Translate Customer Name and Details description
            const translatedName = await translateToHindi(name);
            const translatedDetails = await translateToHindi(details);
            
            // 3. Format the WhatsApp message in pure Hindi
            const hindiMessage = `नमस्ते फ़रमान भाई,%0A%0Aआपकी वेबसाइट से काम के लिए नया मैसेज आया है:%0A%0A• *ग्राहक का नाम:* ${encodeURIComponent(translatedName)}%0A• *फ़ोन नंबर:* ${encodeURIComponent(phone)}%0A• *काम का प्रकार:* ${encodeURIComponent(workTypeHindi)}%0A• *विवरण (Details):* ${encodeURIComponent(translatedDetails)}`;
            
            // Target number: 919756094099 (Farman's number)
            const targetPhone = "919756094099"; 
            
            // Reset button state
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Open WhatsApp Web/App
            const whatsappUrl = `https://wa.me/${targetPhone}?text=${hindiMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});
