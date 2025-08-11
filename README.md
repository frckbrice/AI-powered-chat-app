# WhatsApp Clone (Next.js)

A WhatsApp-like chat UI built with Next.js, React, Tailwind CSS, and Radix UI.

This README is iterative and will be updated as the project evolves.

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS 3
- Radix UI
- Yarn (package manager)
- Vitest + Testing Library (unit tests)

## Getting Started

Install dependencies (Yarn):

```bash
yarn install
yarn dev
```

Visit `http://localhost:3000`.

## Scripts

- `yarn dev`: Start the dev server (Turbopack)
- `yarn build`: Build for production
- `yarn start`: Start the production server
- `yarn lint`: Run ESLint
- `yarn test`: Run unit tests once
- `yarn test:watch`: Run unit tests in watch mode
- `yarn ci`: Lint, test with coverage, then build
- `yarn lhci`: Run Lighthouse locally against http://localhost:3000
- `yarn check:headers`: Verify key security headers on http://localhost:3000

## Testing

This project uses Vitest with jsdom and Testing Library.

- Test setup lives in `src/test/setup.ts`.
- Example test: `src/components/ui/__tests__/button.test.tsx`.

Run tests:

```bash
yarn test
```

## Environment

If you enable Clerk or remote auth/Convex features, set required variables:

```bash
# Development convenience (only if integrating Clerk)
NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN=http://localhost
with something like:

# Development convenience (only if integrating Clerk)
NEXT_PUBLIC_CLERK_JWT_ISSUER_DOMAIN=https://verb-noun-00.clerk.accounts.dev
```

The app does not require this variable to run unless you wire up Clerk.

## Docker

A multi-stage Dockerfile is provided for production builds.

Build and run locally:

```bash
docker build -t whatsapp-clone .
docker run -p 3000:3000 whatsapp-clone
```

## CI/CD (GitHub Actions)

Workflow at `.github/workflows/ci.yml` runs on push/PR to `main`:

- Yarn install (cached)
- Lint
- Test (with coverage)
- Build
- Build and push Docker image to GHCR (`ghcr.io/<owner>/<repo>:sha-<sha>`) if the build/test stage succeeds

Ensure GitHub Packages is enabled for your repository if you want Docker pushes to GHCR.

## Code Review (CodeRabbit)

`.coderabbit.yml` config enables automatic PR reviews focusing on performance, errors, maintainability, and test coverage. Install/enable the CodeRabbit app on your repo to activate.

## Notes

- Uses Yarn as the package manager.
- Tailwind v3 is configured via PostCSS (`postcss.config.mjs`).
- This README will be extended as features are added (auth, backend, messaging, etc.).
