import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE = path.join(ROOT, 'source');
const PUBLIC = path.join(ROOT, 'public');
const CHIPS_DIR = path.join(PUBLIC, 'gallery', 'chips');
const CHIP_ORIGINALS = path.join(SOURCE, 'chip_gallery', 'originals');
const PHOTOS_DIR = path.join(PUBLIC, 'gallery', 'photos');
const PHOTO_ORIGINALS = path.join(SOURCE, 'photo_gallery', 'originals');
const DATA = path.join(ROOT, 'data');

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const CV_NAMES = [
  'Xuliang_Wang_CV_202608.pdf',
  'Xuliang Wang - CV.pdf',
  'CV.Xuliang_2026.pdf',
  'CV.pdf',
];
const PORTRAIT_NAMES = [
  'portrait.jpg', 'portrait.jpeg', 'portrait.png',
  'photo.jpg', 'photo.jpeg', 'photo.png',
];

const CHIP_KEYWORDS = [
  { id: 'unicorn', keys: ['unicorn', 'p1'] },
  { id: 'scsl', keys: ['scsl', 'j2', 'jssc', 'p2'] },
  { id: 'rela', keys: ['rela', 'x-rela', 'xrela', 'p3'] },
  { id: 'casp', keys: ['casp', 'p4'] },
  { id: 'si-scpl', keys: ['si-scpl', 'scpl', 'j3', 'p5'] },
  { id: 'mobius', keys: ['mobius', 'p6'] },
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${path.basename(src)} -> ${dest}`);
}

function matchChipId(filename) {
  const lower = filename.toLowerCase();
  for (const { id, keys } of CHIP_KEYWORDS) {
    if (keys.some((k) => lower.includes(k))) return id;
  }
  return null;
}

function loadJson(file, fallback) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
  const files = walk(SOURCE);
  console.log(`Found ${files.length} file(s) under source/`);

  // CV — prefer latest naming
  const cvPdf =
    files.find((f) => CV_NAMES.includes(path.basename(f))) ||
    files.find((f) => path.extname(f).toLowerCase() === '.pdf' && /cv/i.test(path.basename(f))) ||
    (fs.existsSync(path.join(ROOT, 'Xuliang_Wang_CV_202608.pdf'))
      ? path.join(ROOT, 'Xuliang_Wang_CV_202608.pdf')
      : null);

  if (cvPdf) {
    copyFile(cvPdf, path.join(PUBLIC, 'Xuliang_Wang_CV_202608.pdf'));
    // Keep legacy alias for old links
    copyFile(cvPdf, path.join(PUBLIC, 'CV.Xuliang_2026.pdf'));
  }

  const rootImages = files.filter(
    (f) => IMAGE_EXT.has(path.extname(f).toLowerCase()) && !f.includes('photo_of_tapeout') && !f.includes('gallery')
  );
  const portrait =
    rootImages.find((f) => PORTRAIT_NAMES.includes(path.basename(f).toLowerCase())) ||
    rootImages[0];
  if (portrait) copyFile(portrait, path.join(PUBLIC, 'portrait.jpg'));

  const tapeoutDir = path.join(SOURCE, 'photo_of_tapeout');
  const chipManifest = loadJson(path.join(DATA, 'chip-gallery.json'), []);
  const chipById = Object.fromEntries(chipManifest.map((c) => [c.id, { ...c }]));

  if (fs.existsSync(tapeoutDir)) {
    walk(tapeoutDir)
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .forEach((src, idx) => {
        const base = path.basename(src);
        const ext = path.extname(src).toLowerCase();
        const chipId = matchChipId(base) || `chip-${String(idx + 1).padStart(2, '0')}`;
        const destName = `${chipId}${ext}`;
        const dest = path.join(CHIP_ORIGINALS, destName);
        copyFile(src, dest);
        if (chipById[chipId]) {
          chipById[chipId].src = `/gallery/chips/thumb/${chipId}.jpg`;
        }
      });
  }

  if (Object.keys(chipById).length) {
    fs.writeFileSync(
      path.join(DATA, 'chip-gallery.json'),
      JSON.stringify(Object.values(chipById), null, 2)
    );
    console.log('  Chip originals copied — run: npm run chips:thumbs');
  }

  const personalDir = path.join(SOURCE, 'photo_gallery');
  const photoManifest = loadJson(path.join(DATA, 'photo-gallery.json'), []);
  const photos = [...photoManifest];

  if (portrait && !photos.some((p) => p.src === '/portrait.jpg')) {
    photos.unshift({
      id: 'portrait-main',
      title: 'Portrait',
      src: '/portrait.jpg',
      caption: 'Profile photo',
      location: '',
      featured: true,
    });
  }

  if (fs.existsSync(personalDir)) {
    walk(personalDir)
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .forEach((src, idx) => {
        const ext = path.extname(src).toLowerCase();
        const destName = `photo-${idx + 1}${ext}`;
        copyFile(src, path.join(PHOTO_ORIGINALS, destName));
        photos.push({
          id: `photo-${idx + 1}`,
          title: path.basename(src, ext),
          src: `/gallery/photos/thumb/${path.basename(destName, ext)}.jpg`,
          caption: path.basename(src, ext),
          location: '',
          featured: false,
        });
      });
  }

  if (photos.length) {
    fs.writeFileSync(path.join(DATA, 'photo-gallery.json'), JSON.stringify(photos, null, 2));
  }

  console.log('\nSync complete.');
  console.log(`  CV: ${cvPdf ? 'yes' : 'MISSING'}`);
  console.log(`  Portrait: ${portrait ? 'yes' : fs.existsSync(path.join(PUBLIC, 'portrait.jpg')) ? 'existing' : 'MISSING'}`);
  if (fs.existsSync(personalDir)) {
    console.log('  Photo originals copied — run: npm run photos:thumbs');
  }
}

main();
