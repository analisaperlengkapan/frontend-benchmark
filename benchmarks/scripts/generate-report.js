#!/usr/bin/env node

/**
 * Report Generation Script
 * Generates markdown report from benchmark results
 */

const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../results');
const OUTPUT_FILE = path.join(__dirname, '../../RESULTS.md');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateReport() {
  console.log('\n📝 Generating benchmark report...\n');
  
  // Load bundle size results
  const bundleSizePath = path.join(RESULTS_DIR, 'bundle-sizes.json');
  let bundleResults = [];
  
  if (fs.existsSync(bundleSizePath)) {
    bundleResults = JSON.parse(fs.readFileSync(bundleSizePath, 'utf-8'));
    console.log(`   ✅ Loaded bundle size data (${bundleResults.length} frameworks)`);
  } else {
    console.log(`   ⚠️  No bundle size data found`);
  }
  
  // Load Lighthouse results
  const lighthousePath = path.join(RESULTS_DIR, 'lighthouse-results.json');
  let lighthouseResults = [];
  
  if (fs.existsSync(lighthousePath)) {
    lighthouseResults = JSON.parse(fs.readFileSync(lighthousePath, 'utf-8'));
    console.log(`   ✅ Loaded Lighthouse data (${lighthouseResults.length} frameworks)`);
  } else {
    console.log(`   ⚠️  No Lighthouse data found`);
  }
  
  // Generate markdown report
  let report = `# Frontend Framework Benchmark Results

*Last updated: ${new Date().toISOString().split('T')[0]}*

## Implementations Tested

`;

  // Implementation status
  const allFrameworks = ['React', 'Vue.js', 'Angular', 'Blade.php', 'Leptos', 'Yew', 'Dioxus'];
  const implemented = bundleResults.filter(r => r.exists).map(r => r.framework);
  
  allFrameworks.forEach(fw => {
    const key = fw.toLowerCase().replace('.', '').replace('js', '');
    const status = implemented.includes(key) ? '✅' : '📋';
    report += `- ${status} ${fw}\n`;
  });
  
  // Bundle Size Comparison
  report += `\n## Bundle Size Comparison\n\n`;
  
  const validBundles = bundleResults.filter(r => r.exists);
  validBundles.sort((a, b) => a.totalGzipped - b.totalGzipped);
  
  if (validBundles.length > 0) {
    report += `### JavaScript Frameworks\n\n`;
    report += `| Framework | JS (gzipped) | CSS (gzipped) | Total | Notes |\n`;
    report += `|-----------|--------------|---------------|-------|-------|\n`;
    
    validBundles.forEach(r => {
      const name = r.framework.charAt(0).toUpperCase() + r.framework.slice(1);
      const js = formatBytes(r.totalGzipped);
      const css = formatBytes(r.totalCSS);
      const total = formatBytes(r.totalJS + r.totalCSS + r.totalWASM);
      const notes = r.totalWASM > 0 ? 'Includes WASM' : '';
      
      report += `| **${name}** | ${js} | ${css} | ${total} | ${notes} |\n`;
    });
    
    const winner = validBundles[0];
    report += `\n🏆 **Smallest bundle:** ${winner.framework} (${formatBytes(winner.totalGzipped)} gzipped)\n`;
  }
  
  // Performance Metrics
  report += `\n## Performance Metrics\n\n`;
  
  const validLighthouse = lighthouseResults.filter(r => r.performanceScore !== undefined);
  validLighthouse.sort((a, b) => b.performanceScore - a.performanceScore);
  
  if (validLighthouse.length > 0) {
    report += `Based on Lighthouse audits (throttled CPU 4x, Fast 3G network):\n\n`;
    report += `| Framework | Performance Score | FCP | LCP | TTI | TBT |\n`;
    report += `|-----------|------------------|-----|-----|-----|-----|\n`;
    
    validLighthouse.forEach(r => {
      const fcp = Math.round(r.metrics.firstContentfulPaint);
      const lcp = Math.round(r.metrics.largestContentfulPaint);
      const tti = Math.round(r.metrics.timeToInteractive);
      const tbt = Math.round(r.metrics.totalBlockingTime);
      
      report += `| **${r.name}** | ${r.performanceScore}/100 | ${fcp}ms | ${lcp}ms | ${tti}ms | ${tbt}ms |\n`;
    });
    
    const perfWinner = validLighthouse[0];
    report += `\n🏆 **Best performance:** ${perfWinner.name} (${perfWinner.performanceScore}/100)\n`;
  } else {
    report += `*No performance data available. Run \`npm run benchmark:lighthouse\` with dev servers running.*\n`;
  }
  
  // Detailed Analysis
  report += `\n## Detailed Analysis\n\n`;
  
  validBundles.forEach(r => {
    const name = r.framework.charAt(0).toUpperCase() + r.framework.slice(1);
    report += `### ${name}\n\n`;
    
    if (r.jsFiles.length > 0) {
      report += `**JavaScript Files:**\n`;
      r.jsFiles.slice(0, 5).forEach(f => {
        report += `- \`${f.name}\`: ${f.sizeFormatted} (${f.gzippedFormatted} gzipped)\n`;
      });
      if (r.jsFiles.length > 5) {
        report += `- ... and ${r.jsFiles.length - 5} more files\n`;
      }
      report += `\n`;
    }
    
    if (r.cssFiles.length > 0) {
      report += `**CSS Files:**\n`;
      r.cssFiles.forEach(f => {
        report += `- \`${f.name}\`: ${f.sizeFormatted}\n`;
      });
      report += `\n`;
    }
    
    if (r.wasmFiles.length > 0) {
      report += `**WebAssembly Files:**\n`;
      r.wasmFiles.forEach(f => {
        report += `- \`${f.name}\`: ${f.sizeFormatted} (${f.gzippedFormatted} gzipped)\n`;
      });
      report += `\n`;
    }
  });
  
  // Key Findings
  report += `\n## Key Findings\n\n`;
  
  if (validBundles.length >= 2) {
    const smallest = validBundles[0];
    const largest = validBundles[validBundles.length - 1];
    const diff = ((largest.totalGzipped - smallest.totalGzipped) / smallest.totalGzipped * 100).toFixed(0);
    
    report += `### Bundle Size\n\n`;
    report += `- **${smallest.framework}** has the smallest bundle at ${formatBytes(smallest.totalGzipped)} gzipped\n`;
    report += `- **${largest.framework}** has the largest bundle at ${formatBytes(largest.totalGzipped)} gzipped\n`;
    report += `- Difference: ${diff}% larger\n\n`;
  }
  
  if (validLighthouse.length >= 2) {
    const fastest = validLighthouse[0];
    const slowest = validLighthouse[validLighthouse.length - 1];
    
    report += `### Performance\n\n`;
    report += `- **${fastest.name}** achieved the highest Lighthouse score: ${fastest.performanceScore}/100\n`;
    report += `- Fastest First Contentful Paint: ${Math.round(fastest.metrics.firstContentfulPaint)}ms\n\n`;
  }
  
  report += `## Testing Methodology\n\n`;
  report += `All tests were conducted on:\n`;
  report += `- **Environment:** CI/CD environment\n`;
  report += `- **Bundle Analysis:** Production builds\n`;
  report += `- **Network:** Simulated Fast 3G (Lighthouse)\n`;
  report += `- **CPU:** 4x slowdown (Lighthouse)\n`;
  report += `- **Cache:** Cleared before each test\n\n`;
  
  report += `## Contributing\n\n`;
  report += `See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding new framework implementations.\n`;
  
  // Write report
  fs.writeFileSync(OUTPUT_FILE, report);
  console.log(`\n✅ Report generated: ${OUTPUT_FILE}`);
}

generateReport();
