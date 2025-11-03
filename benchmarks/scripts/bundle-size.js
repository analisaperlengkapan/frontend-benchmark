#!/usr/bin/env node

/**
 * Bundle Size Analysis Script
 * Analyzes and compares bundle sizes across framework implementations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IMPLEMENTATIONS_DIR = path.join(__dirname, '../../implementations');
const RESULTS_DIR = path.join(__dirname, '../results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Get directory size recursively
 */
function getDirectorySize(dirPath) {
  let totalSize = 0;
  
  function traverse(currentPath) {
    const stats = fs.statSync(currentPath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      const files = fs.readdirSync(currentPath);
      files.forEach(file => {
        traverse(path.join(currentPath, file));
      });
    }
  }
  
  if (fs.existsSync(dirPath)) {
    traverse(dirPath);
  }
  
  return totalSize;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get gzipped size
 */
function getGzippedSize(filePath) {
  if (!fs.existsSync(filePath)) return 0;
  
  try {
    const output = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
    return parseInt(output.trim());
  } catch (e) {
    return 0;
  }
}

/**
 * Analyze a framework implementation
 */
function analyzeImplementation(frameworkName) {
  const implPath = path.join(IMPLEMENTATIONS_DIR, frameworkName);
  const distPath = path.join(implPath, 'dist');
  
  console.log(`\nAnalyzing ${frameworkName}...`);
  
  const result = {
    framework: frameworkName,
    timestamp: new Date().toISOString(),
    exists: fs.existsSync(distPath),
    distSize: 0,
    jsFiles: [],
    cssFiles: [],
    wasmFiles: [],
    totalJS: 0,
    totalCSS: 0,
    totalWASM: 0,
    totalGzipped: 0
  };
  
  if (!result.exists) {
    console.log(`  ⚠️  No dist directory found. Run build first.`);
    return result;
  }
  
  result.distSize = getDirectorySize(distPath);
  
  // Find and analyze files
  function scanDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      const relPath = path.join(relativePath, file);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        scanDirectory(fullPath, relPath);
      } else if (stats.isFile()) {
        const ext = path.extname(file).toLowerCase();
        const size = stats.size;
        const gzippedSize = getGzippedSize(fullPath);
        
        const fileInfo = {
          name: relPath,
          size: size,
          sizeFormatted: formatBytes(size),
          gzippedSize: gzippedSize,
          gzippedFormatted: formatBytes(gzippedSize)
        };
        
        if (ext === '.js') {
          result.jsFiles.push(fileInfo);
          result.totalJS += size;
          result.totalGzipped += gzippedSize;
        } else if (ext === '.css') {
          result.cssFiles.push(fileInfo);
          result.totalCSS += size;
          result.totalGzipped += gzippedSize;
        } else if (ext === '.wasm') {
          result.wasmFiles.push(fileInfo);
          result.totalWASM += size;
          result.totalGzipped += gzippedSize;
        }
      }
    });
  }
  
  scanDirectory(distPath);
  
  // Sort files by size
  result.jsFiles.sort((a, b) => b.size - a.size);
  result.cssFiles.sort((a, b) => b.size - a.size);
  result.wasmFiles.sort((a, b) => b.size - a.size);
  
  // Print summary
  console.log(`  📦 Total dist size: ${formatBytes(result.distSize)}`);
  console.log(`  📄 JavaScript: ${formatBytes(result.totalJS)} (gzipped: ${formatBytes(result.totalGzipped)})`);
  console.log(`  🎨 CSS: ${formatBytes(result.totalCSS)}`);
  if (result.totalWASM > 0) {
    console.log(`  ⚙️  WASM: ${formatBytes(result.totalWASM)}`);
  }
  
  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Frontend Framework Bundle Size Analysis\n');
  console.log('=' .repeat(60));
  
  const frameworks = ['react', 'vue', 'angular', 'blade', 'leptos', 'yew', 'dioxus'];
  const results = [];
  
  for (const framework of frameworks) {
    const result = analyzeImplementation(framework);
    results.push(result);
  }
  
  // Generate comparison table
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Bundle Size Comparison:\n');
  
  const validResults = results.filter(r => r.exists);
  validResults.sort((a, b) => a.totalGzipped - b.totalGzipped);
  
  console.log('Framework'.padEnd(15) + 'JS (gzipped)'.padEnd(20) + 'CSS'.padEnd(15) + 'Total');
  console.log('-'.repeat(60));
  
  validResults.forEach(r => {
    const jsSize = formatBytes(r.totalGzipped);
    const cssSize = formatBytes(r.totalCSS);
    const total = formatBytes(r.totalJS + r.totalCSS + r.totalWASM);
    
    console.log(
      r.framework.padEnd(15) +
      jsSize.padEnd(20) +
      cssSize.padEnd(15) +
      total
    );
  });
  
  // Save results
  const outputPath = path.join(RESULTS_DIR, 'bundle-sizes.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to ${outputPath}`);
  
  // Find winner
  if (validResults.length > 0) {
    const winner = validResults[0];
    console.log(`\n🏆 Smallest bundle: ${winner.framework} (${formatBytes(winner.totalGzipped)} gzipped)`);
  }
}

main().catch(console.error);
