# Photo Gallery — Originals (Private)

**Do not put full-resolution photos in `public/`.**  
Place originals here, then run:

```bash
npm run photos:thumbs
```

| Location | Deployed? | Purpose |
|----------|-----------|---------|
| `source/photo_gallery/originals/` | **No** (gitignored) | Master files — keep locally |
| `public/gallery/photos/thumb/` | **Yes** | Web thumbnails (~1280px JPEG) with **© Xuliang Wang** watermark |

## Add a new photo

1. Copy `p13.jpg` (etc.) into `originals/`
2. Add an entry in `data/photo-gallery.json` (or use `/manual-edit`)
3. Run `npm run photos:thumbs`
4. Commit `data/photo-gallery.json` and `public/gallery/photos/thumb/` — **not** originals
