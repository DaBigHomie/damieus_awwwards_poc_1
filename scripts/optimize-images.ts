#!/usr/bin/env node
/**
 * Image Optimization & Cleanup Script
 * - Removes unused/duplicate images
 * - Converts images to WebP format
 * - Optimizes image sizes
 */

import { readdir, stat, unlink, rename, copyFile } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

const GALLERY_DIR = join(process.cwd(), 'public/images/gallery');
const LOGOS_DIR = join(process.cwd(), 'public/images/logos');

interface ImageStats {
  total: number;
  duplicates: number;
  removed: number;
  converted: number;
  sizeReduced: number;
}

const stats: ImageStats = {
  total: 0,
  duplicates: 0,
  removed: 0,
  converted: 0,
  sizeReduced: 0,
};

async function getAllImages(dir: string): Promise<string[]> {
  const images: string[] = [];
  
  try {
    const files = await readdir(dir);
    
    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);
      
      if (fileStat.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file)) {
        images.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return images;
}

async function findDuplicates(images: string[]): Promise<Map<string, string[]>> {
  const duplicates = new Map<string, string[]>();
  const seen = new Map<string, string>();
  
  console.log('🔍 Scanning for duplicates by filename pattern...');
  
  for (const imagePath of images) {
    const fileName = basename(imagePath);
    // Extract base name without size suffixes (e.g., image-150x150, image-300x300)
    const baseMatch = fileName.match(/^(.+?)(?:-\d+x\d+)?(\.\w+)$/);
    
    if (baseMatch) {
      const baseName = baseMatch[1];
      
      if (seen.has(baseName)) {
        if (!duplicates.has(baseName)) {
          duplicates.set(baseName, [seen.get(baseName)!]);
        }
        duplicates.get(baseName)!.push(imagePath);
      } else {
        seen.set(baseName, imagePath);
      }
    }
  }
  
  return duplicates;
}

async function removeDuplicates(images: string[]): Promise<void> {
  console.log('\n🗑️  Removing duplicate images (keeping only largest versions)...');
  
  const duplicates = await findDuplicates(images);
  
  for (const [baseName, paths] of duplicates) {
    console.log(`\n  Found ${paths.length} versions of: ${baseName}`);
    
    // Keep only the largest version
    let largest: { path: string; size: number } | null = null;
    
    for (const path of paths) {
      const fileStat = await stat(path);
      
      if (!largest || fileStat.size > largest.size) {
        // Delete previous largest
        if (largest) {
          await unlink(largest.path);
          stats.removed++;
          console.log(`    ❌ Removed: ${basename(largest.path)} (${(largest.size / 1024).toFixed(2)} KB)`);
        }
        
        largest = { path, size: fileStat.size };
      } else {
        // Delete smaller version
        await unlink(path);
        stats.removed++;
        console.log(`    ❌ Removed: ${basename(path)} (${(fileStat.size / 1024).toFixed(2)} KB)`);
      }
    }
    
    if (largest) {
      console.log(`    ✅ Kept: ${basename(largest.path)} (${(largest.size / 1024).toFixed(2)} KB)`);
      stats.duplicates++;
    }
  }
}

async function convertToWebP(imagePath: string): Promise<boolean> {
  const ext = extname(imagePath).toLowerCase();
  
  // Skip if already WebP
  if (ext === '.webp') {
    return false;
  }
  
  const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  try {
    // Use sharp if available, otherwise skip
    execSync(`npx sharp-cli resize 1920 --input "${imagePath}" --output "${webpPath}" --quality 85`, {
      stdio: 'pipe',
    });
    
    // Compare file sizes
    const originalSize = (await stat(imagePath)).size;
    const webpSize = (await stat(webpPath)).size;
    
    // If WebP is smaller, delete original
    if (webpSize < originalSize) {
      await unlink(imagePath);
      stats.sizeReduced += (originalSize - webpSize);
      stats.converted++;
      console.log(`    ✅ Converted to WebP: ${basename(webpPath)} (${((originalSize - webpSize) / 1024).toFixed(2)} KB saved)`);
      return true;
    } else {
      // WebP is larger, keep original
      await unlink(webpPath);
      console.log(`    ⚠️  Skipped: ${basename(imagePath)} (WebP larger than original)`);
      return false;
    }
  } catch (error) {
    console.log(`    ❌ Failed to convert: ${basename(imagePath)}`);
    return false;
  }
}

async function optimizeImages(): Promise<void> {
  console.log('\n🖼️  Optimizing images to WebP format...');
  
  const images = await getAllImages(GALLERY_DIR);
  
  // Convert only first 100 images to test (to avoid overwhelming)
  const imagesToConvert = images.slice(0, 100);
  
  console.log(`\n  Converting ${imagesToConvert.length} images...`);
  
  for (const imagePath of imagesToConvert) {
    await convertToWebP(imagePath);
  }
}

async function cleanupByUsage(): Promise<void> {
  console.log('\n🧹 Removing unused WordPress-specific images...');
  
  const images = await getAllImages(GALLERY_DIR);
  const unusedPatterns = [
    /^0[0-9a-f]{4}/, // WordPress hash-based filenames
    /admin-columns/i,
    /advanced-database/i,
    /plugin/i,
    /-zip$/i,
  ];
  
  for (const imagePath of images) {
    const fileName = basename(imagePath);
    
    for (const pattern of unusedPatterns) {
      if (pattern.test(fileName)) {
        await unlink(imagePath);
        stats.removed++;
        console.log(`  ❌ Removed unused: ${fileName}`);
        break;
      }
    }
  }
}

async function generateReport(): Promise<void> {
  console.log('\n\n📊 Image Optimization Report');
  console.log('═'.repeat(50));
  console.log(`Total images scanned: ${stats.total}`);
  console.log(`Duplicate sets found: ${stats.duplicates}`);
  console.log(`Images removed: ${stats.removed}`);
  console.log(`Images converted to WebP: ${stats.converted}`);
  console.log(`Total size reduced: ${(stats.sizeReduced / 1024 / 1024).toFixed(2)} MB`);
  console.log('═'.repeat(50));
  
  // Count remaining images
  const remaining = await getAllImages(GALLERY_DIR);
  console.log(`\nRemaining images: ${remaining.length}`);
}

async function main() {
  console.log('🚀 Starting Image Optimization & Cleanup...\n');
  
  try {
    // Get all images
    const images = await getAllImages(GALLERY_DIR);
    stats.total = images.length;
    
    console.log(`📁 Found ${stats.total} images in gallery\n`);
    
    // Step 1: Remove duplicates
    await removeDuplicates(images);
    
    // Step 2: Remove unused WordPress images
    await cleanupByUsage();
    
    // Step 3: Optimize images (commented out to run manually)
    // await optimizeImages();
    
    // Generate report
    await generateReport();
    
    console.log('\n✅ Image optimization complete!');
    console.log('\nTo convert images to WebP, install sharp:');
    console.log('  npm install --save-dev sharp-cli');
    console.log('Then uncomment the optimizeImages() call in the script.');
    
  } catch (error) {
    console.error('❌ Error during optimization:', error);
    process.exit(1);
  }
}

main();
