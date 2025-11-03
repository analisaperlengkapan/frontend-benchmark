# Benchmark Scripts

This directory contains automated scripts for benchmarking frontend framework implementations.

## Setup

```bash
npm install
```

## Scripts

### Run All Benchmarks

```bash
npm run benchmark:all
```

Runs all benchmark tests and generates a comprehensive report.

### Lighthouse Benchmark

```bash
npm run benchmark:lighthouse
```

Runs Lighthouse performance audits on all implementations.

### Bundle Size Analysis

```bash
npm run benchmark:bundle
```

Analyzes and compares bundle sizes across implementations.

### Generate Report

```bash
npm run report
```

Generates a markdown report from benchmark results.

## Manual Testing

### Performance Metrics

1. **Initial Load Time**
   - Open Chrome DevTools (F12)
   - Go to Network tab
   - Clear cache (Ctrl+Shift+Delete)
   - Reload page
   - Note: DOMContentLoaded, Load time

2. **Runtime Performance**
   - Open Performance tab in DevTools
   - Start recording
   - Add 1000 todos by running in console:
     ```javascript
     for(let i = 0; i < 1000; i++) {
       // Trigger add todo functionality
     }
     ```
   - Stop recording
   - Analyze main thread time, scripting time

3. **Memory Usage**
   - Open Memory tab
   - Take heap snapshot
   - Interact with app
   - Take another snapshot
   - Compare memory growth

### Lighthouse Audit

1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Desktop" or "Mobile"
4. Click "Generate report"
5. Note Performance, Accessibility, Best Practices scores

## Metrics Collected

- **Performance**
  - First Contentful Paint (FCP)
  - Time to Interactive (TTI)
  - Total Blocking Time (TBT)
  - Cumulative Layout Shift (CLS)
  - Largest Contentful Paint (LCP)

- **Bundle Size**
  - JavaScript size (gzipped)
  - CSS size (gzipped)
  - Total assets size
  - WASM size (for Rust implementations)

- **Runtime**
  - Time to add 1000 todos
  - Time to toggle 100 todos
  - Memory consumption
  - CPU usage

## Results

Results are saved to `../results/` directory in JSON and markdown format.
