#!/usr/bin/env node

/**
 * Generate AI Prompts for Missing Project Images
 * 
 * Scans JSX files for hardcoded image paths, checks if images exist,
 * and generates Midjourney prompts for missing images.
 * 
 * Usage: node scripts/generate-missing-image-prompts.cjs [--dalle|--midjourney|--sd]
 */

const fs = require('fs');
const path = require('path');

const config = {
  srcDir: path.join(__dirname, '../src'),
  publicDir: path.join(__dirname, '../public'),
  aiStyle: process.argv.find(arg => arg.startsWith('--dalle')) ? 'dalle' :
           process.argv.find(arg => arg.startsWith('--sd')) ? 'stable-diffusion' : 'midjourney',
};

const results = {
  missingImages: [],
  existingImages: [],
  prompts: [],
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

function findFiles(dir, extensions, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findFiles(filePath, extensions, fileList);
    } else if (extensions.some(ext => file.endsWith(ext))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function extractImagePaths(content, filePath) {
  const imagePaths = [];
  
  // Match various image path patterns
  const patterns = [
    // Direct strings in JSX: '/images/...'
    /['"`]\/images\/([^'"`]+\.(?:jpg|jpeg|png|webp|svg))['"`]/gi,
    // Template literals: ${variable}/images/...
    /\$\{[^}]+\}\/images\/([^'"`]+\.(?:jpg|jpeg|png|webp|svg))/gi,
    // Object properties: hero: '/images/...'
    /:\s*['"`]\/images\/([^'"`]+\.(?:jpg|jpeg|png|webp|svg))['"`]/gi,
    // URL in data: url: '/images/...'
    /url:\s*['"`]\/images\/([^'"`]+\.(?:jpg|jpeg|png|webp|svg))['"`]/gi,
  ];
  
  patterns.forEach(regex => {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const imagePath = `/images/${match[1]}`;
      const fullPath = path.join(config.publicDir, imagePath);
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      // Extract context around the image
      const contextStart = Math.max(0, match.index - 200);
      const contextEnd = Math.min(content.length, match.index + 200);
      const context = content.substring(contextStart, contextEnd);
      
      imagePaths.push({
        path: imagePath,
        fullPath,
        file: filePath,
        line: lineNumber,
        context,
        exists: fs.existsSync(fullPath),
      });
    }
  });
  
  return imagePaths;
}

function inferImageContext(imagePath, contextString) {
  const fileName = path.basename(imagePath, path.extname(imagePath));
  const dirName = path.basename(path.dirname(imagePath));
  
  // Parse context from filename and surrounding code
  let type = 'generic';
  let description = fileName.replace(/-/g, ' ');
  let category = dirName;
  
  // Detect image type from path
  if (imagePath.includes('/projects/')) {
    type = 'portfolio';
    description = fileName.replace(/-/g, ' ').replace(/\d+$/, '').trim();
  } else if (imagePath.includes('/services/')) {
    type = 'service';
    description = fileName.replace(/-/g, ' ');
  } else if (imagePath.includes('/team/')) {
    type = 'team';
    description = `team member ${fileName}`;
  } else if (imagePath.includes('/gallery/')) {
    type = 'gallery';
    description = fileName.replace(/-/g, ' ');
  } else if (imagePath.includes('/logos/')) {
    type = 'logo';
    description = `company logo ${fileName}`;
  }
  
  // Extract more context from surrounding code
  const contextLower = contextString.toLowerCase();
  
  if (contextLower.includes('hero')) {
    type = 'hero';
  } else if (contextLower.includes('banner')) {
    type = 'hero';
  } else if (contextLower.includes('dashboard')) {
    description += ' dashboard interface';
  } else if (contextLower.includes('mobile')) {
    description += ' mobile view';
  } else if (contextLower.includes('ui') || contextLower.includes('interface')) {
    description += ' user interface';
  }
  
  return { type, description, category };
}

function generateAIPrompt(imagePath, context) {
  const { type, description, category } = inferImageContext(imagePath, context.context);
  
  const prompts = {
    midjourney: {
      hero: `${description}, professional website hero banner, cinematic wide angle, modern clean design, high quality commercial photography, dramatic lighting, 16:9 aspect ratio --ar 16:9 --v 6 --style raw --s 750`,
      
      portfolio: `${description}, professional project showcase photography, modern aesthetic, high-end commercial style, detailed composition, dramatic lighting, sharp focus, portfolio quality --ar 3:2 --v 6 --style raw --s 500`,
      
      service: `${description}, modern professional illustration, clean minimal design, corporate blue and white color scheme, isometric view, soft shadows, vector style, professional business aesthetic --ar 4:3 --v 6 --s 400`,
      
      team: `professional corporate headshot of ${description}, studio lighting, neutral gray background, business attire, confident and approachable expression, high resolution portrait photography --ar 1:1 --v 6 --s 300`,
      
      gallery: `${description}, professional photography, modern composition, commercial quality, excellent lighting, sharp focus, clean aesthetic --ar 4:3 --v 6 --style raw --s 500`,
      
      logo: `${description}, professional logo design, clean minimal, vector style, corporate identity, scalable, simple shapes --v 6 --s 200`,
      
      generic: `${description}, professional high quality photography, modern aesthetic, commercial style, clean composition, excellent lighting --ar 4:3 --v 6 --style raw`,
    },
    
    dalle: {
      hero: `Professional wide banner image showing ${description}. Cinematic composition, dramatic lighting, high quality commercial photography, modern professional aesthetic. Ultra-detailed, 16:9 composition, perfect for website hero section.`,
      
      portfolio: `Professional showcase photograph of ${description}. High-end commercial photography with dramatic lighting and excellent composition. Modern professional aesthetic, portfolio quality. Dimensions: 1200x800.`,
      
      service: `Modern clean illustration representing ${description}. Minimalist design with corporate blue accents. Professional contemporary style, suitable for business website. Dimensions: 800x600.`,
      
      team: `Professional corporate headshot portrait of ${description}. Studio lighting, neutral background, business attire, confident expression. High resolution photography, square composition.`,
      
      gallery: `Professional photography of ${description}. Commercial quality with modern composition and excellent lighting. Clean aesthetic, sharp focus.`,
      
      logo: `Professional logo design for ${description}. Clean minimal style, vector graphics, corporate identity, simple and scalable.`,
      
      generic: `Professional high-quality photograph of ${description}. Modern aesthetic, commercial photography style, excellent lighting and composition.`,
    },
    
    'stable-diffusion': {
      hero: `${description}, professional website banner, wide angle, cinematic lighting, commercial photography, modern clean design, 16:9 ratio, photorealistic, ultra detailed, 4k quality`,
      
      portfolio: `${description}, professional project photography, high-end commercial style, modern aesthetic, dramatic lighting, sharp focus, 3:2 ratio, photorealistic, detailed`,
      
      service: `${description}, modern professional illustration, clean design, corporate blue colors, isometric view, vector style, minimalist, professional`,
      
      team: `professional headshot portrait, ${description}, studio lighting, neutral background, business attire, confident expression, high resolution, photorealistic`,
      
      gallery: `${description}, professional photography, modern composition, commercial quality, excellent lighting, sharp focus, photorealistic`,
      
      logo: `${description}, professional logo design, clean minimal, vector style, corporate, scalable, simple shapes`,
      
      generic: `${description}, professional photography, modern aesthetic, commercial style, excellent lighting, sharp composition, photorealistic`,
    },
  };
  
  const promptTemplate = prompts[config.aiStyle][type] || prompts[config.aiStyle].generic;
  
  return {
    path: imagePath,
    type,
    category,
    description,
    prompt: promptTemplate,
    aiPlatform: config.aiStyle,
  };
}

function scanForMissingImages() {
  log('\n🔍 Scanning for Image References...', 'cyan');
  
  const files = findFiles(config.srcDir, ['.jsx', '.tsx', '.js', '.ts']);
  log(`   Found ${files.length} files to scan`, 'blue');
  
  const allImages = new Map();
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const images = extractImagePaths(content, file);
    
    images.forEach(img => {
      if (!allImages.has(img.path)) {
        allImages.set(img.path, img);
      }
    });
  });
  
  log(`   Found ${allImages.size} unique image references\n`, 'blue');
  
  // Categorize images
  allImages.forEach((img) => {
    if (img.exists) {
      results.existingImages.push(img);
    } else {
      results.missingImages.push(img);
      const prompt = generateAIPrompt(img.path, img);
      results.prompts.push(prompt);
    }
  });
  
  log(`   ✅ Existing: ${results.existingImages.length}`, 'green');
  log(`   ❌ Missing: ${results.missingImages.length}`, results.missingImages.length > 0 ? 'red' : 'green');
}

