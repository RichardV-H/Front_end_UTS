document.addEventListener('DOMContentLoaded', () => {

    const getFavorites = () => {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    };

    const saveFavorites = (favoritesArray) => {
        localStorage.setItem('favorites', JSON.stringify(favoritesArray));
    };

    const favoriteButton = document.getElementById('favorite-btn');
    if (favoriteButton) {
        const kingdomId = favoriteButton.getAttribute('data-id');
        const updateButtonUI = () => {
            const favorites = getFavorites();
            if (favorites.includes(kingdomId)) {
                favoriteButton.innerHTML = '❤️ Hapus dari Favorit';
                favoriteButton.classList.add('favorited');
            } else {
                favoriteButton.innerHTML = '🤍 Tambah ke Favorit';
                favoriteButton.classList.remove('favorited');
            }
        };

        favoriteButton.addEventListener('click', () => {
            let favorites = getFavorites();
            if (favorites.includes(kingdomId)) {
                favorites = favorites.filter(id => id !== kingdomId);
            } else {
                favorites.push(kingdomId);
            }
            saveFavorites(favorites);
            updateButtonUI();
        });
        updateButtonUI();
    }

    const favoriteGrid = document.getElementById('favoriteGrid');
    if (favoriteGrid) {
        const favorites = getFavorites();
        const favoriteCountSpan = document.getElementById('favoriteCount');
        favoriteGrid.innerHTML = '';
        if (favorites.length === 0) {
            favoriteGrid.innerHTML = '<p class="empty-message">Anda belum memiliki kerajaan favorit.</p>';
            favoriteCountSpan.textContent = '0';
        } else {
            favoriteCountSpan.textContent = favorites.length;
            favorites.forEach(kingdomId => {
                const kingdomData = semuaKerajaan[kingdomId];
                if (kingdomData) {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${kingdomData.gambar}" alt="${kingdomData.nama}">
                        <div class="card-text">
                            <h4>${kingdomData.nama} <span>${kingdomData.periode}</span></h4>
                            <p>${kingdomData.deskripsi}</p>
                            <a href="${kingdomData.url}" class="btn-detail">Detail</a>
                        </div>`;
                    favoriteGrid.appendChild(card);
                }
            });
        }
    }

    const kerajaanGrid = document.getElementById('kerajaanGrid');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (kerajaanGrid) {
        let currentFilter = 'semua';

        const renderKerajaanCards = () => {
            kerajaanGrid.innerHTML = ''; 
            const searchText = searchInput ? searchInput.value.toLowerCase() : '';
            const semuaIdKerajaan = Object.keys(semuaKerajaan);
            let resultsFound = false;

            semuaIdKerajaan.forEach(kingdomId => {
                const kingdomData = semuaKerajaan[kingdomId];
                
                const nameMatch = kingdomData.nama.toLowerCase().includes(searchText);
                const typeMatch = (currentFilter === 'semua') || kingdomData.tipe.includes(currentFilter);

                if (nameMatch && typeMatch) {
                    resultsFound = true;
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.innerHTML = `
                        <img src="${kingdomData.gambar}" alt="${kingdomData.nama}">
                        <div class="card-text">
                            <h4>${kingdomData.nama} <span>${kingdomData.periode}</span></h4>
                            <p>${kingdomData.deskripsi}</p>
                            <a href="${kingdomData.url}" class="btn-detail">Detail</a>
                        </div>`;
                    kerajaanGrid.appendChild(card);
                }
            });

            if (!resultsFound) {
                kerajaanGrid.innerHTML = `<p class="empty-message">Tidak ada kerajaan yang cocok.</p>`;
            }
        };

        renderKerajaanCards();

        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                renderKerajaanCards();
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                if (searchInput.value === '') {
                    renderKerajaanCards();
                }
            });
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                currentFilter = button.getAttribute('data-filter');
                renderKerajaanCards();
            });
        });
    }
});