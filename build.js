// Script de build para Cloudflare Pages
// Copia todos os arquivos necessários para a pasta dist

const fs = require('fs');
const path = require('path');

// Criar pasta dist se não existir
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Função para copiar arquivos e pastas (ignorando arquivos desnecessários)
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  // Arquivos e pastas para ignorar
  const ignoreList = ['.scss', '.css.map', 'node_modules', '.git', 'dist'];
  const itemName = path.basename(src);
  
  if (ignoreList.some(ignore => itemName.includes(ignore))) {
    return; // Ignorar este item
  }
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    // Ignorar arquivos .scss e .map
    if (!src.endsWith('.scss') && !src.endsWith('.css.map')) {
      fs.copyFileSync(src, dest);
    }
  }
}

// Arquivos e pastas para copiar
const filesToCopy = [
  'index.html',
  'app.js',
  '_headers',
  '_redirects',
  'assets',
  'styles'
];

// Copiar cada item
filesToCopy.forEach(item => {
  const srcPath = path.join(__dirname, item);
  const destPath = path.join(distDir, item);
  
  if (fs.existsSync(srcPath)) {
    copyRecursiveSync(srcPath, destPath);
    console.log(`✓ Copiado: ${item}`);
  } else {
    console.log(`✗ Não encontrado: ${item}`);
  }
});

console.log('\n✅ Build concluído! Arquivos copiados para a pasta dist/');

