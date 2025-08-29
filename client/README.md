Forde Inventory – CRUD Barang
================================

Fitur
- Login Admin (token JWT sederhana via API)
- CRUD Barang: tambah, lihat, edit inline, hapus (terkunci jika stok > 0)
- Validasi: nama ≥ 3, kode alfanumerik unik, kategori terdaftar, stok ≥ 0, harga > 0
- Penyimpanan data: file JSON di `data/items.json`

Stack
- Next.js App Router (Route Handler untuk API)
- TypeScript

Menjalankan Lokal
1. Masuk folder `cd client`
2. Install deps: `npm install`
3. Buat file `.env.local` (opsional, untuk override default):
```
JWT_SECRET=replace-with-strong-secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```
4. Jalan: `npm run dev`
5. Buka `http://localhost:3000`

API
- POST `/api/auth` → login, body: `{ username, password }`
- GET `/api/items` → list barang (butuh Authorization: Bearer <token>)
- POST `/api/items` → tambah barang
- GET `/api/items/:id` → detail barang
- PUT `/api/items/:id` → update barang
- DELETE `/api/items/:id` → hapus barang (hanya stok = 0)

Deploy ke Vercel
1. Push repository ke GitHub
2. Import ke Vercel
3. Set Environment Variables (Project → Settings → Environment Variables):
   - `JWT_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
4. Deploy

Catatan Persistensi di Vercel
- Vercel serverless tidak persisten menulis ke filesystem. Untuk demo penuh persisten,
  gunakan layanan DB (mis. Neon, Supabase) ATAU platform yang mengizinkan write (Railway/Render).
- Aplikasi ini menggunakan file JSON untuk lokal. Untuk produksi, ganti implementasi `lib/db.ts`
  ke database pilihan Anda.

Demo Credentials
- username: `admin`
- password: `admin123`

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
