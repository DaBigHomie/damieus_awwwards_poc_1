#!/usr/bin/env node
/**
 * Scan React components to identify which images are actually referenced
 * Then we can copy only those images from WordPress
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

interface ImageReference {
  file: string;
  line: number;
  imagePath: string;
  context: string;
}

const imageReferences: ImageReference[] = [];
const imagePatterns = [
  /src=["']([^"']*\.(jpg|jpeg|png|gif|svg|webp))["']/gi,
  /background-image:\s*url\(["']?([^"')]*\.(jpg|jpeg|png|gif|svg|webp))["']?\)/gi,
  /import\s+.*\s+from\s+["']([^"']*\.(jpg|jpeg|png|gif|svg|webp))["']/gi,
  /["']([^"']*\/images\/[^"']*\.(jpg|jpeg|png|gif|svg|webp))["']/gi,
];

function scanFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    imagePatterns.forEach(pattern => {
      const matches = line.matchAll(new RegExp(pattern));
      for (const match of matches) {
        const imagePath = match[1];
        if (imagePath && !imagePath.startsWith('http')) {
          imageReferences.push({
            file: path.relative(projectRoot, filePath),
            line: index + 1,
            imagePath,
            context: line.trim().substring(0, 100)
          });
        }
      }
    });
  });
}

function scanDirectory(dir: string, extensions: string[] = ['.jsx', '.tsx', '.js', '.ts', '.css']) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // Skip node_modules, dist, build folders
    if (item === 'node_modules' || item === 'dist' || item === 'build' || item === '.git') {
      continue;
    }

    if (stat.isDirectory()) {
      scanDirectory(fullPath, extensions);
    } else if (extensions.some(ext => item.endsWith(ext))) {
      scanFile(fullPath);
    }
  }
}

function extractUniqueImages() {
  const uniqueImages = new Set<string>();
  
  imageReferences.forEach(ref => {
    // Normalize the path
    let normalizedPath = ref.imagePath;
    
    // Remove leading slashes
    normalizedPath = normalizedPath.replace(/^\/+/, '');
    
    // Extract just the filename if it's a full path
    if (normalizedPath.includes('/')) {
      uniqueImages.add(normalizedPath);
    }
  });

  return Array.from(uniqueImages).sort();
}

function categorizeImages(images: string[]) {
  const categories: Record<string, string[]> = {
    services: [],
    projects: [],
    gallery: [],
    logos: [],
    other: []
  };

  images.forEach(img => {
    if (img.includes('/services/')) {
      categories.services.push(img);
    } else if (img.includes('/projects/')) {
      categories.projects.push(img);
    } else if (img.includes('/gallery/')) {
      categories.gallery.push(img);
    } else if (img.includes('/logos/') || img.toLowerCase().includes('logo')) {
      categories.logos.push(img);
    } else {
      categories.other.push(img);
    }
  });

  return categories;
}

console.log('🔍 Scanning React components for image references...\n');

// Scan src directory
const srcDir = path.join(projectRoot, 'src');
scanDirectory(srcDir);

console.log(`📊 Found ${imageReferences.length} image references\n`);

// Extract unique images
const uniqueImages = extractUniqueImages();
console.log(`📸 Unique images needed: ${uniqueImages.length}\n`);

// Categorize images
const categorized = categorizeImages(uniqueImages);

console.log('📁 Images by category:');
console.log(`   Services: ${categorized.services.length}`);
console.log(`   Projects: ${categorized.projects.length}`);
console.log(`   Gallery: ${categorized.gallery.length}`);
console.log(`   Logos: ${categorized.logos.length}`);
console.log(`   Other: ${categorized.other.length}`);
console.log('');

// Save results
const results = {
  totalReferences: imageReferences.length,
  uniqueImages: uniqueImages.length,
  categories: categorized,
  allReferences: imageReferences,
  summary: {
    placeholderImages: uniqueImages.filter(img => 
      img.includes('placeholder') || 
      img.includes('hero') || 
      img.endsWith('.jpg') || 
      img.endsWith('.png')
    ).length,
    actualImages: uniqueImages.filter(img => 
      !img.includes('placeholder') && 
      (img.includes('Damieus') || img.endsWith('.webp'))
    ).length
  }
};

const outputPath = path.join(projectRoot, 'image-references-report.json');
fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

console.log(`✅ Report saved to: image-references-report.json`);
console.log('');
console.log('📋 Summary:');
console.log(`   - Placeholder/mock images: ${results.summary.placeholderImages}`);
console.log(`   - Actual WordPress images: ${results.summary.actualImages}`);
console.log('');

// List the actual images we need to copy from WordPress
const wordpressImages = uniqueImages.filter(img => 
  img.includes('Damieus') || 
  img.endsWith('.webp') ||
  img.includes('wordpress')
);

if (wordpressImages.length > 0) {
  console.log('🎯 WordPress images to copy:');
  wordpressImages.forEach(img => console.log(`   - ${img}`));
} else {
  console.log('⚠️  No WordPress images found in code yet. Components are using placeholder paths.');
}

console.log('');
console.log('💡 Next steps:');
console.log('   1. Update component image paths to use real image filenames');
console.log('   2. Copy only the referenced images from WordPress uploads');
console.log('   3. Run this script again to verify all images are present');