function generateReport() {
  const reportPath = path.join(__dirname, '../AI_IMAGE_PROMPTS.md');
  
  let report = `# AI Image Generation Prompts\n\n`;
  report += `**Generated**: ${new Date().toISOString()}\n`;
  report += `**AI Platform**: ${config.aiStyle.toUpperCase()}\n\n`;
  report += `## Summary\n\n`;
  report += `- **Total Image References**: ${results.existingImages.length + results.missingImages.length}\n`;
  report += `- **Existing Images**: ${results.existingImages.length}\n`;
  report += `- **Missing Images**: ${results.missingImages.length}\n`;
  report += `- **Prompts Generated**: ${results.prompts.length}\n\n`;
  
  if (results.prompts.length > 0) {
    report += `## 🎨 Generated Prompts (${config.aiStyle.toUpperCase()})\n\n`;
    
    results.prompts.forEach((prompt, i) => {
      report += `### ${i + 1}. ${path.basename(prompt.path)}\n\n`;
      report += `**Path**: \`${prompt.path}\`\n`;
      report += `**Type**: ${prompt.type}\n`;
      report += `**Category**: ${prompt.category}\n`;
      report += `**Description**: ${prompt.description}\n\n`;
      report += `**${config.aiStyle.toUpperCase()} Prompt**:\n`;
      report += `\`\`\`\n${prompt.prompt}\n\`\`\`\n\n`;
      report += `**Required Dimensions**:\n`;
      
      if (prompt.type === 'hero') {
        report += `- Width: 1920px\n- Height: 1080px\n- Ratio: 16:9\n\n`;
      } else if (prompt.type === 'portfolio') {
        report += `- Width: 1200px\n- Height: 800px\n- Ratio: 3:2\n\n`;
      } else if (prompt.type === 'service') {
        report += `- Width: 800px\n- Height: 600px\n- Ratio: 4:3\n\n`;
      } else if (prompt.type === 'team') {
        report += `- Width: 400px\n- Height: 400px\n- Ratio: 1:1\n\n`;
      } else {
        report += `- Width: 1200px\n- Height: 800px\n- Ratio: 3:2\n\n`;
      }
      
      report += `---\n\n`;
    });
  }
  
  if (results.missingImages.length > 0) {
    report += `## 📁 Missing Image Files\n\n`;
    results.missingImages.forEach((img, i) => {
      report += `${i + 1}. **${img.path}**\n`;
      report += `   - File: ${path.relative(config.srcDir, img.file)}:${img.line}\n`;
      report += `   - Expected location: \`${img.fullPath}\`\n\n`;
    });
  }
  
  fs.writeFileSync(reportPath, report);
  log(`\n📄 Report saved: ${reportPath}`, 'green');
}

function printResults() {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  📊 RESULTS', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  log(`\nTotal Images Referenced: ${results.existingImages.length + results.missingImages.length}`, 'blue');
  log(`Existing Images: ${results.existingImages.length}`, 'green');
  log(`Missing Images: ${results.missingImages.length}`, results.missingImages.length > 0 ? 'red' : 'green');
  log(`AI Prompts Generated: ${results.prompts.length}`, 'magenta');
  log(`AI Platform: ${config.aiStyle.toUpperCase()}`, 'cyan');
  
  log(`\n${'='.repeat(53)}`, 'cyan');
  
  if (results.prompts.length > 0) {
    log(`\n✅ Generated ${results.prompts.length} AI prompts!`, 'green');
    log(`   See AI_IMAGE_PROMPTS.md for details`, 'blue');
  } else {
    log(`\n✅ All images exist!`, 'green');
  }
}

// Main execution
try {
  log('\n═══════════════════════════════════════════════════', 'cyan');
  log('  🎨 AI Image Prompt Generator', 'cyan');
  log('═══════════════════════════════════════════════════', 'cyan');
  
  scanForMissingImages();
  generateReport();
  printResults();
  
} catch (error) {
  log(`\n❌ Error: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
}
