document.addEventListener('DOMContentLoaded', () => {
    // 1. POBRANIE ELEMENTÓW INTERFEJSU
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const projectCards = document.querySelectorAll('.project-card');
    const customCursor = document.getElementById('custom-cursor');
    const heroBtn = document.querySelector('.btn-primary');

    // 2. LOGIKA SPERSONALIZOWANEGO KURSORA (CELOWNIKA)
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    // Stałe przechwytywanie współrzędnych myszy na ekranie
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Płynna animacja podążania (smoothing) z czułością ustawioną na 0.2
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        if (customCursor) {
            customCursor.style.left = `${cursorX}px`;
            customCursor.style.top = `${cursorY}px`;
        }
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // 3. REAKCJA CELOWNIKA NA GŁÓWNY PRZYCISK (CTA) NA STRONIE GŁÓWNEJ
    if (heroBtn && customCursor) {
        heroBtn.addEventListener('mouseenter', () => {
            customCursor.classList.add('visible');
        });
        heroBtn.addEventListener('mouseleave', () => {
            customCursor.classList.remove('visible');
        });
    }

    // 4. ZAAWANSOWANA INTERAKCJA HOLOGRAFICZNA 3D (SHINE & POP-OUT)
    projectCards.forEach(card => {
        const img = card.querySelector('.project-img');
        const wrapper = card.querySelector('.project-image-wrapper');

        card.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('visible');
        });

        card.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('visible');
            
            // Miękki powrót wszystkich warstw do absolutnego stanu zero
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
            if (img) img.style.transform = 'scale(1) translateZ(0px)';
            if (wrapper) {
                wrapper.style.setProperty('--mouse-x', `50%`);
                wrapper.style.setProperty('--mouse-y', `50%`);
            }
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Obliczanie pozycji myszki względem karty (w pikselach i procentach)
            const mouseXRelative = e.clientX - rect.left;
            const mouseYRelative = e.clientY - rect.top;
            
            const xPercent = (mouseXRelative / rect.width * 100).toFixed(2);
            const yPercent = (mouseYRelative / rect.height * 100).toFixed(2);
            
            // Przekazujemy pozycję do CSS dla dynamicznego efektu odbicia światła (Shine Overlay)
            if (wrapper) {
                wrapper.style.setProperty('--mouse-x', `${xPercent}%`);
                wrapper.style.setProperty('--mouse-y', `${yPercent}%`);
            }

            // Obliczanie kąta wychylenia bryły 3D (Skala od -0.5 do 0.5)
            const x = (mouseXRelative / rect.width) - 0.5;
            const y = (mouseYRelative / rect.height) - 0.5;
            
            const tiltX = (y * 15).toFixed(2); // Wychylenie do 15 stopni dla pełnej ekspresji
            const tiltY = (-x * 15).toFixed(2);
            
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
            
            // Maksymalny POP-OUT: Obraz głęboko ucieka w głąb, 
            // podczas gdy napisy .project-info (dzięki CSS translateZ) lewitują nad nim.
            if (img) {
                img.style.transform = 'scale(1.15) translateZ(25px)';
            }
        });

        // Otwieranie pełnoekranowego Lightboxa
        card.addEventListener('click', () => {
            if (!img || !lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            if (customCursor) customCursor.classList.remove('visible'); 
            document.body.style.overflow = 'hidden';
        });
    });

    // 5. OBSŁUGA ZAMYKANIA LIGHTBOXA (KLIKNIĘCIE W DOWOLNE MIEJSCE)
    if (lightbox) {
        lightbox.addEventListener('click', () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = ''; // Przywrócenie skrolowania strony
            
            // Czyszczenie źródła obrazu po zakończeniu animacji (brak mrugania)
            setTimeout(() => { 
                if (lightboxImg) lightboxImg.src = ''; 
            }, 400);
        });
    }
});