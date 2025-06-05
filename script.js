document.addEventListener('DOMContentLoaded', function() {
    const mainHeader = document.getElementById('mainHeader');
    const mainNav = document.querySelector('.main-nav');
    const hotSalePopup = document.getElementById('hotSalePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const translateBtn = document.getElementById('translateBtn');
    const faqItems = document.querySelectorAll('.faq-item h3'); // Para FAQ en index.html
    const pageHeaderSpacer = document.querySelector('.page-header-spacer'); // Para páginas internas

    // Ajustar dinámicamente el 'top' del nav y el 'height' del spacer
    function adjustStickyNav() {
        if (mainHeader && mainNav) {
            const headerHeight = mainHeader.offsetHeight;
            mainNav.style.top = `${headerHeight}px`;
            if (pageHeaderSpacer) {
                 pageHeaderSpacer.style.height = `${headerHeight + mainNav.offsetHeight}px`;
            }
            // Ajustar el margin-top del hero en la página principal
            const heroSection = document.querySelector('.hero');
            if (heroSection && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') { // Asumiendo que index.html es la raíz
                heroSection.style.marginTop = `${headerHeight + mainNav.offsetHeight}px`;
            }
        } else if (mainHeader && pageHeaderSpacer) { // Si no hay .main-nav (ej. en páginas sin él)
            pageHeaderSpacer.style.height = `${mainHeader.offsetHeight}px`;
             const heroSection = document.querySelector('.hero');
            if (heroSection && window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                heroSection.style.marginTop = `${mainHeader.offsetHeight}px`;
            }
        }
    }

    // Popup (conservado y adaptado)
    if (hotSalePopup) {
        if (!localStorage.getItem('popupShownDrSantos')) { // Usar un nombre específico para no interferir con otros sitios
            setTimeout(function() {
                hotSalePopup.classList.add('active');
                localStorage.setItem('popupShownDrSantos', 'true');
            }, 3000);
        }
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() {
                hotSalePopup.classList.remove('active');
            });
        }
        hotSalePopup.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    }

    // Header scroll effect (conservado)
    window.addEventListener('scroll', function() {
        if (mainHeader) {
            if (window.scrollY > 50) {
                mainHeader.classList.add('scrolled');
            } else {
                mainHeader.classList.remove('scrolled');
            }
        }
    });
    
    // Ajustar nav y hero margin en carga y resize
    adjustStickyNav();
    window.addEventListener('resize', adjustStickyNav);


    // FAQ toggle (adaptado para funcionar en cualquier página que tenga la estructura)
    document.querySelectorAll('.faq-item h3').forEach(item => {
      item.addEventListener('click', function() {
        this.parentElement.classList.toggle('active');
      });
    });
    // Para FAQ en páginas dedicadas (si la estructura es la misma)
    document.querySelectorAll('.content-section .faq-item h3').forEach(item => {
      item.addEventListener('click', function() {
        this.parentElement.classList.toggle('active');
      });
    });


    // Scroll reveal (conservado)
    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 100; // Umbral de visibilidad
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();

    // Traducciones (conservado y adaptado)
    // El objeto 'translations' debe estar definido en cada HTML o en un JS global
    if (typeof translations !== 'undefined' && translateBtn) {
        function changeLanguage(lang) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (translations[lang] && translations[lang][key]) {
                    el.setAttribute('placeholder', translations[lang][key]);
                }
            });
            if (translations[lang] && translations[lang]['title']) {
                document.title = translations[lang]['title'];
            }
            document.querySelectorAll('option[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key]) {
                    el.textContent = translations[lang][key];
                }
            });
            localStorage.setItem('preferredLangDrSantos', lang); // Nombre específico
        }

        translateBtn.addEventListener('click', function() {
            const currentLang = localStorage.getItem('preferredLangDrSantos') || 'es';
            const newLang = currentLang === 'es' ? 'en' : 'es';
            changeLanguage(newLang);
            this.querySelector('span').textContent = newLang === 'es' ? 'ES/EN' : 'EN/ES';
        });

        const savedLang = localStorage.getItem('preferredLangDrSantos') || 'es';
        changeLanguage(savedLang);
        translateBtn.querySelector('span').textContent = savedLang === 'es' ? 'ES/EN' : 'EN/ES';
    }

    // Smooth scroll (conservado)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Ajuste para header fijo y nav pegajoso
                let offset = 0;
                if (mainHeader) offset += mainHeader.offsetHeight;
                if (mainNav && getComputedStyle(mainNav).position === 'sticky') offset += mainNav.offsetHeight;

                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Marcar pestaña activa en la navegación
    const currentPage = window.location.pathname.split("/").pop();
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active-tab');
            }
        });
    }
});
