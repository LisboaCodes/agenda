// Script to generate PWA icons from SVG
// Run: npm install sharp && node public/generate-icons.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputSvg = path.join(__dirname, 'icon.svg');

async function generateIcons() {
  console.log('Generating PWA icons...');

  for (const size of sizes) {
    const outputPath = path.join(__dirname, `icon-${size}.png`);

    try {
      await sharp(inputSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated ${outputPath}`);
    } catch (error) {
      console.error(`✗ Error generating icon-${size}.png:`, error.message);
    }
  }

  console.log('Done!');
}

generateIcons();
