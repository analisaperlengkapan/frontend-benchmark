#!/usr/bin/env node

/*
 * Clean Report Generator
 * Writes a single consolidated RESULTS.md with a compact Summary and detailed per-framework sections.
 */

const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '../results');
const OUTPUT_FILE = path.join(__dirname, '../../RESULTS.md');

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

function safe(v, fallback = 'N/A') {
  if (v === undefined || v === null) return fallback;
  return v;
}

(function run() {
  const comprehensivePath = path.join(RESULTS_DIR, 'comprehensive-benchmark-results.json');
  if (!fs.existsSync(comprehensivePath)) {
    console.error('No comprehensive results file found. Run the benchmarks first.');
    process.exit(1);
  }
  const results = JSON.parse(fs.readFileSync(comprehensivePath, 'utf-8'));

  let md = '# Frontend Framework Benchmark Results\n\n';
  md += `*Last updated: ${new Date().toISOString().split('T')[0]}*\n\n`;

  // Pre-compute sorted lists for summaries (available for Quick Highlights)
  const summaryList = results.map(r => {
    const samples = (r.stress && r.stress.samples) || [];
    const peak = samples.length ? Math.max(...samples.map(s => (s.requests && s.requests.average) || 0)) : 0;
    return { r, peak };
  }).sort((a,b)=>b.peak - a.peak);

  const bundleList = results.slice().sort((a,b)=> (a.totalGzipped || Infinity) - (b.totalGzipped || Infinity));
  const perfList = results.filter(r => typeof r.performanceScore === 'number').slice().sort((a,b)=>b.performanceScore - a.performanceScore);

  md += '## Quick Highlights\n\n';
  // winners
  const validPerf = results.filter(r => typeof r.performanceScore === 'number');
  const perfWinner = validPerf.sort((a,b)=>b.performanceScore - a.performanceScore)[0];
  const bundleWinner = results.slice().sort((a,b)=> (a.totalGzipped || Infinity) - (b.totalGzipped || Infinity))[0];
  // throughput winner
  const throughputWinner = results.map(r => ({r, max: (r.stress && r.stress.samples && r.stress.samples.length) ? Math.max(...r.stress.samples.map(s => s.requests && s.requests.average ? s.requests.average : 0)) : 0})).sort((a,b)=>b.max - a.max)[0];

  if (perfWinner) md += `- **Top Lighthouse score:** ${perfWinner.framework} (${perfWinner.performanceScore}/100)\n`;
  if (bundleWinner) md += `- **Smallest gzipped bundle:** ${bundleWinner.framework} (${formatBytes(bundleWinner.totalGzipped || 0)})\n`;
  if (throughputWinner) md += `- **Highest measured throughput:** ${throughputWinner.r.framework} (${formatNumber(Math.round(throughputWinner.max))} req/s peak)\n`;

  // Notes
  md += '\n**Notes:**\n';
  const dioxus = results.find(r=>r.framework === 'dioxus');
  if (dioxus && (dioxus.performanceScore === 0 || isNaN(dioxus.metrics?.firstContentfulPaint))) md += '- Dioxus Lighthouse audit produced NaN values; rebuild and re-run Lighthouse in idle conditions (no concurrent stress test).\n';

  // Pre-computed lists are available: `summaryList`, `bundleList`, `perfList`
  const topThroughput = summaryList.slice(0,3).map(s => `${s.r.framework} (${formatNumber(Math.round(s.peak))} req/s)`).join(', ');
  const topPerf = perfList.slice(0,3).map(r => `${r.framework} (${r.performanceScore}/100)`).join(', ');
  const topBundles = bundleList.slice(0,3).map(r => `${r.framework} (${formatBytes(r.totalGzipped || 0)})`).join(', ');
  md += `\n- Top throughput (top 3): ${topThroughput}\n`;
  if (topPerf) md += `- Top Lighthouse (top 3): ${topPerf}\n`;
  md += `- Smallest bundles (top 3): ${topBundles}\n`;


  // (summaryList, bundleList, perfList will be computed below for display)

  md += '\n---\n\n';
  md += '## Summary (at-a-glance)\n\n';
  // Bundle size table (smallest first)
  md += '### Bundle Sizes (gzipped)\n\n';
  md += '| Framework | Bundle (gzipped) | Total Size |\n';
  md += '|-----------|------------------:|-----------:|\n';
  bundleList.forEach(r => {
    md += `| ${r.framework} | ${formatBytes(r.totalGzipped || 0)} | ${formatBytes((r.totalJS || 0) + (r.totalCSS || 0) + (r.totalWASM || 0))} |\n`;
  });
  md += '\n';

  // Lighthouse performance table (best first)
  md += '### Lighthouse Performance\n\n';
  md += '| Framework | Perf | FCP | LCP | TTI |\n';
  md += '|-----------|-----:|----:|----:|----:|\n';
  perfList.forEach(r => {
    const fcpText = r.metrics?.firstContentfulPaint ? `${Math.round(r.metrics.firstContentfulPaint)}ms` : 'N/A';
    const lcpText = r.metrics?.largestContentfulPaint ? `${Math.round(r.metrics.largestContentfulPaint)}ms` : 'N/A';
    const ttiText = r.metrics?.timeToInteractive ? `${Math.round(r.metrics.timeToInteractive)}ms` : 'N/A';
    md += `| ${r.framework} | ${r.performanceScore}/100 | ${fcpText} | ${lcpText} | ${ttiText} |\n`;
  });
  md += '\n';

  // Throughput table (peak first)
  md += '### Throughput\n\n';
  md += '| Framework | Peak Avg Req/s | p50 | p90 | p99 | Errors |\n';
  md += '|-----------|---------------:|----:|----:|----:|------:|\n';

  // (Top-3 lists already printed in Quick Highlights earlier)

    summaryList.forEach(item => {
    const r = item.r;
    const name = r.framework.charAt(0).toUpperCase() + r.framework.slice(1);
    const perf = r.performanceScore !== undefined ? `${r.performanceScore}/100` : 'N/A';
    const m = r.metrics || {};
    const fcp = m.firstContentfulPaint ? Math.round(m.firstContentfulPaint) : 'N/A';
    const lcp = m.largestContentfulPaint ? Math.round(m.largestContentfulPaint) : 'N/A';
    const tti = m.timeToInteractive ? Math.round(m.timeToInteractive) : 'N/A';
    const gz = formatBytes(r.totalGzipped || 0);
    const total = formatBytes((r.totalJS || 0) + (r.totalCSS || 0) + (r.totalWASM || 0));
    const stress = r.stress || { samples: [] };
    const maxSample = stress.samples.length ? stress.samples.reduce((a,b)=> (a.requests && b.requests && b.requests.average > a.requests.average ? b : a)) : null;
    const maxReq = maxSample && maxSample.requests ? Math.round(maxSample.requests.average) : 'N/A';
    const cpuAvg = maxSample && maxSample.containerStats?.cpu?.average !== undefined ? `${maxSample.containerStats.cpu.average.toFixed(2)}%` : 'N/A';
    const cpuMax = maxSample && maxSample.containerStats?.cpu?.max !== undefined ? `${maxSample.containerStats.cpu.max.toFixed(2)}%` : 'N/A';
    const memAvg = maxSample && maxSample.containerStats?.memory?.averageMB !== undefined ? `${maxSample.containerStats.memory.averageMB.toFixed(2)}MB` : 'N/A';
    const memMax = maxSample && maxSample.containerStats?.memory?.maxMB !== undefined ? `${maxSample.containerStats.memory.maxMB.toFixed(2)}MB` : 'N/A';

    // Throughput row: show peak req and latency percentiles
    const errors = stress.samples.reduce((a,s)=>a + (s.errors || 0), 0);
    const p50 = maxSample && maxSample.latency ? Math.round(maxSample.latency.p50 || 0) : 'N/A';
    const p90 = maxSample && maxSample.latency ? Math.round(maxSample.latency.p90 || maxSample.latency.p95 || 0) : 'N/A';
    const p99 = maxSample && maxSample.latency ? Math.round(maxSample.latency.p99 || 0) : 'N/A';
    md += `| **${name}** | ${formatNumber(maxReq)} | ${p50}ms | ${p90}ms | ${p99}ms | ${errors} |\n`;
  });

  md += '\n---\n\n';
  // Add a concise stress summary table
  md += '## Stress Test Summary\n\n';
  md += '| Framework | Peak Avg Req/s | Peak Concurrency | p50 | p90 | p99 | Errors | Non-2xx |\n';
  md += '|-----------|---------------:|----------------:|----:|----:|----:|------:|-------:|\n';
  // Stress summary — use the same sorted order
  summaryList.forEach(item => {
    const r = item.r;
    const stress = r.stress || { samples: [] };
    const samples = stress.samples || [];
    const maxSample = samples.length ? samples.reduce((a,b)=> (a.requests && b.requests && b.requests.average > a.requests.average ? b : a)) : null;
    const errors = samples.reduce((a,s)=>a + (s.errors || 0), 0);
    const non2xx = samples.reduce((a,s)=>a + (s.non2xx || 0), 0);
    if (!maxSample) {
      md += `| ${r.framework} | N/A | N/A | N/A | N/A | N/A | ${errors} | ${non2xx} |\n`;
    } else {
      const concurrency = maxSample.concurrency || 'N/A';
      const p50 = Math.round(maxSample.latency.p50 || 0);
      const p90 = Math.round(maxSample.latency.p90 || maxSample.latency.p95 || 0);
      const p99 = Math.round(maxSample.latency.p99 || 0);
      md += `| ${r.framework} | ${formatNumber(Math.round(maxSample.requests.average))} | ${concurrency} | ${p50}ms | ${p90}ms | ${p99}ms | ${errors} | ${non2xx} |\n`;
    }
  });
  md += '\n---\n\n';
  md += '## Per-framework Details\n\n';

  summaryList.forEach(item => {
    const r = item.r;
    const title = r.framework.charAt(0).toUpperCase() + r.framework.slice(1);
    md += `### ${title}\n\n`;
    md += `- **Type:** ${r.type || 'N/A'}\n`;
    md += `- **Build time:** ${r.buildTime || 'N/A'} s\n`;
    md += `- **Total size:** ${r.totalSizeFormatted || formatBytes((r.totalJS || 0) + (r.totalCSS || 0) + (r.totalWASM || 0))}\n`;
    md += `  - **JS:** ${r.totalJSFormatted || formatBytes(r.totalJS || 0)}\n`;
    md += `  - **CSS:** ${r.totalCSSFormatted || formatBytes(r.totalCSS || 0)}\n`;
    if (r.totalWASM && r.totalWASM > 0) md += `  - **WASM:** ${r.totalWASMFormatted || formatBytes(r.totalWASM)}\n`;
    md += `  - **HTML:** ${r.totalHTMLFormatted || formatBytes(r.totalHTML || 0)}\n`;
    if (r.performanceScore !== undefined && !isNaN(r.metrics?.firstContentfulPaint)) md += `- **Lighthouse:** ${r.performanceScore}/100 | FCP: ${Math.round(r.metrics.firstContentfulPaint)}ms | LCP: ${Math.round(r.metrics.largestContentfulPaint)}ms | TTI: ${Math.round(r.metrics.timeToInteractive)}ms\n`;
    else if (r.performanceScore !== undefined && isNaN(r.metrics?.firstContentfulPaint)) md += `- **Lighthouse:** ${r.performanceScore}/100 (audit failed / NaN metrics)\n`;
    else md += `- **Lighthouse:** N/A\n`;
    if (r.containerStats) {
      md += `- **Runtime (avg/max cpu):** ${r.containerStats.cpu.average.toFixed(2)}% / ${r.containerStats.cpu.max.toFixed(2)}%\n`;
      md += `- **Memory (avg/max):** ${r.containerStats.memory.averageMB.toFixed(2)} MB / ${r.containerStats.memory.maxMB.toFixed(2)} MB\n`;
    }
    const stress = r.stress || { samples: [] };
    if (stress && stress.samples && stress.samples.length) {
      const maxSample = stress.samples.reduce((a,b)=> (a.requests && b.requests && b.requests.average > a.requests.average ? b : a));
      if (maxSample) {
        md += `- **Stress (peak):** ${Math.round(maxSample.requests.average)} req/s @ ${maxSample.concurrency}c | p50 ${Math.round(maxSample.latency.p50 || 0)}ms | p90 ${Math.round(maxSample.latency.p90 || maxSample.latency.p95 || 0)}ms | p99 ${Math.round(maxSample.latency.p99 || 0)}ms\n`;
        if (maxSample.containerStats) md += `  - Avg CPU: ${maxSample.containerStats.cpu.average.toFixed(2)}% | Max CPU: ${maxSample.containerStats.cpu.max.toFixed(2)}%\n  - Avg Mem: ${maxSample.containerStats.memory.averageMB.toFixed(2)}MB | Max Mem: ${maxSample.containerStats.memory.maxMB.toFixed(2)}MB\n`;
      }
      const errors = stress.samples.reduce((a,s)=>a + (s.errors || 0), 0);
      const non2xx = stress.samples.reduce((a,s)=>a + (s.non2xx || 0), 0);
      md += `- **Stress errors:** ${errors} | **Non-2xx:** ${non2xx}\n`;
    }
    if (r.error) md += `- **Error / Notes:** ${r.error}\n`;
    if (r.framework === 'dioxus' && (r.performanceScore === 0 || isNaN(r.metrics?.firstContentfulPaint))) md += `- **Note:** Dioxus Lighthouse audit produced NaN values. Consider re-checking the index.html asset loading and re-running Lighthouse in a quiet environment.\n`;
    md += '\n';
  });

  md += '---\n\n';
  md += '## Testing Methodology\n\n';
  md += 'All tests were performed using the included `benchmarks/scripts` runner and are reproducible with the Docker-based setup. See `README.md` for details.\n\n';
  md += '## Key Findings\n\n';
  md += '- This summary shows approximate throughput, bundle sizes, and Lighthouse metrics. Results will vary by environment.\n';

  fs.writeFileSync(OUTPUT_FILE, md);
  console.log('Generated clean RESULTS.md');
})();
