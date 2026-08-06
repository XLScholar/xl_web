/**
 * Generate web thumbnails from private originals.
 * Originals: source/photo_gallery/originals/  (not deployed)
 * Thumbs:    public/gallery/photos/thumb/     (deployed)
 *
 * Run: npm run photos:thumbs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  IMAGE_EXT,
  WATERMARK_ENABLED,
  archivePublicImages,
  generateThumb,
  loadProfileName,
  saveJson,
} from './lib/thumb-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ORIGINALS = path.join(ROOT, 'source', 'photo_gallery', 'originals');
const THUMBS = path.join(ROOT, 'public', 'gallery', 'photos', 'thumb');
const GALLERY_JSON = path.join(ROOT, 'data', 'photo-gallery.json');
const PUBLIC_PHOTOS = path.join(ROOT, 'public', 'gallery', 'photos');

const WATERMARK_TEXT = `© ${loadProfileName(ROOT)}`;

function thumbPublicPath(filename) {
  const stem = path.basename(filename, path.extname(filename));
  return `/gallery/photos/thumb/${stem}.jpg`;
}

async function main() {
  fs.mkdirSync(ORIGINALS, { recursive: true });
  fs.mkdirSync(THUMBS, { recursive: true });
  archivePublicImages(PUBLIC_PHOTOS, ORIGINALS);

  const files = fs
    .readdirSync(ORIGINALS)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log('\nNo originals found. Add images to source/photo_gallery/originals/');
    process.exit(0);
  }

  const gallery = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf8'));
  let totalBefore = 0;
  let totalAfter = 0;

  console.log('\nGenerating photo thumbnails…');
  if (WATERMARK_ENABLED) {
    console.log(`Watermark: "${WATERMARK_TEXT}"\n`);
  }

  for (const name of files) {
    const src = path.join(ORIGINALS, name);
    const id = path.basename(name, path.extname(name));
    const dest = path.join(THUMBS, `${id}.jpg`);
    const { before, after } = await generateThumb(src, dest, WATERMARK_TEXT);
    totalBefore += before;
    totalAfter += after;

    const pub = thumbPublicPath(name);
    const item = gallery.find((g) => g.id === id);
    if (item) {
      item.src = pub;
      item.thumbSrc = pub;
      item.originalPath = `source/photo_gallery/originals/${name}`;
    } else {
      console.log(`  (no gallery entry for ${id}, thumb still written)`);
    }
    console.log(
      `  ${name} → thumb/${id}.jpg  ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024).toFixed(0)} KB`
    );
  }

  saveJson(GALLERY_JSON, gallery);

  console.log(
    `\nDone. ${files.length} thumbnail(s). Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024).toFixed(0)} KB`
  );
  console.log('  Originals (private): source/photo_gallery/originals/');
  console.log('  Thumbs (public):     public/gallery/photos/thumb/');
  console.log('  Updated:             data/photo-gallery.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
