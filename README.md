# Irmandade Madressilva Guide

A web app for a group of friends to list, manage, and share points of interest to eat around Lisbon.

## Features

- **Public listing** — browse restaurants, cafés, and bars with photos, location, price range, and description
- **Dashboard** — authenticated users can create, edit, and delete entries with photo uploads
- **Auth system** — JWT-based login; no public registration (admin creates accounts)
- **Admin panel** — manage users (add, edit, delete) with role-based access control

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [PostgreSQL](https://www.postgresql.org/) running locally or via a hosted provider

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/FredericoNicola/irmandade-madressilva.guide.git
cd irmandade-madressilva.guide
```

### 2. Configure environment variables

```bash
cp .env.example server/.env
```

Edit `server/.env` and fill in your values:

```
DATABASE_URL=postgresql://user:password@localhost:5432/madressilva_guide
JWT_SECRET=your-secret-key-here
PORT=3001
```

### 3. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd ../client && npm install
```

### 4. Run Prisma migrations

```bash
cd server
npx prisma migrate dev --name init
```

### 5. Seed the database

Creates a default admin user (`admin@madressilva.guide` / `changeme123`):

```bash
cd server
npx prisma db seed
```

> ⚠️ Change the admin password after first login.

### 6. Start development servers

In two separate terminals:

```bash
# Terminal 1 — backend
cd server && npm run dev

# Terminal 2 — frontend
cd client && npm run dev
```

The frontend will be available at `http://localhost:5173` and the API at `http://localhost:3001`.

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/me` | Yes | Get current user |
| GET | `/api/entries` | No | List all entries |
| GET | `/api/entries/:id` | No | Get single entry with photos |
| POST | `/api/entries` | User+ | Create entry |
| PUT | `/api/entries/:id` | User+ | Update entry |
| DELETE | `/api/entries/:id` | User+ | Delete entry |
| POST | `/api/entries/:id/photos` | User+ | Upload photos |
| DELETE | `/api/photos/:id` | User+ | Delete a photo |
| GET | `/api/users` | Admin | List all users |
| POST | `/api/users` | Admin | Create user |
| PUT | `/api/users/:id` | Admin | Edit user |
| DELETE | `/api/users/:id` | Admin | Delete user |

## Hosting

Recommended hosting options:

- **[Render](https://render.com)** — Static site (frontend) + Web Service (backend) + PostgreSQL (free tier)
- **[Railway](https://railway.app)** — All-in-one deployment with PostgreSQL add-on

For photo storage at scale, consider [Cloudinary](https://cloudinary.com) instead of local uploads.