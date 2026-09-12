# Portage Theater Documentary

A documentary project website featuring the Portage Theater's story, with a public form for community submissions and an internal admin dashboard for reviewing them and editing page content.

## Repository Structure

- `frontend/` — public React website (Vite)
- `admin/` — internal React dashboard (Vite)
- `backend/` — Express API shared by both

## Branch Strategy

- `dev` is the active working branch and the source of the dev deployment. All feature work merges here via pull request.
- `main` is the production branch and the source of the production deployment. It's protected — requires a pull request, 2 approvals, and a passing CI check before anything merges in. Never push directly to `main`.
- Never push directly to `dev` either — all changes go through a pull request.

```bash
git checkout dev
git pull
git checkout -b feature/your-feature-name
# make changes
git push origin feature/your-feature-name
# open a PR into dev on GitHub
```

When a set of changes on `dev` is ready to go live, open a PR from `dev` into `main`.

## Continuous Integration

GitHub Actions runs on every pull request and push to `main` and `dev`. Jobs are path-filtered, so only the packages that changed are built:

- **Frontend** and **Admin** — install, lint, build, and test.
- **Backend** — install, lint, test, and audit dependencies.

A separate auto-format workflow runs Prettier on pull requests targeting `main` and commits any formatting fixes back to the branch.

## Frontend

React front end application for the Portage Theater Documentary website. Built with Vite for fast development and optimized builds.

### Tech Stack

- **React** — UI component library
- **Vite** — build tool and dev server with HMR
- **ESLint** — code quality checks enforced on every PR
- **Vitest** — unit testing
- **reCAPTCHA v3** — invisible bot protection on the submission form

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
VITE_RECAPTCHA_SITE_KEY=
```

| Variable                  | Required                                 | Description                                                                                                                                                                                                                                            |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_API_URL`            | No — defaults to `http://localhost:3001` | Base URL of the backend API. Must be prefixed with `VITE_` for Vite to expose it to the browser bundle. Update this per environment (dev/prod) when deployed.                                                                                          |
| `VITE_RECAPTCHA_SITE_KEY` | **Yes**                                  | Public reCAPTCHA v3 site key from the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin). The domain the app runs on (including `localhost` for local dev) must be added to that key's allowed domains list, or verification will fail. |

reCAPTCHA v3 runs invisibly — there's no checkbox widget. A token is generated fresh at submit time and sent to the backend, which verifies it with Google and decides whether to accept the submission based on the returned score.

The main page also has a scroll-snapped info section directly below the theater exterior. Its copy is fetched at runtime from `GET /api/v1/content/main_info`, so it can be edited from the admin dashboard without a redeploy.

### Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint
- `npm run format` — auto-format with Prettier
- `npm run format:check` — check formatting without writing changes
- `npm run test` — run Vitest
- `npm run audit` — check for known dependency vulnerabilities

## Admin

Internal dashboard for reviewing community submissions and editing public page content. It's a separate React app from the public site and talks to the same backend API.

### Tech Stack

- **React** — UI component library
- **Vite** — build tool and dev server with HMR
- **ESLint** + **Prettier** — code quality and formatting, enforced on every PR
- **Vitest** — unit testing

### Getting Started

```bash
cd admin
npm install
npm run dev
```

### Environment Variables

Create `admin/.env` (see `admin/.env.example`):

```
VITE_API_URL=http://localhost:3001
```

| Variable       | Required | Description                                                                                                                                                |
| -------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | **Yes**  | Base URL of the backend API. Must point at wherever the backend is running, and must be prefixed with `VITE_` for Vite to expose it to the browser bundle. |

Unlike the public site, the admin app needs no reCAPTCHA key.

### Logging in

The dashboard is gated by the backend's shared admin token (see [Admin authentication](#admin-authentication)). It prompts for the token, verifies it with `GET /api/v1/submissions?size=60`, and on success stores it in `sessionStorage` — which is cleared when the tab closes. Any request that returns `401` discards the token and returns to the prompt.

### Layout

- **Submissions (left, larger)** — fetches all submission IDs up front, then displays 6 per page with clickable, windowed pagination (at most 5 page numbers plus an ellipsis). Each card shows the submitter's name, email, phone (when provided), full message, and the original filenames of any attachments. Downloading attachments isn't wired up yet.
- **Edit content (right)** — loads the `main_info` page content into a textarea. **Save** sends `PUT /api/v1/content/main_info`; **Reset** re-fetches the current value.

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

Express API handling community form submissions — validates incoming data, verifies reCAPTCHA and rate limits, uploads media to Dropbox, and stores submission records in Postgres. Also serves video assets from Railway bucket storage via presigned URLs, manages editable page content, and exposes admin-only endpoints protected by a bearer token.

### Tech Stack

- **Express** — HTTP server / routing
- **PostgreSQL** (`pg`) — database
- **Zod** — request validation
- **Multer** — multipart/form-data + file upload handling
- **Dropbox SDK** — media storage
- **AWS SDK (S3-compatible)** — bucket storage for video assets
- **reCAPTCHA v3** — server-side token verification against Google

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
DROPBOX_UPLOAD_FOLDER=/dev

FRONTEND_URL=http://localhost:5173

RECAPTCHA_SECRET_KEY=

ADMIN_TOKEN=

