# Xuliang Wang — Academic Homepage

Faculty-application personal website for **Xuliang Wang (王旭亮)**, inspired by [zhutmost.com](https://zhutmost.com/) — news timeline, tags, archive/blog, and clearly categorized research sections.

> **Consolidated project:** merges `xl_web`, `xl_web2`, and `xl_web3`. See [CONSOLIDATION.md](./CONSOLIDATION.md).

## Features

- **News timeline** — achievements and updates (`/news`)
- **Tags** — browse by research topic (`/tags`)
- **Archive** — share ideas and notes (`/archive`)
- **Research** — expandable primary/secondary/tertiary areas
- **Publications** — selected works + Google Scholar
- **CV download** — PDF for search committees (`/cv`)
- **Data-driven** — edit `data/*.json` without touching components

## Tech Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Deploy: Vercel

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Project Structure

```
xl_web/
├── app/                 # Pages (home, about, news, tags, archive, cv)
├── components/          # UI components
├── data/                # Content JSON (edit here)
├── source/              # Drop latest CV, photo, raw materials
├── public/              # Static assets (CV PDF, portrait)
├── lib/content.ts       # Content loader
└── cursor_prompts/      # AI workflow from xl_web2
```

## Updating Content

1. Put latest files in `source/` (see `source/README.md`)
2. Update `data/profile.json`, `data/news.json`, etc.
3. Copy PDF/portrait to `public/`

### Photo gallery (private originals)

1. Place full-resolution images in `source/photo_gallery/originals/` (e.g. `p1.jpg`)
2. Run `npm run photos:thumbs` — generates watermarked thumbnails in `public/gallery/photos/thumb/`
3. Commit thumbnails + `data/photo-gallery.json` — **not** originals (gitignored)

### Chip gallery (private originals)

1. Place chip images in `source/chip_gallery/originals/` (e.g. `p1.png`)
2. Run `npm run chips:thumbs` — generates watermarked thumbnails in `public/gallery/chips/thumb/`
3. Commit thumbnails + `data/chip-gallery.json` — **not** originals

Or run both: `npm run gallery:thumbs`

## Deploy

Push to GitHub → import in [Vercel](https://vercel.com) → Deploy.

## Contact

xwangef@tsinghua.edu.cn
