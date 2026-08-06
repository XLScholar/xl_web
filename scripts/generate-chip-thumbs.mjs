/**
 * Generate watermarked chip thumbnails from private originals.
 * Originals: source/chip_gallery/originals/  (not deployed)
 * Thumbs:    public/gallery/chips/thumb/     (deployed)
 *
 * Run: npm run chips:thumbs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  IMAGE_EXT,
  WATERMARK_ENABLED,
  archivePublicImages,
  findItemByFilename,
  generateThumb,
  loadProfileName,
  saveJson,
} from './lib/thumb-utils.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ORIGINALS = path.join(ROOT, 'source', 'chip_gallery', 'originals');
const THUMBS = path.join(ROOT, 'public', 'gallery', 'chips', 'thumb');
const GALLERY_JSON = path.join(ROOT, 'data', 'chip-gallery.json');
const PUBLIC_CHIPS = path.join(ROOT, 'public', 'gallery', 'chips');

const WATERMARK_TEXT = `© ${loadProfileName(ROOT)}`;

function thumbPublicPath(filename) {
  const stem = path.basename(filename, path.extname(filename));
  return `/gallery/chips/thumb/${stem}.jpg`;
}

async function main() {
  fs.mkdirSync(ORIGINALS, { recursive: true });
  fs.mkdirSync(THUMBS, { recursive: true });
  archivePublicImages(PUBLIC_CHIPS, ORIGINALS);

  const files = fs
    .readdirSync(ORIGINALS)
    .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
    .sort();

  if (files.length === 0) {
    console.log('\nNo chip originals found. Add images to source/chip_gallery/originals/');
    process.exit(0);
  }

  const gallery = JSON.parse(fs.readFileSync(GALLERY_JSON, 'utf8'));
  let totalBefore = 0;
  let totalAfter = 0;

  console.log('\nGenerating chip thumbnails…');
  if (WATERMARK_ENABLED) {
    console.log(`Watermark: "${WATERMARK_TEXT}"\n`);
  }

  for (const name of files) {
    const src = path.join(ORIGINALS, name);
    const stem = path.basename(name, path.extname(name));
    const dest = path.join(THUMBS, `${stem}.jpg`);
    const { before, after } = await generateThumb(src, dest, WATERMARK_TEXT);
    totalBefore += before;
    totalAfter += after;

    const pub = thumbPublicPath(name);
    const item = findItemByFilename(gallery, name);
    if (item) {
      item.src = pub;
      item.thumbSrc = pub;
      item.originalPath = `source/chip_gallery/originals/${name}`;
    } else {
      console.log(`  (no gallery entry for ${name}, thumb still written)`);
    }
    console.log(
      `  ${name} → thumb/${stem}.jpg  ${(before / 1024 / 1024).toFixed(2)} MB → ${(after / 1024).toFixed(0)} KB`
    );
  }

  saveJson(GALLERY_JSON, gallery);

  console.log(
    `\nDone. ${files.length} chip thumbnail(s). Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024).toFixed(0)} KB`
  );
  console.log('  Originals (private): source/chip_gallery/originals/');
  console.log('  Thumbs (public):     public/gallery/chips/thumb/');
  console.log('  Updated:             data/chip-gallery.json');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
