import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const MAX_WIDTH = 1280;
export const JPEG_QUALITY = 82;
export const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.jfif']);
export const WATERMARK_ENABLED = process.env.PHOTOS_WATERMARK !== 'false';

export function loadProfileName(root) {
  try {
    const profile = JSON.parse(
      fs.readFileSync(path.join(root, 'data', 'profile.json'), 'utf8')
    );
    return profile.name || 'Xuliang Wang';
  } catch {
    return 'Xuliang Wang';
  }
}

function escapeXml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function createWatermarkSvg(width, height, text) {
  const fontSize = Math.max(14, Math.round(width * 0.028));
  const pad = Math.round(fontSize * 0.75);
  const label = escapeXml(text);
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <text
    x="${width - pad}"
    y="${height - pad}"
    text-anchor="end"
    font-family="Arial, Helvetica, sans-serif"
    font-size="${fontSize}"
    fill="rgba(255,255,255,0.78)"
    stroke="rgba(0,0,0,0.45)"
    stroke-width="1.2"
    paint-order="stroke"
  >${label}</text>
</svg>`);
}

export async function generateThumb(srcPath, destPath, watermarkText) {
  const before = fs.statSync(srcPath).size;
  const resized = sharp(srcPath).rotate().resize({
    width: MAX_WIDTH,
    withoutEnlargement: true,
  });
  const { data, info } = await resized.toBuffer({ resolveWithObject: true });

  let pipeline = sharp(data);
  if (WATERMARK_ENABLED && watermarkText) {
    const watermark = createWatermarkSvg(info.width, info.height, watermarkText);
    pipeline = pipeline.composite([{ input: watermark, top: 0, left: 0 }]);
  }

  await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(destPath);
  const after = fs.statSync(destPath).size;
  return { before, after };
}

export function saveJson(filePath, data) {
  const json = JSON.stringify(data, null, 2) + '\n';
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, json, 'utf8');
  try {
    fs.renameSync(tmp, filePath);
  } catch {
    fs.writeFileSync(filePath, json, 'utf8');
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* ignore */
    }
  }
}

export function archivePublicImages(publicDir, originalsDir, thumbDirName = 'thumb') {
  if (!fs.existsSync(publicDir)) return;
  fs.mkdirSync(originalsDir, { recursive: true });
  for (const name of fs.readdirSync(publicDir)) {
    if (name === thumbDirName) continue;
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const from = path.join(publicDir, name);
    const to = path.join(originalsDir, name);
    if (!fs.existsSync(to)) {
      fs.copyFileSync(from, to);
      console.log(`Archived original → ${path.relative(process.cwd(), to)}`);
    }
    try {
      fs.unlinkSync(from);
      console.log(`Removed from public: ${path.relative(process.cwd(), from)}`);
    } catch {
      console.warn(`Could not remove (file in use?): ${path.relative(process.cwd(), from)}`);
    }
  }
}

export function findItemByFilename(gallery, filename) {
  const base = path.basename(filename);
  const stem = path.basename(filename, path.extname(filename));
  return gallery.find(
    (g) =>
      g.id === stem ||
      g.src?.endsWith(`/${base}`) ||
      g.src?.endsWith(`/${stem}.png`) ||
      g.src?.endsWith(`/${stem}.jpg`) ||
      g.src?.endsWith(`/${stem}.jpeg`) ||
      g.src?.endsWith(`/${stem}.jfif`)
  );
}
