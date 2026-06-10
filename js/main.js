document.addEventListener('DOMContentLoaded', () => {
    // 1. POBRANIE ELEMENTÓW
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const customCursor = document.getElementById('custom-cursor');

if (customCursor) {
    customCursor.classList.add('visible'); // Kursor jest widoczny zawsze
}

    // 2. LOGIKA KURSORA
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; });

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

    // 3. FUNKCJA PAGINACJI ZE STRZAŁKAMI
    function setupPagination(gridId, paginationId, itemsPerPage = 6) {
        const grid = document.getElementById(gridId);
        const pagination = document.getElementById(paginationId);
        if (!grid || !pagination) return;
        
        const cards = Array.from(grid.querySelectorAll('.project-card'));
        const totalPages = Math.ceil(cards.length / itemsPerPage);
        let currentPage = 1;

        function showPage(page) {
            currentPage = page;
            cards.forEach((card, index) => {
                card.style.display = (index >= (page - 1) * itemsPerPage && index < page * itemsPerPage) ? 'block' : 'none';
            });
            
            renderControls();
            // Płynny scroll do nagłówka sekcji
            window.scrollTo({ top: grid.parentElement.offsetTop - 100, behavior: 'smooth' });
        }

        function renderControls() {
            pagination.innerHTML = '';

            // Strzałka w lewo
            const prevBtn = document.createElement('div');
            prevBtn.className = `page-num ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.innerHTML = '&lt;';
            prevBtn.onclick = () => { if (currentPage > 1) showPage(currentPage - 1); };
            pagination.appendChild(prevBtn);

            // Numery stron
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('div');
                btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => showPage(i);
                pagination.appendChild(btn);
            }

            // Strzałka w prawo
            const nextBtn = document.createElement('div');
            nextBtn.className = `page-num ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.innerHTML = '&gt;';
            nextBtn.onclick = () => { if (currentPage < totalPages) showPage(currentPage + 1); };
            pagination.appendChild(nextBtn);
        }
        
        showPage(1);
    }

    // Inicjalizacja paginacji
    setupPagination('mobile-grid', 'mobile-pagination');
    setupPagination('desktop-grid', 'desktop-pagination');

   // 4. INTERAKCJE KART
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    const img = card.querySelector('.project-img');

    // Kursor jest już widoczny (dzięki linii 7), więc tutaj dodajemy tylko klasę 'hover'
   card.addEventListener('mouseenter', () => { 
    if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(1.5)'; 
});

card.addEventListener('mouseleave', () => {
    if (customCursor) customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
    // ... reszta kodu
});
    
    // ... reszta kodu (mousemove i click) bez zmian
});;

    // 5. ZAMYKANIE LIGHTBOXA
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});