// ============================================
// ŞAHSƏDDIN İMANLI — Website Scripts
// ============================================

document.addEventListener('DOMContentLoaded', () => {

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
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();

        function renderCalendar() {
            calendarDays.innerHTML = '';
            calendarMonth.textContent = months[currentMonth] + ' ' + currentYear;

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
            // Bazar ertəsi = 0 üçün shift (JS-də Bazar=0)
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
                        const selectedDay = day;
                        const selectedMonth = months[currentMonth];
                        const selectedYear = currentYear;
                        const message = encodeURIComponent(
                            `Salam, sizinlə ${selectedDay} ${selectedMonth.toLowerCase()} ${selectedYear} tarixində onlayn və ya canlı seansa qoşulmaq istəyirəm. Günün hansı saatında uyğundur?`
                        );
                        window.open('https://wa.me/994518499998?text=' + message, '_blank');
                    });
                }

                calendarDays.appendChild(dayEl);
            }
        }

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
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.textContent;
                btn.textContent = 'Göndərilir...';
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
                    btn.textContent = 'Göndərildi!';
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
                    alert('Xəta baş verdi, zəhmət olmasa yenidən cəhd edin.');
                });
            }
        });
    }

    // Xüsusi validasiya mesajı
    document.querySelectorAll('#callForm input, #heroCallForm input').forEach(input => {
        input.addEventListener('invalid', () => {
            input.setCustomValidity('Zəhmət olmasa bu xananı doldurun');
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

});
