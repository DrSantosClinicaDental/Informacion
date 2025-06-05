// Guarda esto como script.js (o reemplaza el contenido de tu script.js actual)
document.addEventListener('DOMContentLoaded', function() {
    const mainHeader = document.getElementById('mainHeader');
    const mainNav = document.getElementById('mainNav'); // Asegúrate de que tu nav tenga este ID
    const heroSection = document.getElementById('hero'); 
    const hotSalePopup = document.getElementById('hotSalePopup');
    const closePopupBtn = document.getElementById('closePopup');
    const translateBtn = document.getElementById('translateBtn');
    const currentYearSpan = document.getElementById('currentYear');
    const pageHeaderSpacer = document.querySelector('.page-header-spacer');

    if(currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
        // Actualizar también en el objeto translations si es necesario dinámicamente
        if (typeof translations !== 'undefined' && translations.es && translations.es.footerCopyright) {
            translations.es.footerCopyright = `© ${new Date().getFullYear()} Dr. Santos Clínica Dental. Todos los derechos reservados.`;
        }
        if (typeof translations !== 'undefined' && translations.en && translations.en.footerCopyright) {
            translations.en.footerCopyright = `© ${new Date().getFullYear()} Dr. Santos Dental Clinic. All rights reserved.`;
        }
    }
    
    function adjustLayout() {
        let headerHeight = 0;
        let navHeight = 0;

        if (mainHeader) {
            headerHeight = mainHeader.offsetHeight;
        }
        if (mainNav) {
            mainNav.style.top = `${headerHeight}px`;
            navHeight = mainNav.offsetHeight;
        }

        const totalOffset = headerHeight + navHeight;

        if (heroSection && document.body.classList.contains('home-page')) {
            heroSection.style.marginTop = `${totalOffset}px`;
        }
        if (pageHeaderSpacer) {
            pageHeaderSpacer.style.height = `${totalOffset}px`;
        }
    }

    if (hotSalePopup) {
        if (!localStorage.getItem('popupShownDrSantosV3')) { // Nuevo nombre para resetear si es necesario
            setTimeout(function() {
                hotSalePopup.classList.add('active');
                localStorage.setItem('popupShownDrSantosV3', 'true');
            }, 3500);
        }
        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', function() { hotSalePopup.classList.remove('active'); });
        }
        hotSalePopup.addEventListener('click', function(e) {
            if (e.target === this) { hotSalePopup.classList.remove('active'); }
        });
    }

    window.addEventListener('scroll', function() {
        if (mainHeader) { mainHeader.classList.toggle('scrolled', window.scrollY > 30); }
    });
    
    window.addEventListener('load', adjustLayout); // Asegurar que se ejecute después de que todo cargue
    window.addEventListener('resize', adjustLayout);
    setTimeout(adjustLayout, 300); // Reajuste después de posible carga de fuentes

    // FAQ toggle (Unificado para cualquier estructura de FAQ)
    document.querySelectorAll('.faq-item h3').forEach(questionElement => {
      questionElement.addEventListener('click', function() {
        const faqItem = this.parentElement; // El .faq-item
        faqItem.classList.toggle('active');
        // Actualizar ARIA attribute para accesibilidad
        const isExpanded = faqItem.classList.contains('active');
        this.setAttribute('aria-expanded', isExpanded);
        const answer = faqItem.querySelector('p'); // Asumiendo que la respuesta es un <p>
        if (answer) {
            answer.setAttribute('aria-hidden', !isExpanded);
        }
      });
      // Para accesibilidad con teclado
      questionElement.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
          }
      });
    });

    function reveal() {
        const reveals = document.querySelectorAll('.reveal');
        for (let i = 0; i < reveals.length; i++) {
            const windowHeight = window.innerHeight;
            const elementTop = reveals[i].getBoundingClientRect().top;
            const elementVisible = 80;
            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add('active');
            }
        }
    }
    window.addEventListener('scroll', reveal);
    reveal();

    // Traducciones
    if (typeof translations !== 'undefined' && translateBtn) {
        function changeLanguage(lang) {
            document.documentElement.lang = lang;
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key] !== undefined) {
                    // MODIFICACIÓN IMPORTANTE AQUÍ:
                    el.innerHTML = translations[lang][key]; // Usar innerHTML para renderizar tags como <strong>
                }
            });
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                if (translations[lang] && translations[lang][key] !== undefined) {
                    el.setAttribute('placeholder', translations[lang][key]);
                }
            });
            if (translations[lang] && translations[lang]['title'] !== undefined) {
                document.title = translations[lang]['title'];
            }
            document.querySelectorAll('option[data-i18n]').forEach(el => { // Para options en selects
                const key = el.getAttribute('data-i18n');
                if (translations[lang] && translations[lang][key] !== undefined) {
                    el.innerHTML = translations[lang][key];
                }
            });
            localStorage.setItem('preferredLangDrSantos', lang);
        }

        translateBtn.addEventListener('click', function() {
            const currentLangStored = localStorage.getItem('preferredLangDrSantos') || 'es';
            const newLang = currentLangStored === 'es' ? 'en' : 'es';
            changeLanguage(newLang);
            const spanInsideBtn = this.querySelector('span');
            if (spanInsideBtn) { // Verificar que el span existe
                 spanInsideBtn.textContent = newLang === 'es' ? 'ES/EN' : 'EN/ES';
            }
        });

        const savedLang = localStorage.getItem('preferredLangDrSantos') || 'es';
        changeLanguage(savedLang);
        const spanInsideTranslateBtn = translateBtn.querySelector('span');
        if (spanInsideTranslateBtn) {
             spanInsideTranslateBtn.textContent = savedLang === 'es' ? 'ES/EN' : 'EN/ES';
        }
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === "#") return; // Evitar error si es solo #
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let offset = 0;
                if (mainHeader) offset += mainHeader.offsetHeight;
                if (mainNav && getComputedStyle(mainNav).position === 'sticky') offset += mainNav.offsetHeight;
                
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset - 10;
                
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // Marcar pestaña activa
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (mainNav) {
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.classList.remove('active-tab');
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active-tab');
            }
        });
    }
    if (currentPage === "index.html" || currentPage === "") { // Considerar raíz también
        document.body.classList.add('home-page');
    }
    adjustLayout(); // Llamada final para asegurar el layout después de todo
});
