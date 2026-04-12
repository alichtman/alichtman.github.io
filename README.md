# Bits and Pieces

Personal site built with Next.js and statically exported for GitHub Pages.

## Development

```bash
npm install
npm run dev
```

The local dev server runs on `http://localhost:3000`.

## Build

```bash
npm run build
```

The static export is written to `out/`.

## Content

- App routes live under `app/`
- Reusable UI lives under `components/`
- Blog posts live under `_posts/`
- Static assets live under `assets/`

## Deploy

Deployment runs through GitHub Actions in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
