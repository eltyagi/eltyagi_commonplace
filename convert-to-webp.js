import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUALITY = 82;

async function convertToWebP(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filename);

  // Skip non-image files and already converted WebP files
  if (!filename.match(/\.(jpg|jpeg|png)$/i)) {
    return;
  }

  const webpPath = filePath.replace(ext, '.webp');

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    console.log(`Converting ${filename} to WebP...`);

    await image
      .webp({ quality: QUALITY })
      .toFile(webpPath);

    const originalStats = fs.statSync(filePath);
    const webpStats = fs.statSync(webpPath);
    const originalSize = (originalStats.size / 1024).toFixed(0);
    const webpSize = (webpStats.size / 1024).toFixed(0);
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`✓ ${filename}: ${originalSize}KB → ${path.basename(webpPath)}: ${webpSize}KB (saved ${savings}%)`);
  } catch (error) {
    console.error(`Error converting ${filename}:`, error.message);
  }
}

async function main() {
  const sceneriesDir = path.resolve(process.cwd(), 'src/assets/sceneries');
  console.log(`Converting images to WebP in ${sceneriesDir}...`);
  console.log(`Quality: ${QUALITY}`);
  console.log('');

  const files = fs.readdirSync(sceneriesDir);

  for (const file of files) {
    const filePath = path.join(sceneriesDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      await convertToWebP(filePath);
    }
  }

  console.log('');
  console.log('Done!');
}

main().catch(console.error);
