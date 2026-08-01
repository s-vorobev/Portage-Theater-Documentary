# Portage Theater Documentary

A documentary project website featuring the Portage Theater's story, with a public form for community submissions.

## Branch Strategy

- `main` is the active working branch. All feature work merges here via pull request.
- `prod` is the protected release branch — requires a pull request, 2 approvals, and a passing CI check before anything merges in. Never push directly to `prod`.
- Never push directly to `main` either — all changes go through a pull request.

```bash
git checkout -b feature/your-feature-name
# make changes
git push origin feature/your-feature-name
# open a PR into main on GitHub
```

When a set of changes on `main` is ready to go live, open a PR from `main` into `prod`.

## Frontend

React front end application for the Portage Theater Documentary website. Built with Vite for fast development and optimized builds.

### Tech Stack

- **React** — UI component library
- **Vite** — build tool and dev server with HMR
- **ESLint** — code quality checks enforced on every PR
- **Vitest** — unit testing

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `frontend/.env` (see `frontend/.env.example`):

```
VITE_API_URL=http://localhost:3001
```

| Variable       | Required                                 | Description                                                                                                                                                   |
| -------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL` | No — defaults to `http://localhost:3001` | Base URL of the backend API. Must be prefixed with `VITE_` for Vite to expose it to the browser bundle. Update this per environment (dev/prod) when deployed. |

### Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run format` — auto-format with Prettier
- `npm run format:check` — check formatting without writing changes
- `npm run test` — run Vitest
- `npm run audit` — check for known dependency vulnerabilities

## Backend

Express API handling community form submissions — validates incoming data, uploads media to Dropbox, and stores submission records in Postgres. Also serves video assets from Railway bucket storage via presigned URLs.

### Tech Stack

- **Express** — HTTP server / routing
- **PostgreSQL** (`pg`) — database
- **Zod** — request validation
- **Multer** — multipart/form-data + file upload handling
- **Dropbox SDK** — media storage
- **AWS SDK (S3-compatible)** — bucket storage for video assets

### Getting Started

```bash
cd backend
npm install
npm run dev
```

The server won't start if any required environment variable is missing — it validates config on boot and exits with a clear error telling you exactly what's missing.

### Environment Variables

Create `backend/.env` (see `backend/.env.example`):

```
PORT=3001
NODE_ENV=development

DATABASE_URL=

DROPBOX_APP_KEY=
DROPBOX_APP_SECRET=
DROPBOX_REFRESH_TOKEN=
DROPBOX_UPLOAD_FOLDER=/submissions-dev

FRONTEND_URL=http://localhost:5173

BUCKET_ENDPOINT=
BUCKET_REGION=auto
BUCKET_ACCESS_KEY=
BUCKET_SECRET_KEY=
BUCKET_NAME=
```

| Variable                 | Required                                 | Description                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                   | No — defaults to `3001`                  | Port the Express server listens on.                                                                                                                                                                                  |
| `NODE_ENV`               | No — defaults to `development`           | `development`, `production`, or `test`.                                                                                                                                                                              |
| `DATABASE_URL`           | **Yes**                                  | Postgres connection string. Locally, use Railway's `DATABASE_PUBLIC_URL` value for the dev database — the plain `DATABASE_URL` Railway shows is only reachable from inside Railway's network, not from your machine. |
| `DROPBOX_APP_KEY`        | **Yes**                                  | From the Dropbox App Console, under your app's Settings tab.                                                                                                                                                         |
| `DROPBOX_APP_SECRET`     | **Yes**                                  | Same location — click "Show" to reveal it.                                                                                                                                                                           |
| `DROPBOX_REFRESH_TOKEN`  | **Yes**                                  | Obtained via a one-time OAuth authorization flow. Does not expire under normal use. See team docs for the exact steps if you need to generate a new one.                                                             |
| `DROPBOX_UPLOAD_FOLDER`  | No — defaults to `/submissions`          | Folder path in Dropbox where uploaded media is stored.                                                                                                                                                               |
| `FRONTEND_URL`           | No — defaults to `http://localhost:5173` | Used for CORS — must match wherever the frontend is actually running, or browser requests to the API will be blocked.                                                                                                |
| `BUCKET_ENDPOINT`        | **Yes**                                  | S3-compatible endpoint URL for the Railway bucket. Use the value as given in Railway's bucket credentials — it already includes the `https://` scheme, don't prepend it again.                                       |
| `BUCKET_REGION`          | No — defaults to `auto`                  | Region for the S3 client. Railway buckets use `auto`.                                                                                                                                                                |
| `BUCKET_ACCESS_KEY`      | **Yes**                                  | From the Railway bucket's Credentials tab. Pass into this service via a Variable Reference rather than copy-pasting, so it stays in sync if rotated.                                                                 |
| `BUCKET_SECRET_KEY`      | **Yes**                                  | Same location as above — pass via Variable Reference.                                                                                                                                                                |
| `BUCKET_NAME`            | **Yes**                                  | The bucket's name as shown in Railway (display name + hash suffix).                                                                                                                                                   |

Run `sql/schema.sql` once against a fresh Postgres database before the API can store anything — it's not run automatically. Easiest via Railway's Postgres service → Data/query console → paste and execute the file's contents.

### Scripts

- `npm run dev` — start local dev server (auto-restarts on file changes)
- `npm run start` — start without auto-restart
- `npm run lint` — run ESLint
- `npm run test` — run tests
- `npm run audit` — check for known dependency vulnerabilities