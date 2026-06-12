document.addEventListener('DOMContentLoaded', () => {
    // 1. POBRANIE ELEMENTÓW
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const customCursor = document.getElementById('custom-cursor');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (customCursor) {
        customCursor.classList.add('visible');
    }

    // 2. MENU HAMBURGER
    if (hamburger && navLinks) {
        hamburger.style.pointerEvents = 'auto'; 
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('open');
        });

        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('open');
            });
        });
    }

    // 3. LOGIKA KURSORA
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

    // 4. EFEKTY INTERAKCJI: KARTY (PARALAKSA 3D) ORAZ HERO
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const img = card.querySelector('.project-img');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform = `perspective(1000px) rotateY(${x * 15}deg) rotateX(${y * -15}deg) scale(1.02)`;
            if (img) img.style.transform = `scale(1.1) translate(${-x * 20}px, ${-y * 20}px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)`;
            if (img) img.style.transform = `scale(1) translate(0px, 0px)`;
        });
    });

    const hero = document.querySelector('.hero-section');
    const layers = document.querySelectorAll('.hero-background .layer');

    if (hero && layers.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            layers.forEach((layer, index) => {
                const speed = (index + 1) * 0.03; 
                const x = (centerX - clientX) * speed;
                const y = (centerY - clientY) * speed;
                layer.style.transform = `translateX(${x}px) translateY(${y}px)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            layers.forEach(layer => {
                layer.style.transform = `translateX(0px) translateY(0px)`;
            });
        });
    }

    // 5. PAGINACJA (KOMPLETNA WERSJA)
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
            window.scrollTo({ top: grid.parentElement.offsetTop - 100, behavior: 'smooth' });
        }

        function renderControls() {
            pagination.innerHTML = '';
            
            const prevBtn = document.createElement('div');
            prevBtn.className = `page-num ${currentPage === 1 ? 'disabled' : ''}`;
            prevBtn.innerHTML = '&lt;';
            prevBtn.onclick = () => { if (currentPage > 1) showPage(currentPage - 1); };
            pagination.appendChild(prevBtn);

            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('div');
                btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
                btn.textContent = i;
                btn.onclick = () => { showPage(i); };
                pagination.appendChild(btn);
            }

            const nextBtn = document.createElement('div');
            nextBtn.className = `page-num ${currentPage === totalPages ? 'disabled' : ''}`;
            nextBtn.innerHTML = '&gt;';
            nextBtn.onclick = () => { if (currentPage < totalPages) showPage(currentPage + 1); };
            pagination.appendChild(nextBtn);
        }
        showPage(1);
    }
    setupPagination('mobile-grid', 'mobile-pagination');
    setupPagination('desktop-grid', 'desktop-pagination');

    // 6. ZAMYKANIE LIGHTBOXA
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                lightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});