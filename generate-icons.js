import sharp from 'sharp';
import fs from 'fs';

async function generateIcons() {
  try {
    // Gerar ícone 192x192
    await sharp('public/icon.svg')
      .resize(192, 192)
      .png()
      .toFile('public/pwa-192x192.png');
    
    // Gerar ícone 512x512
    await sharp('public/icon.svg')
      .resize(512, 512)
      .png()
      .toFile('public/pwa-512x512.png');
    
    // Gerar apple-touch-icon
    await sharp('public/icon.svg')
      .resize(180, 180)
      .png()
      .toFile('public/apple-touch-icon.png');
    
    // Gerar favicon
    await sharp('public/icon.svg')
      .resize(32, 32)
      .png()
      .toFile('public/favicon.png');
    
    console.log('✅ Ícones PWA gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
  }
}

generateIcons();
