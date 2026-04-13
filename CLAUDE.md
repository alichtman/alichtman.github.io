# CLAUDE.md — Notes for Future Claude Sessions

## What this repo is

Aaron's personal site at **alichtman.com**. Next.js 16 static export deployed to GitHub Pages via `alichtman/alichtman.github.io`. Dark monospace terminal aesthetic ("Bits and Pieces").

---

## Stack

- **Next.js 16** (App Router, `output: 'export'` static export)
- **TypeScript** (strict mode)
- **CSS Modules** — no Tailwind, no styled-components
- **JetBrains Mono** font throughout
- Markdown posts via `gray-matter` + `remark` + `rehype-pretty-code` (gruvbox-dark-hard theme)

---

## Directory layout

```
app/                  # Next.js App Router pages
  page.tsx            # Homepage (recent posts + sidebar)
  posts/page.tsx      # All posts grouped by year
  posts/[slug]/       # Individual post (dynamic, generateStaticParams)
  projects/page.tsx   # OSS projects
  resume/page.tsx     # Embedded PDF resume
  about/page.tsx      # Bio
  globals.css         # CSS custom properties (design tokens)
  page.module.css     # Homepage layout incl. .hideMobile utility

components/
  ASCIICanvas.tsx     # Animated ASCII art grid (desktop only, hidden on mobile via .hideMobile)
  Card.tsx            # Titled box with terminal/window aesthetic
  Navigation.tsx      # Sticky top nav, active link via usePathname()
  PdfViewer.tsx       # <object> PDF embed with fallback

lib/
  posts.ts            # All markdown parsing logic (see below)

_posts/               # Blog posts — filename: YYYY-MM-DD-slug.md
assets/               # Images, favicon, font — NOT served directly
public/               # Static root — assets/ is COPIED here at build time (see deploy)
```

---

## Blog post system

**File naming:** `_posts/YYYY-MM-DD-slug.md`

**Frontmatter:**
```yaml
title: "Title"
date: 2024-01-13T05:56:30-04:00
categories: [blog]
tags: [macOS, linux]
hidden: false   # omit or false to publish; true to hide from lists
```

**Key functions in `lib/posts.ts`:**
- `getAllPosts()` — all posts sorted by date DESC, hidden ones filtered out
- `getPostBySlug(slug)` — metadata only (no HTML, fast)
- `getPostWithHtml(slug)` — full render (async, used in `[slug]/page.tsx`)
- `getAllPostSlugs()` — used by `generateStaticParams`

Excerpt is auto-extracted from the first prose paragraph (skips headings, images, code fences).

---

## Styling

**Design tokens** in `app/globals.css` as CSS custom properties:
- `--theme-text`, `--theme-background`, `--theme-background-body`, `--theme-window-shadow`, `--theme-text-subdued`
- `--space-xs` through `--space-xl` derived from `--line-height`
- Code highlight colors: gruvbox-inspired amber/rust palette

**Responsive breakpoints:**
- `700px` — layout switches to single column (`page.module.css`)
- `600px` — nav stacks vertically (`Navigation.module.css`)
- `.hideMobile` class in `page.module.css` sets `display: none` below 700px — used on the ASCII canvas Card

**Card aesthetic:** terminal window borders created with inset `box-shadow`, not actual borders.

---

## Deployment

**Workflow:** `.github/workflows/nextjs.yml` (GitHub's official Next.js Pages template)

**Critical step — must happen before build:**
```yaml
- name: Copy assets for static serving
  run: |
    mkdir -p public/assets
    cp -r assets/images public/assets/images 2>/dev/null || true
    cp -r assets/favicon public/assets/favicon 2>/dev/null || true
```
`assets/` lives outside `public/`, so it won't be in the static export unless copied first. If images break on the deployed site, check this step is present.

**`static_site_generator: next`** is set in `configure-pages@v5`. This previously caused the `out/` directory not to be created (configure-pages was generating a conflicting next.config.js). Watch for this if the build starts failing with "out: No such file or directory".

**Custom domain:** `alichtman.com` via `public/CNAME`. DNS records:
- 4× A records on `@` → GitHub Pages IPs (185.199.108-111.153)
- CNAME `www` → `alichtman.github.io`

If the GitHub Pages UI shows "custom domain already taken", it means the domain is ghost-claimed. Fix: go to **github.com/settings/pages → Verified domains** and verify ownership of `alichtman.com` there.

---

## Things that burned us

1. **Asset copy step** — images 404 on deploy if the `cp assets/ → public/assets/` step is missing from the workflow.
2. **`static_site_generator: next` in configure-pages** — can generate a `next.config.js` that conflicts with `next.config.ts`, causing `next build` to not produce `out/`. If this happens, remove the option.
3. **CNAME in `out/`** — the CNAME file is in `public/` and gets copied to `out/` at build time. This is correct. Don't delete it.
4. **Cache key** — old workflow was keying the cache on `pnpm-lock.yaml` which doesn't exist (project uses npm). Always use `package-lock.json`.
