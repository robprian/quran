const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogos() {
  const inputPath = path.join(__dirname, '../public/logo.png');
  
  if (!fs.existsSync(inputPath)) {
    console.error('logo.png not found');
    return;
  }
  
  const metadata = await sharp(inputPath).metadata();
  const width = metadata.width;
  const height = metadata.height;
  const halfWidth = Math.floor(width / 2);

  // Left side: Light Mode (white logo usually for dark themes? Wait. The user said: "LEFT logo -> Light mode (white), RIGHT logo -> Dark mode".)
  // We'll trust the user's mapping: logo-light.png = Left, logo-dark.png = Right.
  
  const leftOptions = { left: 0, top: 0, width: halfWidth, height: height };
  const rightOptions = { left: halfWidth, top: 0, width: width - halfWidth, height: height };

  await sharp(inputPath)
    .extract(leftOptions)
    .toFile(path.join(__dirname, '../public/logo-light.png'));

  await sharp(inputPath)
    .extract(rightOptions)
    .toFile(path.join(__dirname, '../public/logo-dark.png'));

  // Also create favicons
  await sharp(inputPath)
    .extract(leftOptions)
    .resize(64, 64)
    .toFile(path.join(__dirname, '../public/favicon-light.ico'));

  await sharp(inputPath)
    .extract(rightOptions)
    .resize(64, 64)
    .toFile(path.join(__dirname, '../public/favicon-dark.ico'));

  // Create PWA versions to be safe (192, 512 are handled by manifest.json natively usually, but we resize them here just in case they are needed exactly)
  /* PWA manifest usually rescales, so just providing the split PNGs for manifest is fine as they are high-res. */
  console.log('Logo splitting and favicon generation complete.');
}

processLogos().catch(console.error);
