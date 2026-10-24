# Audit statis folder Scrapr

Audit ini memeriksa arsip sumber yang disediakan, bukan menjalankan semua scraper terhadap layanan internet.

## Ringkasan

- Paket sumber bernama `@coflyn/scrapr`, versi `1.3.1`.
- Entry point CommonJS: `index.js`; fungsi scraper diekspor dalam namespace platform.
- Runtime yang didokumentasikan oleh proyek: Node.js >= 16; proyek UI ini memakai Node.js >= 18.
- Dependensi inti library: `axios` dan `cheerio`; beberapa metode mempunyai dependensi browser opsional.
- Terdapat `README.md`, `CHANGELOG.md`, `SECURITY.md`, `LICENSE`, `test/test.js`, implementasi di `lib/`, dan bundle `bundle.cjs`.
- README mendokumentasikan extractor media sosial/musik serta resolver file/shortlink.

## Namespace dan metode yang diekspor

- `applemusic`: `aplmate`
- `bandcamp`: `direct`, `bandcampdownloader`
- `bilibili`: `direct`
- `douyin`: `direct`
- `facebook`: `snapsave`, `fdown`
- `instagram`: `indown`, `snapinsta`, `snapsave`, `direct`
- `pinterest`: `pindown`, `direct`
- `pixiv`: `ajax`
- `reddit`: `rapidsave`
- `rednote`: `direct`
- `resolver`: `sfile`, `safelinku`, `mediafire`, `sub2unlock`, `rekonise`, `unshorten`, `pixeldrain`, `catbox`, `krakenfiles`, `doodstream`, `gdrive`
- `soundcloud`: `klickaud`
- `spotify`: `spotmate`, `spotidown`, `soundloaders`, `spotisaver`
- `terabox`: `sechno`
- `threads`: `threadster`
- `tiktok`: `snaptik`, `tiktokio`, `savetik`, `ssstik`, `tikdownloader`
- `twitter`: `tweeload`, `tvd`, `savetwt`, `direct`
- `youtube`: `ytmp3`, `ytmp3gg`, `playlist`

Daftar di UI tidak di-hardcode: server membaca ekspor aktual library ketika dijalankan.

## Batasan dan risiko yang diketahui

1. Scraper mengandalkan markup, endpoint, dan kebijakan layanan eksternal. Perubahan upstream dapat menyebabkan kegagalan tanpa perubahan pada UI.
2. Test script sumber menjalankan permintaan ke layanan pihak ketiga dan bisa memakan waktu/terkena rate limit. Audit ini tidak menjalankan seluruh test jaringan.
3. Beberapa metode dalam README membutuhkan browser headless/dependensi opsional.
4. Backend menambahkan validasi URL dasar, rate limit per IP, Helmet, serta timeout permintaan. Ini bukan perlindungan SSRF/abuse yang sempurna untuk deployment publik; resolver/unshortener dan redirect internal membutuhkan pembatasan egress jaringan yang lebih kuat.
5. UI hanya menampilkan tautan langsung yang dapat dikenali dalam bentuk respons. Seluruh payload tetap dapat disalin sebagai JSON jika bentuk respons berbeda.
6. Jangan gunakan untuk melewati akses privat, DRM, autentikasi, atau pembatasan hak cipta.

## Belum diverifikasi

- Keberhasilan ekstraksi langsung dari semua platform saat ini.
- Kompatibilitas setiap scraper terhadap perubahan situs per 22 Oktober 2026.
- Performa pada deployment produksi dan keamanan konfigurasi hosting.
