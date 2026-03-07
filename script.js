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

    // === FAYDALI MƏLUMATLAR — BLOG SYSTEM ===
    function getBlogPosts() {
        try {
            return JSON.parse(localStorage.getItem('blogPosts') || '[]');
        } catch { return []; }
    }

    function saveBlogPosts(posts) {
        localStorage.setItem('blogPosts', JSON.stringify(posts));
    }

    function renderBlogGrid() {
        const grid = document.getElementById('blogGrid');
        if (!grid) return;
        const posts = getBlogPosts();
        if (posts.length === 0) {
            grid.innerHTML = '<p style="color:#999;font-size:0.9rem;">Hələ heç bir məlumat əlavə edilməyib.</p>';
            return;
        }
        grid.innerHTML = posts.map(post => `
            <div class="blog-post-card">
                ${post.image ? `<img src="${post.image}" alt="${post.title}">` : `<div style="height:180px;background:#f0f7f3;display:flex;align-items:center;justify-content:center;color:#aaa;"><i class="fas fa-image" style="font-size:2rem;"></i></div>`}
                <div class="blog-post-info">
                    <h4>${post.title}</h4>
                    <span class="blog-post-date">${post.date}</span>
                </div>
            </div>
        `).join('');
    }

    renderBlogGrid();

    // === ADMIN LOGIN ===
    const adminTriggerBtn = document.getElementById('adminTriggerBtn');
    const adminLoginOverlay = document.getElementById('adminLoginOverlay');
    const adminLoginClose = document.getElementById('adminLoginClose');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const togglePass = document.getElementById('togglePass');

    if (adminTriggerBtn) {
        adminTriggerBtn.addEventListener('click', () => {
            adminLoginOverlay.classList.add('active');
            loginError.textContent = '';
        });
    }

    if (adminLoginClose) {
        adminLoginClose.addEventListener('click', () => {
            adminLoginOverlay.classList.remove('active');
        });
    }

    if (adminLoginOverlay) {
        adminLoginOverlay.addEventListener('click', (e) => {
            if (e.target === adminLoginOverlay) adminLoginOverlay.classList.remove('active');
        });
    }

    if (togglePass) {
        togglePass.addEventListener('click', () => {
            const inp = document.getElementById('adminPassword');
            const icon = togglePass.querySelector('i');
            if (inp.type === 'password') {
                inp.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                inp.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value.trim();
            const password = document.getElementById('adminPassword').value;
            if (username === 'Novokuzneck' && password === 'Dudenge1!') {
                adminLoginOverlay.classList.remove('active');
                adminLoginForm.reset();
                openAdminPanel();
            } else {
                loginError.textContent = 'İstifadəçi adı və ya şifrə yanlışdır.';
            }
        });
    }

    // === ADMIN PANEL ===
    const adminPanelOverlay = document.getElementById('adminPanelOverlay');
    const adminPanelClose = document.getElementById('adminPanelClose');
    const adminPostForm = document.getElementById('adminPostForm');
    const adminPostsList = document.getElementById('adminPostsList');
    const adminCancelEdit = document.getElementById('adminCancelEdit');
    let editImageData = '';

    function openAdminPanel() {
        adminPanelOverlay.classList.add('active');
        renderAdminList();
        resetAdminForm();
    }

    if (adminPanelClose) {
        adminPanelClose.addEventListener('click', () => {
            adminPanelOverlay.classList.remove('active');
        });
    }

    if (adminPanelOverlay) {
        adminPanelOverlay.addEventListener('click', (e) => {
            if (e.target === adminPanelOverlay) adminPanelOverlay.classList.remove('active');
        });
    }

    function resetAdminForm() {
        adminPostForm.reset();
        document.getElementById('editPostId').value = '';
        document.getElementById('adminImgPreview').innerHTML = '';
        document.querySelector('.admin-save-btn').textContent = 'Əlavə et';
        adminCancelEdit.style.display = 'none';
        editImageData = '';
    }

    // Image preview
    const postImageInput = document.getElementById('postImage');
    if (postImageInput) {
        postImageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    editImageData = ev.target.result;
                    document.getElementById('adminImgPreview').innerHTML = `<img src="${editImageData}" alt="preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Save / Edit post
    if (adminPostForm) {
        adminPostForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('postTitle').value.trim();
            const date = document.getElementById('postDate').value.trim();
            const editId = document.getElementById('editPostId').value;
            const posts = getBlogPosts();

            if (editId) {
                const idx = posts.findIndex(p => p.id === editId);
                if (idx !== -1) {
                    posts[idx].title = title;
                    posts[idx].date = date;
                    if (editImageData) posts[idx].image = editImageData;
                }
            } else {
                const newPost = {
                    id: Date.now().toString(),
                    title,
                    date,
                    image: editImageData || ''
                };
                posts.unshift(newPost);
            }

            saveBlogPosts(posts);
            renderBlogGrid();
            renderAdminList();
            resetAdminForm();
        });
    }

    if (adminCancelEdit) {
        adminCancelEdit.addEventListener('click', resetAdminForm);
    }

    function renderAdminList() {
        if (!adminPostsList) return;
        const posts = getBlogPosts();
        if (posts.length === 0) {
            adminPostsList.innerHTML = '<p style="color:#999;font-size:0.85rem;">Heç bir məqalə yoxdur.</p>';
            return;
        }
        adminPostsList.innerHTML = posts.map(post => `
            <div class="admin-post-item" data-id="${post.id}">
                ${post.image ? `<img src="${post.image}" alt="">` : `<div style="width:60px;height:45px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image" style="color:#ccc;"></i></div>`}
                <div class="admin-post-item-info">
                    <h5>${post.title}</h5>
                    <span>${post.date}</span>
                </div>
                <div class="admin-post-item-actions">
                    <button class="admin-edit-btn" onclick="editPost('${post.id}')"><i class="fas fa-pen"></i></button>
                    <button class="admin-delete-btn" onclick="deletePost('${post.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
    }

    // Global functions for inline onclick
    window.editPost = function(id) {
        const posts = getBlogPosts();
        const post = posts.find(p => p.id === id);
        if (!post) return;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postDate').value = post.date;
        document.getElementById('editPostId').value = post.id;
        editImageData = post.image || '';
        if (post.image) {
            document.getElementById('adminImgPreview').innerHTML = `<img src="${post.image}" alt="preview">`;
        }
        document.querySelector('.admin-save-btn').textContent = 'Yenilə';
        adminCancelEdit.style.display = 'inline-block';
    };

    window.deletePost = function(id) {
        if (!confirm('Bu məqaləni silmək istədiyinizə əminsiniz?')) return;
        let posts = getBlogPosts();
        posts = posts.filter(p => p.id !== id);
        saveBlogPosts(posts);
        renderBlogGrid();
        renderAdminList();
    };

});
