#!/usr/bin/env node

/*
 * README Results Updater
 * Updates the Benchmark Results section in README.md with latest benchmark data.
 */

const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../results');
const README_FILE = path.join(__dirname, '../../README.md');

function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return 'N/A';
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatNumber(n) {
  if (n === undefined || n === null || n === 'N/A') return 'N/A';
  if (typeof n !== 'number') return n;
  return n.toLocaleString('en-US');
}

function generateBenchmarkSection(results) {
  let md = '## Benchmark Results\n\n';
  md += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n\n`;

  // Pre-compute sorted lists
  const summaryList = results.map(r => {
    const samples = (r.stress && r.stress.samples) || [];
    const peak = samples.length ? Math.max(...samples.map(s => (s.requests && s.requests.average) || 0)) : 0;
    return { r, peak };
  }).sort((a,b)=>b.peak - a.peak);

  const bundleList = results.slice().sort((a,b)=> (a.totalGzipped || Infinity) - (b.totalGzipped || Infinity));
  const perfList = results.filter(r => typeof r.performanceScore === 'number').slice().sort((a,b)=>b.performanceScore - a.performanceScore);

  md += '### Quick Highlights\n\n';
  
  // Winners
  const validPerf = results.filter(r => typeof r.performanceScore === 'number');
  const perfWinner = validPerf.sort((a,b)=>b.performanceScore - a.performanceScore)[0];
  const bundleWinner = results.slice().sort((a,b)=> (a.totalGzipped || Infinity) - (b.totalGzipped || Infinity))[0];
  const throughputWinner = results.map(r => ({r, max: (r.stress && r.stress.samples && r.stress.samples.length) ? Math.max(...r.stress.samples.map(s => s.requests && s.requests.average ? s.requests.average : 0)) : 0})).sort((a,b)=>b.max - a.max)[0];

  if (perfWinner) md += `- **Top Lighthouse score:** ${perfWinner.framework} (${perfWinner.performanceScore}/100)\n`;
  if (bundleWinner) md += `- **Smallest gzipped bundle:** ${bundleWinner.framework} (${formatBytes(bundleWinner.totalGzipped || 0)})\n`;
  if (throughputWinner) md += `- **Highest measured throughput:** ${throughputWinner.r.framework} (${formatNumber(Math.round(throughputWinner.max))} req/s peak)\n`;

  // Notes
  md += '\n**Notes:**\n';
  const dioxus = results.find(r=>r.framework === 'dioxus');
  if (dioxus && (dioxus.performanceScore === 0 || isNaN(dioxus.metrics?.firstContentfulPaint))) {
    md += '- Dioxus Lighthouse audit produced NaN values; rebuild and re-run Lighthouse in idle conditions (no concurrent stress test).\n';
  }

  const topThroughput = summaryList.slice(0,3).map(s => `${s.r.framework} (${formatNumber(Math.round(s.peak))} req/s)`).join(', ');
  const topPerf = perfList.slice(0,3).map(r => `${r.framework} (${r.performanceScore}/100)`).join(', ');
  const topBundles = bundleList.slice(0,3).map(r => `${r.framework} (${formatBytes(r.totalGzipped || 0)})`).join(', ');
  md += `\n- Top throughput (top 3): ${topThroughput}\n`;
  if (topPerf) md += `- Top Lighthouse (top 3): ${topPerf}\n`;
  md += `- Smallest bundles (top 3): ${topBundles}\n`;

  md += '\n---\n\n';
  md += '### Summary (at-a-glance)\n\n';
  
  // Bundle size table
  md += '#### Bundle Sizes (gzipped)\n\n';
  md += '| Framework | Bundle (gzipped) | Total Size |\n';
  md += '|-----------|------------------:|-----------:|\n';
  bundleList.forEach(r => {
    md += `| ${r.framework} | ${formatBytes(r.totalGzipped || 0)} | ${formatBytes((r.totalJS || 0) + (r.totalCSS || 0) + (r.totalWASM || 0))} |\n`;
  });
  md += '\n';

  // Lighthouse performance table
  md += '#### Lighthouse Performance\n\n';
  md += '| Framework | Perf | FCP | LCP | TTI |\n';
  md += '|-----------|-----:|----:|----:|----:|\n';
  perfList.forEach(r => {
    const fcpText = r.metrics?.firstContentfulPaint ? `${Math.round(r.metrics.firstContentfulPaint)}ms` : 'N/A';
    const lcpText = r.metrics?.largestContentfulPaint ? `${Math.round(r.metrics.largestContentfulPaint)}ms` : 'N/A';
    const ttiText = r.metrics?.timeToInteractive ? `${Math.round(r.metrics.timeToInteractive)}ms` : 'N/A';
    md += `| ${r.framework} | ${r.performanceScore}/100 | ${fcpText} | ${lcpText} | ${ttiText} |\n`;
  });
  md += '\n';

  // Throughput table
  md += '#### Throughput\n\n';
  md += '| Framework | Peak Avg Req/s | p50 | p90 | p99 | Errors |\n';
  md += '|-----------|---------------:|----:|----:|----:|------:|\n';
  summaryList.forEach(s => {
    const r = s.r;
    const peak = Math.round(s.peak);
    const p50 = r.stress?.latency?.p50 ? `${Math.round(r.stress.latency.p50)}ms` : 'N/A';
    const p90 = r.stress?.latency?.p90 ? `${Math.round(r.stress.latency.p90)}ms` : 'N/A';
    const p99 = r.stress?.latency?.p99 ? `${Math.round(r.stress.latency.p99)}ms` : 'N/A';
    const errors = r.stress?.errors || 0;
    md += `| **${r.framework[0].toUpperCase() + r.framework.slice(1)}** | ${formatNumber(peak)} | ${p50} | ${p90} | ${p99} | ${formatNumber(errors)} |\n`;
  });
  md += '\n';

  md += '---\n\n';
  
  // Stress test summary
  md += '### Stress Test Summary\n\n';
  md += '| Framework | Peak Avg Req/s | Peak Concurrency | p50 | p90 | p99 | Errors | Non-2xx |\n';
  md += '|-----------|---------------:|----------------:|----:|----:|----:|------:|-------:|\n';
  summaryList.forEach(s => {
    const r = s.r;
    const peak = Math.round(s.peak);
    const concurrency = r.stress?.peakConcurrency || 2000;
    const p50 = r.stress?.latency?.p50 ? `${Math.round(r.stress.latency.p50)}ms` : 'N/A';
    const p90 = r.stress?.latency?.p90 ? `${Math.round(r.stress.latency.p90)}ms` : 'N/A';
    const p99 = r.stress?.latency?.p99 ? `${Math.round(r.stress.latency.p99)}ms` : 'N/A';
    const errors = r.stress?.errors || 0;
    const non2xx = r.stress?.non2xx || 0;
    md += `| ${r.framework} | ${formatNumber(peak)} | ${formatNumber(concurrency)} | ${p50} | ${p90} | ${p99} | ${formatNumber(errors)} | ${formatNumber(non2xx)} |\n`;
  });
  md += '\n';

  md += '---\n\n';
  md += '### Testing Methodology\n\n';
  md += 'All tests were performed using the included `benchmarks/scripts` runner and are reproducible with the Docker-based setup. Results will vary by environment.\n\n';
  md += 'For detailed per-framework analysis and complete methodology, see [BENCHMARK_GUIDE.md](BENCHMARK_GUIDE.md).\n';

  return md;
}

function updateReadme(benchmarkSection) {
  const readmeContent = fs.readFileSync(README_FILE, 'utf-8');
  
  // Find the benchmark results section
  const benchmarkStart = readmeContent.indexOf('## Benchmark Results');
  
  if (benchmarkStart === -1) {
    console.error('Could not find "## Benchmark Results" section in README.md');
    process.exit(1);
  }
  
  // Find the next ## heading or end of file
  let benchmarkEnd = readmeContent.indexOf('\n## ', benchmarkStart + 1);
  if (benchmarkEnd === -1) {
    benchmarkEnd = readmeContent.length;
  }
  
  // Replace the benchmark section
  const newReadme = readmeContent.substring(0, benchmarkStart) + 
                    benchmarkSection + 
                    '\n' +
                    readmeContent.substring(benchmarkEnd);
  
  fs.writeFileSync(README_FILE, newReadme);
  console.log('✅ README.md updated with latest benchmark results');
}

(function run() {
  const comprehensivePath = path.join(RESULTS_DIR, 'comprehensive-benchmark-results.json');
  if (!fs.existsSync(comprehensivePath)) {
    console.error('No comprehensive results file found. Run the benchmarks first.');
    process.exit(1);
  }
  
  const results = JSON.parse(fs.readFileSync(comprehensivePath, 'utf-8'));
  const benchmarkSection = generateBenchmarkSection(results);
  updateReadme(benchmarkSection);
})();
