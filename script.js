// ============================================
// ŞAHSƏDDIN İMANLI — Website Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // === LANGUAGE SWITCHER ===
    let currentLang = localStorage.getItem('lang') || 'az';

    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;

        document.documentElement.lang = lang;
        currentLang = lang;
        localStorage.setItem('lang', lang);

        // Text content
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) el.textContent = t[key];
        });

        // HTML content (for <strong> tags etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            if (t[key]) el.innerHTML = t[key];
        });

        // Placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (t[key]) el.placeholder = t[key];
        });

        // Update active lang button
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });

        // Re-render calendar with new language
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof renderHeroCalendar === 'function') renderHeroCalendar();
    }

    // Lang switcher click
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => {
            applyTranslations(opt.dataset.lang);
        });
    });

    // === NAVBAR SCROLL ===
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section, .hero');

    window.addEventListener('scroll', () => {
        // Navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

    // === HAMBURGER MENU ===
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // === SMOOTH SCROLL ===
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // === SCROLL ANIMATIONS ===
    const animateElements = document.querySelectorAll('.animate-fade-up, .service-card, .problem-card, .contact-card, .faq-item, .format-card, .stat-item, .calendar-side, .blog-side, .blog-card, .calendar-wrapper, .about-image-col, .about-text-col, .section-header, .hero-form, .approach-banner, .highlight-item, .problem-disclaimer, .call-form-wrapper');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        el.classList.add('animate-fade-up');
        observer.observe(el);
    });

    // === COUNTER ANIMATION ===
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = formatNumber(Math.floor(current));
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = formatNumber(target);
                }
            };

            updateCounter();
        });
    }

    function formatNumber(num) {
        return num.toLocaleString('az-AZ');
    }

    const statsSection = document.querySelector('.stats-bar');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        statsObserver.observe(statsSection);
    }

    // === PROBLEM TABS ===
    const problemTabs = document.querySelectorAll('.problem-tab');
    const problemContents = document.querySelectorAll('.problem-content');

    problemTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            problemTabs.forEach(t => t.classList.remove('active'));
            problemContents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById('tab-' + targetTab).classList.add('active');
        });
    });

    // === FAQ ACCORDION ===
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all
            faqItems.forEach(i => i.classList.remove('active'));

            // Open clicked (if it wasn't active)
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // === CALENDAR ===
    const calendarDays = document.getElementById('calendarDays');
    const calendarMonth = document.getElementById('calendarMonth');
    const calendarPrev = document.getElementById('calendarPrev');
    const calendarNext = document.getElementById('calendarNext');

    if (calendarDays) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        window.renderCalendar = function() {
            const t = translations[currentLang];
            const months = t.cal_months;

            calendarDays.innerHTML = '';
            calendarMonth.textContent = months[currentMonth] + ' ' + currentYear;

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            const startDay = firstDay === 0 ? 6 : firstDay - 1;

            for (let i = 0; i < startDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'calendar-day empty';
                calendarDays.appendChild(empty);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                dayEl.textContent = day;
                dayEl.style.opacity = '0';
                dayEl.style.transform = 'scale(0.5)';
                dayEl.style.animation = `dayFadeIn 0.3s ease forwards ${(startDay + day) * 20}ms`;

                const thisDate = new Date(currentYear, currentMonth, day);
                thisDate.setHours(0, 0, 0, 0);

                if (thisDate.getTime() === today.getTime()) {
                    dayEl.classList.add('today');
                }

                if (thisDate <= today) {
                    dayEl.classList.add('disabled');
                } else {
                    dayEl.addEventListener('click', () => {
                        const msgTemplate = t.cal_whatsapp_msg;
                        const msg = msgTemplate
                            .replace('{day}', day)
                            .replace('{month}', months[currentMonth].toLowerCase())
                            .replace('{year}', currentYear);
                        window.open('https://wa.me/994518499998?text=' + encodeURIComponent(msg), '_blank');
                    });
                }

                calendarDays.appendChild(dayEl);
            }
        };

        calendarPrev.addEventListener('click', () => {
            const minMonth = today.getMonth();
            const minYear = today.getFullYear();
            if (currentYear > minYear || (currentYear === minYear && currentMonth > minMonth)) {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                renderCalendar();
            }
        });

        calendarNext.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderCalendar();
        });

        renderCalendar();
    }

    // === HERO CALENDAR ===
    const heroCalendarDays = document.getElementById('heroCalendarDays');
    const heroCalendarMonth = document.getElementById('heroCalendarMonth');
    const heroCalendarPrev = document.getElementById('heroCalendarPrev');
    const heroCalendarNext = document.getElementById('heroCalendarNext');

    if (heroCalendarDays) {
        const today2 = new Date();
        today2.setHours(0, 0, 0, 0);
        let hMonth = today2.getMonth();
        let hYear = today2.getFullYear();

        window.renderHeroCalendar = function() {
            const t = translations[currentLang];
            const months = t.cal_months;

            heroCalendarDays.innerHTML = '';
            heroCalendarMonth.textContent = months[hMonth] + ' ' + hYear;

            const firstDay = new Date(hYear, hMonth, 1).getDay();
            const daysInMonth = new Date(hYear, hMonth + 1, 0).getDate();
            const startDay = firstDay === 0 ? 6 : firstDay - 1;

            for (let i = 0; i < startDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'calendar-day empty';
                heroCalendarDays.appendChild(empty);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const dayEl = document.createElement('div');
                dayEl.className = 'calendar-day';
                dayEl.textContent = day;
                dayEl.style.opacity = '0';
                dayEl.style.transform = 'scale(0.5)';
                dayEl.style.animation = `dayFadeIn 0.3s ease forwards ${(startDay + day) * 20}ms`;

                const thisDate = new Date(hYear, hMonth, day);
                thisDate.setHours(0, 0, 0, 0);

                if (thisDate.getTime() === today2.getTime()) {
                    dayEl.classList.add('today');
                }

                if (thisDate <= today2) {
                    dayEl.classList.add('disabled');
                } else {
                    dayEl.addEventListener('click', () => {
                        const msgTemplate = t.cal_whatsapp_msg;
                        const msg = msgTemplate
                            .replace('{day}', day)
                            .replace('{month}', months[hMonth].toLowerCase())
                            .replace('{year}', hYear);
                        window.open('https://wa.me/994518499998?text=' + encodeURIComponent(msg), '_blank');
                    });
                }

                heroCalendarDays.appendChild(dayEl);
            }
        };

        heroCalendarPrev.addEventListener('click', () => {
            const minMonth = today2.getMonth();
            const minYear = today2.getFullYear();
            if (hYear > minYear || (hYear === minYear && hMonth > minMonth)) {
                hMonth--;
                if (hMonth < 0) { hMonth = 11; hYear--; }
                renderHeroCalendar();
            }
        });

        heroCalendarNext.addEventListener('click', () => {
            hMonth++;
            if (hMonth > 11) { hMonth = 0; hYear++; }
            renderHeroCalendar();
        });

        renderHeroCalendar();
    }

    // === DISCLAIMER MODAL ===
    const disclaimerOverlay = document.getElementById('disclaimerOverlay');
    const disclaimerClose = document.getElementById('disclaimerClose');
    const disclaimerAccept = document.getElementById('disclaimerAccept');

    function closeDisclaimer() {
        if (disclaimerOverlay) {
            disclaimerOverlay.classList.add('hidden');
        }
    }

    if (disclaimerClose) disclaimerClose.addEventListener('click', closeDisclaimer);
    if (disclaimerAccept) disclaimerAccept.addEventListener('click', closeDisclaimer);
    if (disclaimerOverlay) {
        disclaimerOverlay.addEventListener('click', (e) => {
            if (e.target === disclaimerOverlay) closeDisclaimer();
        });
    }

    // === FORM SUBMISSION ===
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw869YoQXmQIJDknvOoLkBjetn7dT3BF8W7GXOgHhlk8FbAGclnCbDHDKIgX5S-UHr1/exec';

    function handleFormSubmit(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const ad = form.querySelector('input[name="ad"]').value.trim();
            const soyad = form.querySelector('input[name="soyad"]').value.trim();
            const telefon = form.querySelector('input[name="telefon"]').value.trim();
            const tarixInput = form.querySelector('input[name="tarix"]');
            const tarix = tarixInput ? tarixInput.value : '';

            if (ad && soyad && telefon) {
                const t = translations[currentLang];
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = t.form_sending;
                btn.disabled = true;

                // Google Sheets-ə göndər
                let url = GOOGLE_SHEET_URL
                    + '?ad=' + encodeURIComponent(ad)
                    + '&soyad=' + encodeURIComponent(soyad)
                    + '&telefon=' + encodeURIComponent('+994' + telefon);
                if (tarix) {
                    url += '&seansGunu=' + encodeURIComponent(tarix);
                }
                fetch(url, { mode: 'no-cors' }).then(() => {
                    btn.textContent = t.form_sent;
                    btn.style.background = '#28a745';
                    form.reset();
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                }).catch(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                    alert(t.form_error);
                });
            }
        });
    }

    // Xüsusi validasiya mesajı
    document.querySelectorAll('#callForm input, #heroCallForm input').forEach(input => {
        input.addEventListener('invalid', () => {
            const t = translations[currentLang];
            input.setCustomValidity(t.form_required);
        });
        input.addEventListener('input', () => {
            input.setCustomValidity('');
        });
    });

    const callForm = document.getElementById('callForm');
    if (callForm) handleFormSubmit(callForm);

    const heroCallForm = document.getElementById('heroCallForm');
    if (heroCallForm) handleFormSubmit(heroCallForm);

    // === PARTICLES ===
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: rgba(45, 129, 87, ${Math.random() * 0.3 + 0.05});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 10 + 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }

    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0%, 100% {
                transform: translate(0, 0) scale(1);
                opacity: 0.3;
            }
            25% {
                transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * -60}px) scale(1.2);
                opacity: 0.6;
            }
            50% {
                transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * -80}px) scale(0.8);
                opacity: 0.2;
            }
            75% {
                transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * -40}px) scale(1.1);
                opacity: 0.5;
            }
        }
    `;
    document.head.appendChild(style);

    // Apply saved language on load
    if (currentLang !== 'az') {
        applyTranslations(currentLang);
    } else {
        // Just mark AZ as active
        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === 'az');
        });
    }

    // === FAYDALI MƏLUMATLAR — CONTENTFUL BLOG ===
    const CONTENTFUL_SPACE = 'q3fe87ca4p3k';
    const CONTENTFUL_TOKEN = 'uyQ8WH4Rhs40Y1OBAoXI9nzQGunrNUAtEU4lizTZL-o';

    async function fetchBlogPosts() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;
        grid.innerHTML = '<p style="color:#999;font-size:0.9rem;">Yüklənir...</p>';
        try {
            const res = await fetch(
                `https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE}/entries?access_token=${CONTENTFUL_TOKEN}&content_type=blogPost&include=1&order=-sys.createdAt`
            );
            const data = await res.json();
            if (!data.items || data.items.length === 0) {
                grid.innerHTML = '<p style="color:#999;font-size:0.9rem;">Hələ heç bir məlumat əlavə edilməyib.</p>';
                return;
            }
            const assets = {};
            if (data.includes && data.includes.Asset) {
                data.includes.Asset.forEach(a => {
                    assets[a.sys.id] = 'https:' + a.fields.file.url;
                });
            }
            grid.innerHTML = data.items.map(item => {
                const f = item.fields;
                const imgId = f.image && f.image.sys ? f.image.sys.id : null;
                const imgUrl = imgId ? assets[imgId] : null;
                return `
                    <div class="blog-post-card">
                        ${imgUrl ? `<img src="${imgUrl}" alt="${f.title}">` : `<div style="height:180px;background:#f0f7f3;display:flex;align-items:center;justify-content:center;color:#aaa;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`}
                        <div class="blog-post-info">
                            <h4>${f.title}</h4>
                            <span class="blog-post-date">${f.date || ''}</span>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (err) {
            grid.innerHTML = '<p style="color:#999;font-size:0.9rem;">Məlumatlar yüklənə bilmədi.</p>';
        }
    }

    fetchBlogPosts();

    // === GİRİŞ — Contentful admin panelinə yönləndir ===
    const navLoginBtn = document.getElementById('navLoginBtn');
    if (navLoginBtn) {
        navLoginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://app.contentful.com', '_blank');
        });
    }

});
