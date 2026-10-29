# AS / OPS — Dashboard Operasional Produk

Implementasi coding test Front-End Engineer menggunakan React, TypeScript, dan REST API DummyJSON.

## Ringkasan

AS / OPS adalah dashboard operasional produk yang memudahkan peninjauan katalog. Aplikasi menyediakan simulasi login, data produk dari DummyJSON, pencarian dan filter, pengurutan, pagination, ringkasan metrik, serta panel detail produk.

Ruang lingkup aplikasi disesuaikan dengan persyaratan coding test agar implementasinya mudah ditinjau dan dijelaskan saat presentasi.

## Implementasi Persyaratan

- Halaman login sederhana menggunakan akun demo.
- Integrasi REST API menggunakan Fetch API bawaan browser.
- Katalog produk dari DummyJSON.
- Komponen UI yang dapat digunakan kembali.
- Pemisahan logika API dan pengolahan data dari komponen UI.
- Indikator saat data sedang dimuat (loading state).
- Tampilan kegagalan API dengan tombol coba lagi (retry).
- Tampilan katalog kosong dan hasil filter yang tidak ditemukan.
- Validasi serta normalisasi data API sebelum digunakan oleh UI.
- Tata letak responsif.
- Struktur proyek yang siap dikelola menggunakan Git.

## Fitur Tambahan

- Pencarian berdasarkan nama, deskripsi, atau merek produk.
- Filter kategori dan status stok.
- Beberapa pilihan pengurutan.
- Pagination di sisi client.
- Ringkasan total produk, stok menipis, stok habis, dan rata-rata rating.
- Panel detail produk (drawer).
- Simulasi sesi menggunakan `localStorage`.
- Dukungan preferensi pengurangan animasi (`prefers-reduced-motion`).

## Akun Demo

```text
Email: reviewer@asops.dev
Password: Frontend2026!
```

Autentikasi disimulasikan sesuai ketentuan soal. Aplikasi tidak menggunakan kredensial asli atau layanan autentikasi backend.

## Teknologi dan Tools

- React 18
- TypeScript
- Vite
- CSS
- Fetch API bawaan browser
- REST API DummyJSON

Aplikasi tidak menggunakan library komponen UI atau pengelolaan state tambahan. Pendekatan ini menjaga jumlah dependency tetap sedikit dan memudahkan peninjauan implementasi.

## API dan Penanganan Data

Endpoint yang digunakan:

- `GET https://dummyjson.com/products?limit=0`
- `GET https://dummyjson.com/products/categories`

Aplikasi memvalidasi struktur data API sebelum menggunakannya pada UI.

Field teks wajib harus berupa string, sedangkan field angka wajib harus berupa angka terbatas (bukan `NaN` atau `Infinity`). Field opsional seperti merek, SKU, dan status ketersediaan dibersihkan dari spasi di awal/akhir jika valid. Jika tidak tersedia atau salah tipe, field tersebut diperlakukan sebagai tidak tersedia. Nilai diskon opsional hanya dipertahankan jika berupa angka terbatas. Produk yang masih dapat digunakan tidak dibuang hanya karena metadata opsionalnya bermasalah.

Penanganan kondisi data dibedakan sebagai berikut:

- Array `products` kosong merupakan respons yang berhasil. Aplikasi menampilkan katalog kosong dengan tombol coba lagi.
- Array berisi data tetapi tidak memiliki satu pun produk yang dapat digunakan menghasilkan pesan error data. Struktur respons yang salah atau JSON rusak juga menghasilkan pesan error data.
- Kegagalan HTTP atau jaringan ditampilkan sebagai kegagalan request, dengan tombol coba lagi.
- Selama loading atau setelah error, metrik menampilkan tanda `—`. Jika katalog berhasil dimuat tetapi kosong, jumlah produk dan stok bernilai nol, sedangkan rata-rata rating tidak ditampilkan sebagai angka.

## Struktur Proyek

```text
src/
├── components/       # Komponen tampilan yang dapat digunakan kembali
├── hooks/            # Pengelolaan state pemuatan data asinkron
├── services/         # Integrasi REST API dan validasi respons
├── types/            # Definisi tipe TypeScript bersama
├── utils/            # Filter, pengurutan, pagination, dan metrik
├── App.tsx
├── main.tsx
└── styles.css
```

## Menjalankan Secara Lokal

Prasyarat:

- Node.js 18 atau lebih baru
- npm

Instal dependency:

```bash
npm install
```

Jalankan server pengembangan:

```bash
npm run dev
```

Periksa TypeScript dan buat build produksi:

```bash
npm run build
```

Jalankan pratinjau hasil build produksi:

```bash
npm run preview
```

Jalankan tes regresi:

```bash
npm test
```

Tes menggunakan test runner bawaan Node.js dan compiler TypeScript yang sudah tersedia untuk memuat modul source di memori. Tidak ada dependency pengujian tambahan. Pengujian mencakup normalisasi field opsional, respons invalid/campuran/kosong, kegagalan request, rendering data yang telah dinormalisasi, pencarian, filter, pengurutan, dan pagination. Tes ini tidak menggantikan pemeriksaan interaksi langsung melalui browser.

## Catatan Desain

Antarmuka menggunakan tampilan operasional yang sederhana: latar putih gading, teks abu-abu gelap, aksen navy/cobalt, jarak antarelemen yang ringkas, dan umpan balik interaksi yang halus. Framework UI besar dan efek dekoratif berlebihan dihindari agar data tetap menjadi fokus.

`AS / OPS` adalah identitas demo yang berasal dari **Anggana Systems / Operations**. Nama ini hanya digunakan sebagai identitas visual untuk coding test dan tidak mewakili perusahaan nyata.

## Keputusan Teknis

### Pengolahan katalog di sisi client

DummyJSON mendukung pencarian, pagination, dan endpoint kategori di sisi server. Pada aplikasi ini, katalog dimuat melalui `limit=0`, lalu filter, pengurutan, dan pagination dijalankan melalui fungsi utilitas murni. Dengan begitu, logika pengolahan data mudah diperiksa saat presentasi dan komponen UI tetap berfokus pada tampilan.

### Simulasi login tanpa library autentikasi

Soal memperbolehkan validasi sederhana atau data dummy untuk simulasi login. Karena itu, sesi demo lokal sudah mencukupi tanpa menambah layanan backend atau autentikasi yang tidak diperlukan.

### Tanpa library UI tambahan

UI dibangun menggunakan React, TypeScript, dan CSS biasa. Tanpa framework komponen tambahan, ukuran bundle tetap kecil dan keputusan implementasi lebih mudah ditinjau.

## Catatan untuk Reviewer

DummyJSON merupakan API publik untuk pengujian. Jika layanan tidak tersedia, aplikasi menampilkan kondisi error dan menyediakan tombol coba lagi agar kegagalan tetap terlihat serta dapat ditangani oleh pengguna.
