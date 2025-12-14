#!/usr/bin/env node

/**
 * Generate SVG Placeholder Images
 * 
 * Creates professional-looking SVG placeholders for missing images
 * based on the AI_IMAGE_PROMPTS.md file.
 * 
 * Usage: node scripts/generate-placeholder-images.cjs
 */

const fs = require('fs');
const path = require('path');

const config = {
  promptsFile: path.join(__dirname, '../AI_IMAGE_PROMPTS.md'),
  publicDir: path.join(__dirname, '../public'),
};

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

const colorSchemes = {
  portfolio: { bg: '#1e3a8a', accent: '#3b82f6', text: '#ffffff' },
  service: { bg: '#1e40af', accent: '#60a5fa', text: '#ffffff' },
  team: { bg: '#374151', accent: '#9ca3af', text: '#ffffff' },
  hero: { bg: '#0f172a', accent: '#38bdf8', text: '#ffffff' },
  gallery: { bg: '#312e81', accent: '#818cf8', text: '#ffffff' },
  logo: { bg: '#0c4a6e', accent: '#0ea5e9', text: '#ffffff' },
  generic: { bg: '#1e40af', accent: '#60a5fa', text: '#ffffff' },
};

function generateSVG(options) {
  const { width, height, type, description, fileName } = options;
  const colors = colorSchemes[type] || colorSchemes.generic;
  
  const iconSVG = {
    portfolio: `<path d="M4 4h16v12H4V4zm2 2v8h12V6H6z" fill="${colors.accent}"/>`,
    service: `<circle cx="12" cy="8" r="3" fill="${colors.accent}"/><path d="M12 12c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4z" fill="${colors.accent}"/>`,
    team: `<circle cx="12" cy="8" r="4" fill="${colors.accent}"/><path d="M12 14c-5 0-8 3-8 6h16c0-3-3-6-8-6z" fill="${colors.accent}"/>`,
    hero: `<path d="M3 3h18v18H3V3zm2 2v14h14V5H5z" fill="${colors.accent}"/><path d="M8 8h8v8H8V8z" fill="${colors.accent}" opacity="0.5"/>`,
    gallery: `<path d="M4 4l4 4 4-4 4 4 4-4v12l-4-4-4 4-4-4-4 4V4z" fill="${colors.accent}"/>`,
    logo: `<circle cx="12" cy="12" r="8" fill="${colors.accent}"/><circle cx="12" cy="12" r="4" fill="${colors.bg}"/>`,
  };
  
  const icon = iconSVG[type] || iconSVG.portfolio;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${fileName}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${colors.accent};stop-opacity:0.8" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#grad-${fileName})"/>
  
  <!-- Pattern overlay -->
  <g opacity="0.1">
    ${Array.from({ length: Math.floor(width / 40) }).map((_, i) => 
      `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${height}" stroke="${colors.text}" stroke-width="1"/>`
    ).join('\n    ')}
    ${Array.from({ length: Math.floor(height / 40) }).map((_, i) => 
      `<line x1="0" y1="${i * 40}" x2="${width}" y2="${i * 40}" stroke="${colors.text}" stroke-width="1"/>`
    ).join('\n    ')}
  </g>
  
  <!-- Icon -->
  <g transform="translate(${width / 2 - 12}, ${height / 2 - 40})" opacity="0.3">
    <svg width="24" height="24" viewBox="0 0 24 24">
      ${icon}
    </svg>
  </g>
  
  <!-- Text -->
  <text x="${width / 2}" y="${height / 2 + 20}" 
        font-family="Arial, sans-serif" 
        font-size="${Math.min(width / 20, 24)}" 
        font-weight="600"
        fill="${colors.text}" 
        text-anchor="middle"
        opacity="0.9">
    ${description.split(' ').slice(0, 3).join(' ')}
  </text>
  
  <!-- Subtext -->
  <text x="${width / 2}" y="${height / 2 + 50}" 
        font-family="Arial, sans-serif" 
        font-size="${Math.min(width / 30, 16)}" 
        fill="${colors.text}" 
        text-anchor="middle"
        opacity="0.7">
    ${width}×${height} • ${type}
  </text>
</svg>`;
}

function parsePromptsFile() {
  const content = fs.readFileSync(config.promptsFile, 'utf-8');
  const images = [];
  
  // Extract image entries
  const entries = content.split('###').slice(1);
  
  entries.forEach(entry => {
    const pathMatch = entry.match(/\*\*Path\*\*:\s*`([^`]+)`/);
    const typeMatch = entry.match(/\*\*Type\*\*:\s*(\w+)/);
    const descriptionMatch = entry.match(/\*\*Description\*\*:\s*([^\n]+)/);
    const dimensionsMatch = entry.match(/Width:\s*(\d+)px.*Height:\s*(\d+)px/s);
    
    if (pathMatch && typeMatch && descriptionMatch) {
      const imagePath = pathMatch[1];
      
      // Skip dynamic paths like ${service.slug}.jpg
      if (imagePath.includes('${')) return;
      
      const width = dimensionsMatch ? parseInt(dimensionsMatch[1]) : 1200;
      const height = dimensionsMatch ? parseInt(dimensionsMatch[2]) : 800;
      
      images.push({
        path: imagePath,
        type: typeMatch[1],
        description: descriptionMatch[1].trim(),
        width,
        height,
        fileName: path.basename(imagePath, path.extname(imagePath)),
      });
    }
  });
  
  return images;
}

