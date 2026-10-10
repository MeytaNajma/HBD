# Birthday Letter — React + Vite + Tailwind CSS

Project ini sudah disiapkan agar bisa dibuka dan dikembangkan di VS Code menggunakan React, Vite, dan Tailwind CSS v4.

## Menjalankan project

1. Ekstrak ZIP.
2. Buka folder `birthday-react-vite` di VS Code.
3. Pastikan Node.js sudah terpasang.
4. Buka terminal di VS Code, lalu jalankan:

   ```bash
   npm install
   npm run dev
   ```

5. Buka alamat lokal yang muncul di terminal (biasanya `http://localhost:5173`).

Untuk mengecek build produksi:

```bash
npm run build
npm run preview
```

## Struktur folder

```text
birthday-react-vite/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    └── legacyContent.js
```

## Mengubah isi halaman

- Nama, tanggal, dan konfigurasi ulang tahun ada di `src/legacyContent.js`, pada bagian `CONFIG`.
- Teks surat, daftar alasan, lagu, dan caption kenangan juga ada di `src/legacyContent.js`.
- Foto sampul dan foto kenangan saat ini menggunakan URL contoh `picsum.photos`; ganti URL tersebut dengan foto milikmu.
- Styling custom dan animasi visual dipertahankan di `src/index.css`. Tailwind CSS v4 juga sudah terpasang dan bisa dipakai dengan utility classes di komponen React.

## Catatan refactor

Tampilan dan interaksi dari HTML sumber dipertahankan dengan memindahkan markup serta skrip interaksi ke modul yang dipasang melalui komponen React. Ini merupakan tahap migrasi awal yang menjaga hasil visual tetap dekat dengan versi asli; untuk refactor React yang sepenuhnya idiomatis, interaksi DOM imperatif dapat dipindahkan bertahap ke komponen dan React state/hooks.
