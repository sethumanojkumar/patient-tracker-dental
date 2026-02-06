# Deploying to Vercel (step-by-step)

This document lists the exact steps to deploy this Next.js + Prisma app to Vercel.

Prerequisites
- A GitHub repository (this project is already pushed to GitHub).
- A hosted Postgres database for production (Supabase, Neon, Railway, AWS RDS, etc.).
- Vercel account (https://vercel.com) connected to your GitHub account.

1) Provision a production Postgres database
- Create a Postgres instance and copy the connection string (DATABASE_URL). Example:
  postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public

2) Update Prisma schema for Postgres (if not already)
- Ensure `prisma/schema.prisma` datasource uses `provider = "postgresql"` and `url = env("DATABASE_URL")`.

3) Create migrations locally
- Configure a local environment variable pointing to a Postgres dev DB (or temporary hosted DB):
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"
npx prisma migrate dev --name init
npx prisma generate
```
- Commit the generated `prisma/migrations/` directory.

4) Configure Vercel project
- In Vercel dashboard, import your GitHub repo.
- In Project Settings → Environment Variables, set (Production):
  - DATABASE_URL = <your production Postgres connection string>
  - NEXTAUTH_URL = https://your-app.vercel.app
  - NEXTAUTH_SECRET = <long-random-secret>
  - STORAGE_PROVIDER = s3|vercel_blob (your choice)
  - S3_BUCKET / S3_REGION / S3_KEY / S3_SECRET or VERCEL_BLOB_TOKEN (if using Vercel Blob)
  - ADMIN_USERNAME / ADMIN_PASSWORD (if used)

5) Migrate production DB
- Before your first release, run migrations against the production DB:
```bash
export DATABASE_URL="<prod connection string>"
npx prisma migrate deploy
```
You can run this from your machine (if it can reach DB) or from a CI job.

6) Build & deploy
- Vercel will run `npm install` then `npm run build`. `prisma generate` runs in `postinstall` so Prisma client will be available.
- Deploy from Vercel dashboard or via push to `master/main`.

7) Verify after deploy
- Visit https://your-app.vercel.app and test login, `/api/patients`, and file upload flow.

Notes & best practices
- Do NOT rely on local filesystem for uploads in production — the API currently requires `STORAGE_PROVIDER` be set in production. Implement S3 or Vercel Blob storage for uploads.
- Consider Prisma Data Proxy or a connection pooler (PgBouncer) to manage DB connections from serverless functions.
- Store secrets in Vercel environment variables (do not commit `.env` with production values).

Example GitHub Action (see `.github/workflows/prisma-migrate-deploy.yml`) will run migrations using `DATABASE_URL` secret.
