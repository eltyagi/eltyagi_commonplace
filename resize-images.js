import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_DIMENSION = 1600;
const QUALITY = 82;

async function resizeImage(filePath) {
  const filename = path.basename(filePath);

  // Skip non-image files
  if (!filename.match(/\.(jpg|jpeg|png|gif)$/i)) {
    console.log(`Skipping ${filename} (not an image)`);
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Check if resize is needed
    const needsResize = metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION;

    if (!needsResize) {
      console.log(`Skipping ${filename} (already within ${MAX_DIMENSION}px)`);
      return;
    }

    console.log(`Resizing ${filename} from ${metadata.width}x${metadata.height}...`);

    // Resize to max dimension while maintaining aspect ratio
    await image
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: QUALITY })
      .toFile(filePath + '.tmp');

    // Replace original with resized version
    fs.renameSync(filePath + '.tmp', filePath);

    const newMetadata = await sharp(filePath).metadata();
    const oldSize = (metadata.size / 1024).toFixed(0);
    const newSize = (newMetadata.size / 1024).toFixed(0);
    const savings = ((1 - newMetadata.size / metadata.size) * 100).toFixed(1);

    console.log(`✓ ${filename}: ${metadata.width}x${metadata.height} (${oldSize}KB) → ${newMetadata.width}x${newMetadata.height} (${newSize}KB, saved ${savings}%)`);
  } catch (error) {
    console.error(`Error processing ${filename}:`, error.message);
  }
}

async function main() {
  const sceneriesDir = path.resolve(process.cwd(), 'src/assets/sceneries');
  console.log(`Resizing images in ${sceneriesDir}...`);
  console.log(`Max dimension: ${MAX_DIMENSION}px, Quality: ${QUALITY}`);
  console.log('');

  const files = fs.readdirSync(sceneriesDir);

  for (const file of files) {
    const filePath = path.join(sceneriesDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      await resizeImage(filePath);
    }
  }

  console.log('');
  console.log('Done!');
}

main().catch(console.error);
