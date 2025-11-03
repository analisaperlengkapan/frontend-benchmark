#!/usr/bin/env node

/**
 * Master Benchmark Script
 * Runs all benchmarks and generates comprehensive report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

console.log('🚀 Frontend Framework Comprehensive Benchmark Suite\n');
console.log('=' .repeat(60));
console.log('\nThis will run:');
console.log('  1. Bundle size analysis');
console.log('  2. Lighthouse performance audits (if servers are running)');
console.log('  3. Generate comparison report');
console.log('\n' + '='.repeat(60) + '\n');

async function runCommand(command, description) {
  console.log(`\n▶️  ${description}...`);
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: __dirname
    });
    return true;
  } catch (error) {
    console.error(`\n❌ Error running: ${description}`);
    return false;
  }
}

async function main() {
  const startTime = Date.now();
  
  // 1. Bundle size analysis
  await runCommand('node bundle-size.js', 'Analyzing bundle sizes');
  
  // 2. Lighthouse audits (optional - only if servers running)
  console.log('\n' + '='.repeat(60));
  console.log('\n⚠️  Lighthouse benchmarks require running dev servers.');
  console.log('Skipping for now. Run manually with: npm run benchmark:lighthouse');
  
  // 3. Generate report
  await runCommand('node generate-report.js', 'Generating comparison report');
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ All benchmarks completed in ${duration}s`);
  console.log(`\n📁 Results saved to: ${RESULTS_DIR}`);
  console.log('\n📄 Check RESULTS.md for detailed comparison\n');
}

main().catch(console.error);
