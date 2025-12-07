# CommunityFix (MERN Boilerplate)

This repository contains a minimal, production-friendly MERN boilerplate with a Vite + React frontend and an Express + Mongoose backend.

Quick start (Windows PowerShell):

```powershell
# from repo root (created concurrently script)
npm install
# install server deps
cd server
npm install
cd ..\client
npm install

# run both (from repo root)
cd ..
npm run dev
```

Server defaults:
- Port: `5000`
- Env example: `server/.env.example`

Frontend defaults:
- Vite dev server and `client/.env.example` with `VITE_API_URL`.

Notes:
- Replace secrets in `server/.env` (do not commit credentials).
- The frontend expects an API at `http://localhost:5000` by default; change `VITE_API_URL` to point to your backend.
