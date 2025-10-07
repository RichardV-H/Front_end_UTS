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
                    card.className = 'favorite-card';
                    card.innerHTML = `
                        <div class="card-image"><img src="${kingdomData.gambar}" alt="${kingdomData.nama}"></div>
                        <div class="card-content">
                            <h3>${kingdomData.nama}</h3>
                            <p>${kingdomData.deskripsi}</p>
                            <div class="card-footer"><a href="${kingdomData.url}" class="btn">Baca Selengkapnya</a></div>
                        </div>`;
                    favoriteGrid.appendChild(card);
                }
            });
        }
    }

    const kerajaanGrid = document.getElementById('kerajaanGrid');
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');

    if (kerajaanGrid && searchForm && searchInput) {
        
        const renderKerajaanCards = (filter = '') => {
            kerajaanGrid.innerHTML = ''; 
            const filterText = filter.toLowerCase();
            const semuaIdKerajaan = Object.keys(semuaKerajaan);
            let resultsFound = false;

            semuaIdKerajaan.forEach(kingdomId => {
                const kingdomData = semuaKerajaan[kingdomId];
                const kingdomName = kingdomData.nama.toLowerCase();

                if (kingdomName.includes(filterText)) {
                    resultsFound = true;
                    const card = document.createElement('div');
                    card.className = 'kerajaan-card';
                    card.innerHTML = `
                        <div class="card-image"><img src="${kingdomData.gambar}" alt="${kingdomData.nama}"></div>
                        <div class="card-content">
                            <h3>${kingdomData.nama}</h3>
                            <p>${kingdomData.deskripsi}</p>
                            <div class="card-footer"><a href="${kingdomData.url}" class="btn">Baca Selengkapnya</a></div>
                        </div>`;
                    kerajaanGrid.appendChild(card);
                }
            });

            if (!resultsFound && filter !== '') {
                kerajaanGrid.innerHTML = `<p class="empty-message">Kerajaan "${filter}" tidak ditemukan.</p>`;
            }
        };

        renderKerajaanCards();

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchText = searchInput.value;
            renderKerajaanCards(searchText);
        });
        
        searchInput.addEventListener('input', () => {
            if (searchInput.value === '') {
                renderKerajaanCards();
            }
        });
    }
});