function generateImages() {
  log('\n🎨 Generating Placeholder Images...', 'cyan');
  
  const images = parsePromptsFile();
  log(`   Found ${images.length} images to generate`, 'blue');
  
  let generated = 0;
  let skipped = 0;
  
  images.forEach(img => {
    const fullPath = path.join(config.publicDir, img.path);
    const dir = path.dirname(fullPath);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Check if file already exists
    if (fs.existsSync(fullPath)) {
      skipped++;
      return;
    }
    
    // Generate SVG
    const svg = generateSVG(img);
    
    // Convert .jpg/.png extensions to .svg for placeholders
    const svgPath = fullPath.replace(/\.(jpg|jpeg|png|webp)$/, '.svg');
    
    fs.writeFileSync(svgPath, svg);
    generated++;
    
    log(`   ✓ ${img.path} → ${path.basename(svgPath)}`, 'green');
  });
  
  log(`\n✅ Generated ${generated} placeholder images`, 'green');
  if (skipped > 0) {
    log(`   ⏭️  Skipped ${skipped} existing images`, 'yellow');
  }
}

function updateImageReferences() {
  log('\n🔧 Updating Image References...', 'cyan');
  
  const srcDir = path.join(__dirname, '../src');
  
  function updateFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let updated = false;
    
    // Replace image extensions with .svg
    const updatedContent = content.replace(
      /\/images\/(projects|services|gallery|team)\/([^'"]+)\.(jpg|jpeg|png|webp)/g,
      (match, folder, filename, ext) => {
        updated = true;
        return `/images/${folder}/${filename}.svg`;
      }
    );
    
    if (updated) {
      fs.writeFileSync(filePath, updatedContent);
      log(`   ✓ ${path.relative(srcDir, filePath)}`, 'green');
      return true;
    }
    
    return false;
  }
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let updatedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
        updatedCount += processDirectory(filePath);
      } else if (file.endsWith('.jsx') || file.endsWith('.tsx')) {
        if (updateFile(filePath)) {
          updatedCount++;
        }
      }
    });
    
    return updatedCount;
  }
  
  const updatedFiles = processDirectory(srcDir);
  log(`\n✅ Updated ${updatedFiles} files with SVG references`, 'green');
}

// Main execution
try {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  🖼️  Image Placeholder Generator', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  generateImages();
  updateImageReferences();
  
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  ✅ COMPLETE', 'green');
  log('═══════════════════════════════════════════════════', 'cyan');
  log('\nPlaceholder images generated successfully!', 'green');
  log('Image references updated to use SVG format.', 'blue');
  log('\nNext steps:', 'cyan');
  log('  1. Check the browser - images should now display', 'blue');
  log('  2. Use AI_IMAGE_PROMPTS.md to generate real images', 'blue');
  log('  3. Replace SVG placeholders with AI-generated images', 'blue');
  
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
}