BUCKET_ENDPOINT=
BUCKET_REGION=auto
BUCKET_ACCESS_KEY=
BUCKET_SECRET_KEY=
BUCKET_NAME=
```

| Variable                | Required                                 | Description                                                                                                                                                                                                                                          |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                  | No — defaults to `3001`                  | Port the Express server listens on.                                                                                                                                                                                                                  |
| `NODE_ENV`              | No — defaults to `development`           | `development`, `production`, or `test`.                                                                                                                                                                                                              |
| `DATABASE_URL`          | **Yes**                                  | Postgres connection string. Locally, use Railway's `DATABASE_PUBLIC_URL` value for the dev database — the plain `DATABASE_URL` Railway shows is only reachable from inside Railway's network, not from your machine.                                 |
| `DROPBOX_APP_KEY`       | **Yes**                                  | From the Dropbox App Console, under your app's Settings tab.                                                                                                                                                                                         |
| `DROPBOX_APP_SECRET`    | **Yes**                                  | Same location — click "Show" to reveal it.                                                                                                                                                                                                           |
| `DROPBOX_REFRESH_TOKEN` | **Yes**                                  | Obtained via a one-time OAuth authorization flow. Does not expire under normal use. See team docs for the exact steps if you need to generate a new one.                                                                                             |
| `DROPBOX_UPLOAD_FOLDER` | No — defaults to `/dev`                  | Folder path in Dropbox where uploaded media is stored.                                                                                                                                                                                               |
| `FRONTEND_URL`          | No — defaults to `http://localhost:5173` | Used for CORS — must match wherever the frontend is actually running, or browser requests to the API will be blocked.                                                                                                                                |
| `RECAPTCHA_SECRET_KEY`  | **Yes**                                  | Private reCAPTCHA v3 secret key from the [reCAPTCHA admin console](https://www.google.com/recaptcha/admin) (pairs with the frontend's `VITE_RECAPTCHA_SITE_KEY`). Never exposed to the browser — used server-side only to verify tokens with Google. |
| `ADMIN_TOKEN`           | **Yes**                                  | Shared secret for the admin endpoints (see [Admin authentication](#admin-authentication)). Sent by clients as `Authorization: Bearer <token>`. Must be at least 16 characters — generate one with `openssl rand -hex 32`.                            |
| `BUCKET_ENDPOINT`       | **Yes**                                  | S3-compatible endpoint URL for the Railway bucket. Use the value as given in Railway's bucket credentials — it already includes the `https://` scheme, don't prepend it again.                                                                       |
| `BUCKET_REGION`         | No — defaults to `auto`                  | Region for the S3 client. Railway buckets use `auto`.                                                                                                                                                                                                |
| `BUCKET_ACCESS_KEY`     | **Yes**                                  | From the Railway bucket's Credentials tab. Pass into this service via a Variable Reference rather than copy-pasting, so it stays in sync if rotated.                                                                                                 |
| `BUCKET_SECRET_KEY`     | **Yes**                                  | Same location as above — pass via Variable Reference.                                                                                                                                                                                                |
| `BUCKET_NAME`           | **Yes**                                  | The bucket's name as shown in Railway (display name + hash suffix).                                                                                                                                                                                  |

`FRONTEND_URL` controls CORS. In `development`, any `http://localhost:<port>` origin is also allowed, so the public frontend and the admin dashboard can both call the API locally without changing the config.

Run `sql/schema.sql` once against a fresh Postgres database before the API can store anything — it's not run automatically. Easiest via Railway's Postgres service → Data/query console → paste and execute the file's contents. It creates the `submissions`, `submission_files`, and `content` tables.

### Submission validation & protections

Every submission is validated and screened server-side before it touches Dropbox or Postgres:

- **Field validation** — all fields are checked with Zod (`contracts/submissionContract.js`). Names are trimmed and length-capped, the email must be a valid address, the message is capped at 100 words, and the optional phone number is normalized by stripping every non-digit character and must then be exactly 10 digits (a blank or digit-less value becomes `null`).
- **reCAPTCHA v3** — every submission must include a valid token, generated fresh at submit time. The backend verifies it against Google (`recaptchaService.js`) and rejects the request if verification fails, the score falls below threshold, or the action name doesn't match.
- **IP-based rate limiting** — each IP is limited to **2 submissions per 7 days** (`rateLimitService.js` / `rateLimitRepository.js`). Once the limit is hit, the API responds with a `429` and a message pointing the person to email their submission to `footage@portagetheaterdocumentary.com` instead.

All checks run before any file upload or database write, so a rejected request never touches Dropbox or Postgres.

### API

All endpoints are versioned under `/api/v1`.

| Method | Endpoint                       | Auth   | Description                                  |
| ------ | ------------------------------ | ------ | -------------------------------------------- |
| POST   | `/api/v1/submit`               | Public | Create a submission (multipart form + files) |
| GET    | `/api/v1/submissions`          | Admin  | List submission IDs (`size`, `offset`)       |
| GET    | `/api/v1/submissions/:id`      | Admin  | Get a single submission with its files       |
| GET    | `/api/v1/content/:slug`        | Public | Get page content by slug                     |
| PUT    | `/api/v1/content/:slug`        | Admin  | Update page content by slug                  |
| GET    | `/api/v1/media/footage`        | Public | Redirect to a presigned video URL            |
| GET    | `/api/v1/media/footage-mobile` | Public | Redirect to a presigned mobile video URL     |

GET requests return the requested resource. `POST` and `PUT` return only a status code (`201` / `204`) with no response body.

### Admin authentication

Endpoints marked **Admin** require an `Authorization: Bearer <token>` header whose value matches the `ADMIN_TOKEN` environment variable. There is no user database — it's a single shared secret checked by `middleware/requireAdmin.js` using a constant-time comparison. Requests without a valid token receive `401 Unauthorized`.

Generate a strong token locally:

```bash
openssl rand -hex 32
```

Set the result as `ADMIN_TOKEN` in your local `.env` and in the deployed environment.

### Scripts

- `npm run dev` — start local dev server (auto-restarts on file changes)
- `npm run start` — start without auto-restart
- `npm run lint` — run ESLint
- `npm run test` — run tests
- `npm run audit` — check for known dependency vulnerabilities
