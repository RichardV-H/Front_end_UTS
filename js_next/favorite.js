// File: js/favorite.js

document.addEventListener('DOMContentLoaded', () => {

    // --- FUNGSI DASAR UNTUK MENGELOLA LOCALSTORAGE ---

    // Fungsi untuk mengambil daftar favorit dari localStorage
    const getFavorites = () => {
        const favorites = localStorage.getItem('favorites');
        return favorites ? JSON.parse(favorites) : [];
    };

    // Fungsi untuk menyimpan daftar favorit ke localStorage
    const saveFavorites = (favorites) => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    };

    // Fungsi untuk mengecek apakah sebuah kerajaan sudah menjadi favorit
    const isFavorite = (kingdomId) => {
        return getFavorites().includes(kingdomId);
    };


    // --- FUNGSI UNTUK TOMBOL FAVORIT DI HALAMAN DETAIL ---

    // Fungsi utama untuk toggle (menambah/menghapus) favorit
    const toggleFavorite = (kingdomId) => {
        let favorites = getFavorites();
        if (isFavorite(kingdomId)) {
            // Jika sudah favorit, hapus dari daftar
            favorites = favorites.filter(id => id !== kingdomId);
            alert(semuaKerajaan[kingdomId].nama + ' dihapus dari favorit.');
        } else {
            // Jika belum, tambahkan ke daftar
            favorites.push(kingdomId);
            alert(semuaKerajaan[kingdomId].nama + ' ditambahkan ke favorit!');
        }
        saveFavorites(favorites);
    };

    // Fungsi untuk memperbarui tampilan tombol (love penuh/kosong)
    const updateFavoriteButton = (button, kingdomId) => {
        if (isFavorite(kingdomId)) {
            button.innerHTML = '❤️ Hapus dari Favorit';
            button.classList.add('favorited');
        } else {
            button.innerHTML = '🤍 Tambah ke Favorit';
            button.classList.remove('favorited');
        }
    };

    // Inisialisasi tombol di halaman detail kerajaan
    const favoriteButton = document.getElementById('favorite-btn');
    if (favoriteButton) {
        const kingdomId = favoriteButton.getAttribute('data-id');
        
        // Atur tampilan tombol saat halaman dimuat
        updateFavoriteButton(favoriteButton, kingdomId);

        // Tambahkan event listener untuk klik
        favoriteButton.addEventListener('click', () => {
            toggleFavorite(kingdomId);
            updateFavoriteButton(favoriteButton, kingdomId); // Perbarui tampilan tombol setelah diklik
        });
    }


    // --- FUNGSI UNTUK MENAMPILKAN KARTU DI HALAMAN FAVORIT ---

    const renderFavoriteCards = () => {
        const favoriteGrid = document.getElementById('favoriteGrid');
        if (!favoriteGrid) return; // Keluar jika bukan di halaman favorit

        const favorites = getFavorites();
        const favoriteCountSpan = document.getElementById('favoriteCount');

        favoriteGrid.innerHTML = ''; // Kosongkan grid terlebih dahulu

        if (favorites.length === 0) {
            // Tampilkan pesan jika tidak ada favorit
            favoriteGrid.innerHTML = '<p class="empty-message">Anda belum memiliki kerajaan favorit. Coba tambahkan beberapa!</p>';
            favoriteCountSpan.textContent = '0';
        } else {
            // Loop melalui daftar favorit dan buat kartunya
            favorites.forEach(kingdomId => {
                const kingdom = semuaKerajaan[kingdomId];
                if (kingdom) {
                    const cardHTML = `
                        <div class="favorite-card">
                            <div class="card-image">
                                <img src="${kingdom.gambar}" alt="${kingdom.nama}">
                            </div>
                            <div class="card-content">
                                <h3>${kingdom.nama}</h3>
                                <p>${kingdom.deskripsi}</p>
                                <div class="card-footer">
                                    <a href="${kingdom.url}" class="btn">Baca Selengkapnya</a>
                                </div>
                            </div>
                        </div>
                    `;
                    favoriteGrid.innerHTML += cardHTML;
                }
            });
            favoriteCountSpan.textContent = favorites.length;
        }
    };

    // Panggil fungsi render jika kita berada di halaman favorit
    renderFavoriteCards();

});