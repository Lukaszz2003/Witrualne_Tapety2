document.addEventListener('DOMContentLoaded', () => {
    // 1. POBRANIE ELEMENTÓW
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const projectCards = document.querySelectorAll('.project-card');
    const customCursor = document.getElementById('custom-cursor');
    const heroBtn = document.querySelector('.btn-primary');

    // 2. LOGIKA KURSORA
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

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

    // 3. INTERAKCJE KART (Tilt + Hover + Lightbox)
    projectCards.forEach(card => {
        const img = card.querySelector('.project-img');
        const wrapper = card.querySelector('.project-image-wrapper');

        card.addEventListener('mouseenter', () => {
            if (customCursor) customCursor.classList.add('visible');
        });

        card.addEventListener('mouseleave', () => {
            if (customCursor) customCursor.classList.remove('visible');
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0)';
            if (img) img.style.transform = 'scale(1) translateZ(0px)';
            if (wrapper) {
                wrapper.style.setProperty('--mouse-x', `50%`);
                wrapper.style.setProperty('--mouse-y', `50%`);
            }
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const xPercent = ((e.clientX - rect.left) / rect.width * 100).toFixed(2);
            const yPercent = ((e.clientY - rect.top) / rect.height * 100).toFixed(2);
            
            if (wrapper) {
                wrapper.style.setProperty('--mouse-x', `${xPercent}%`);
                wrapper.style.setProperty('--mouse-y', `${yPercent}%`);
            }

            const x = ((e.clientX - rect.left) / rect.width) - 0.5;
            const y = ((e.clientY - rect.top) / rect.height) - 0.5;
            card.style.transform = `rotateX(${(y * 15).toFixed(2)}deg) rotateY(${(-x * 15).toFixed(2)}deg) translateY(-8px)`;
            if (img) img.style.transform = 'scale(1.15) translateZ(25px)';
        });

        card.addEventListener('click', () => {
            if (!img || !lightbox || !lightboxImg) return;
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            if (customCursor) customCursor.classList.remove('visible');
        });
    });

    // 4. ZAMYKANIE LIGHTBOXA
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                lightbox.style.display = 'none';
                document.body.style.overflow = '';
                setTimeout(() => { if (lightboxImg) lightboxImg.src = ''; }, 400);
            }
        });
    }

    // 5. OBSŁUGA CTA
    if (heroBtn && customCursor) {
        heroBtn.addEventListener('mouseenter', () => customCursor.classList.add('visible'));
        heroBtn.addEventListener('mouseleave', () => customCursor.classList.remove('visible'));
    }

    // 6. OBSŁUGA PRZYCISKU "POKAŻ WIĘCEJ"
    const loadMoreBtns = document.querySelectorAll('.load-more-btn');
    loadMoreBtns.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const grid = document.getElementById(targetId);
            if (grid) {
                const hiddenItems = grid.querySelectorAll('.project-card.hidden');
                hiddenItems.forEach(item => item.classList.remove('hidden'));
                button.style.display = 'none'; // Ukryj przycisk po odsłonięciu
            }
        });
    });
});