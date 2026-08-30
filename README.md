# Credit Approval Systems - Backend API

Backend Starter Project dibangun menggunakan **Express.js**, **TypeScript**, **Drizzle ORM**, dan **MySQL** dengan arsitektur **Layered Structure Architecture**.

---

## 📁 Struktur Direktori

```text
credit-approval-systems/
├── src/
│   ├── app.ts                  # Konfigurasi Express (middlewares, routes, error handler)
│   ├── server.ts               # Server entry point (app.listen)
│   ├── config/
│   │   └── db.ts               # Inisialisasi koneksi MySQL2 & Drizzle ORM
│   ├── db/
│   │   └── schema.ts           # Schema tabel users & submissions (Drizzle ORM)
│   ├── dto/                    # Data Transfer Objects & Zod Validation Schemas
│   │   ├── auth.dto.ts
│   │   └── submission.dto.ts
│   ├── repository/             # Data Access Layer (Kueri ke Database)
│   │   ├── user.repository.ts
│   │   └── submission.repository.ts
│   ├── services/               # Business Logic & Rules Layer
│   │   ├── auth.service.ts
│   │   └── submission.service.ts
│   ├── controllers/            # HTTP Request & Response Handlers
│   │   ├── auth.controller.ts
│   │   └── submission.controller.ts
│   ├── middlewares/            # Middlewares (Auth JWT, Zod Validator, Error Handler)
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/                 # API Route Endpoints
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   └── submission.routes.ts
│   └── utils/                  # Helper & Response Utilities
│       ├── custom-error.ts
│       └── response.ts
├── drizzle.config.ts           # Konfigurasi Drizzle Kit
├── tsconfig.json               # Konfigurasi TypeScript
├── package.json
├── .env.example
└── .env
```

---

## 🚀 Memulai Proyek

### 1. Setup Environment
Salin file `.env.example` ke `.env` lalu sesuaikan konfigurasi database Anda:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=credit_approval_db

JWT_SECRET=supersecretjwtkey_credit_approval_2026
JWT_EXPIRES_IN=1d
```

### 2. Push Schema ke Database (Drizzle Kit)
Untuk membuat tabel di MySQL secara otomatis sesuai schema:
```bash
npm run db:push
```

### 3. Jalankan Server Development
```bash
npm run dev
```

### 4. Build untuk Production
```bash
npm run build
npm run start
```

---

## 📑 Daftar Endpoint API

### Auth
- `POST /api/auth/register` - Registrasi akun baru
- `POST /api/auth/login` - Login & mendapatkan JWT Bearer token

### Submission
- `POST /api/submission` - Membuat pengajuan kredit baru *(Role: CREDIT_ADMIN)*
- `GET /api/submission` - Mengambil daftar pengajuan kredit *(Pagination, Filter Status & Search)*
- `GET /api/submission/:id` - Mengambil detail pengajuan dengan kalkulasi `monthlyBilling` dinamis
- `PATCH /api/submission/:id/status` - Mengubah status pengajuan (APPROVE/REJECT) *(Role: CREDIT_ANALYST)*
