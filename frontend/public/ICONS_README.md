# PWA Icons

## Gerando Ícones

O arquivo `icon.svg` contém o ícone base do aplicativo. Para gerar os ícones PNG necessários:

### Opção 1: Ferramentas Online
1. Acesse https://realfavicongenerator.net/
2. Faça upload do `icon.svg`
3. Baixe os ícones gerados (192x192 e 512x512)
4. Renomeie para `icon-192.png` e `icon-512.png`

### Opção 2: ImageMagick (via terminal)
```bash
# Instalar ImageMagick se necessário
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# Gerar ícones
magick convert icon.svg -resize 192x192 icon-192.png
magick convert icon.svg -resize 512x512 icon-512.png
```

### Opção 3: Node.js Script
```bash
npm install sharp
node generate-icons.js
```

## Ícones Necessários
- `icon-192.png` - Ícone 192x192 para PWA
- `icon-512.png` - Ícone 512x512 para PWA

Ambos estão referenciados em `manifest.json`.
