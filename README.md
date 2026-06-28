# Portage Theatre Documentary

A React front end application for the Portage Theatre Documentary website. Built with Vite for fast development and optimized builds.

## Tech Stack

- **React** — UI component library
- **Vite** — build tool and dev server with HMR
- **React Router** — client-side routing
- **Framer Motion** — animations and page transitions
- **ESLint** — code quality checks enforced on every PR

## Getting Started

```bash
npm install
npm run dev
```

## Branch Strategy

All changes go through a pull request into `main`. Never push directly to `main`.

```bash
git checkout -b feature/your-feature-name
# make changes
git push origin feature/your-feature-name
# open a PR on GitHub
```

## Scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint errors
- `npm run preview` — preview production build locally
