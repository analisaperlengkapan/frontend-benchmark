# Frontend Framework Benchmark Results

*Last updated: 2025-11-13*

## Quick Highlights

- **Top Lighthouse score:** react (100/100)
- **Smallest gzipped bundle:** blade (1.32 KB)
- **Highest measured throughput:** yew (38,499 req/s peak)

**Notes:**
- Dioxus Lighthouse audit produced NaN values; rebuild and re-run Lighthouse in idle conditions (no concurrent stress test).

- Top throughput (top 3): yew (38,499 req/s), dioxus (36,243 req/s), leptos (35,047 req/s)
- Top Lighthouse (top 3): react (100/100), vue (100/100), angular (100/100)
- Smallest bundles (top 3): blade (1.32 KB), dioxus (13.75 KB), vue (25.91 KB)

---

## Summary (at-a-glance)

### Bundle Sizes (gzipped)

| Framework | Bundle (gzipped) | Total Size |
|-----------|------------------:|-----------:|
| blade | 1.32 KB | 4.01 KB |
| dioxus | 13.75 KB | 43.63 KB |
| vue | 25.91 KB | 65.18 KB |
| react | 61.27 KB | 195.46 KB |
| angular | 62.06 KB | 190.41 KB |
| leptos | 75.73 KB | 244.77 KB |
| yew | 79.89 KB | 219.04 KB |

### Lighthouse Performance

| Framework | Perf | FCP | LCP | TTI |
|-----------|-----:|----:|----:|----:|
| react | 100/100 | 1203ms | 1354ms | 1203ms |
| vue | 100/100 | 1053ms | 1204ms | 1179ms |
| angular | 100/100 | 1212ms | 1589ms | 1394ms |
| leptos | 100/100 | 906ms | 1582ms | 1244ms |
| yew | 100/100 | 903ms | 1579ms | 1612ms |
| blade | 87/100 | 751ms | 751ms | 751ms |
| dioxus | 0/100 | N/A | N/A | N/A |

### Throughput

| Framework | Peak Avg Req/s | p50 | p90 | p99 | Errors |
|-----------|---------------:|----:|----:|----:|------:|
| **Yew** | 38,499 | 211ms | 412ms | 3902ms | 233 |
| **Dioxus** | 36,243 | 194ms | 245ms | 1997ms | 466 |
| **Leptos** | 35,047 | 214ms | 403ms | 3893ms | 256 |
| **Angular** | 31,591 | 202ms | 284ms | 3914ms | 267 |
| **React** | 30,237 | 196ms | 295ms | 3892ms | 256 |
| **Vue** | 29,949 | 201ms | 380ms | 3887ms | 384 |
| **Blade** | 309 | 2002ms | 2016ms | 7923ms | 6100 |

---

## Stress Test Summary

| Framework | Peak Avg Req/s | Peak Concurrency | p50 | p90 | p99 | Errors | Non-2xx |
|-----------|---------------:|----------------:|----:|----:|----:|------:|-------:|
| yew | 38,499 | 2000 | 211ms | 412ms | 3902ms | 233 | 0 |
| dioxus | 36,243 | 2000 | 194ms | 245ms | 1997ms | 466 | 0 |
| leptos | 35,047 | 2000 | 214ms | 403ms | 3893ms | 256 | 0 |
| angular | 31,591 | 2000 | 202ms | 284ms | 3914ms | 267 | 0 |
| react | 30,237 | 2000 | 196ms | 295ms | 3892ms | 256 | 0 |
| vue | 29,949 | 2000 | 201ms | 380ms | 3887ms | 384 | 0 |
| blade | 309 | 2000 | 2002ms | 2016ms | 7923ms | 6100 | 0 |

---

## Per-framework Details

### Yew

- **Type:** rust
- **Build time:** 1 s
- **Total size:** 220.44 KB
  - **JS:** 24.3 KB
  - **CSS:** 0 Bytes
  - **WASM:** 194.74 KB
  - **HTML:** 1.41 KB
- **Lighthouse:** 100/100 | FCP: 903ms | LCP: 1579ms | TTI: 1612ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.28 MB / 3.28 MB
- **Stress (peak):** 38499 req/s @ 2000c | p50 211ms | p90 412ms | p99 3902ms
  - Avg CPU: 0.01% | Max CPU: 1.27%
  - Avg Mem: 3.61MB | Max Mem: 7.22MB
- **Stress errors:** 233 | **Non-2xx:** 0

### Dioxus

- **Type:** rust
- **Build time:** 1 s
- **Total size:** 44.4 KB
  - **JS:** 30.45 KB
  - **CSS:** 0 Bytes
  - **WASM:** 13.17 KB
  - **HTML:** 798 Bytes
- **Lighthouse:** 0/100 (audit failed / NaN metrics)
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.27 MB / 3.27 MB
- **Stress (peak):** 36243 req/s @ 2000c | p50 194ms | p90 245ms | p99 1997ms
  - Avg CPU: 0.02% | Max CPU: 1.47%
  - Avg Mem: 3.57MB | Max Mem: 7.21MB
- **Stress errors:** 466 | **Non-2xx:** 0
- **Note:** Dioxus Lighthouse audit produced NaN values. Consider re-checking the index.html asset loading and re-running Lighthouse in a quiet environment.

### Leptos

- **Type:** rust
- **Build time:** 2 s
- **Total size:** 246.19 KB
  - **JS:** 27.2 KB
  - **CSS:** 0 Bytes
  - **WASM:** 217.57 KB
  - **HTML:** 1.42 KB
- **Lighthouse:** 100/100 | FCP: 906ms | LCP: 1582ms | TTI: 1244ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.28 MB / 3.29 MB
- **Stress (peak):** 35047 req/s @ 2000c | p50 214ms | p90 403ms | p99 3893ms
  - Avg CPU: 0.05% | Max CPU: 3.43%
  - Avg Mem: 3.60MB | Max Mem: 7.21MB
- **Stress errors:** 256 | **Non-2xx:** 0

### Angular

- **Type:** javascript
- **Build time:** 1 s
- **Total size:** 191.87 KB
  - **JS:** 187.32 KB
  - **CSS:** 3.09 KB
  - **HTML:** 1.46 KB
- **Lighthouse:** 100/100 | FCP: 1212ms | LCP: 1589ms | TTI: 1394ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.30 MB / 3.30 MB
- **Stress (peak):** 31591 req/s @ 2000c | p50 202ms | p90 284ms | p99 3914ms
  - Avg CPU: 0.09% | Max CPU: 10.28%
  - Avg Mem: 3.59MB | Max Mem: 7.23MB
- **Stress errors:** 267 | **Non-2xx:** 0

### React

- **Type:** javascript
- **Build time:** 2 s
- **Total size:** 196.38 KB
  - **JS:** 192.37 KB
  - **CSS:** 3.09 KB
  - **HTML:** 949 Bytes
- **Lighthouse:** 100/100 | FCP: 1203ms | LCP: 1354ms | TTI: 1203ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.27 MB / 3.27 MB
- **Stress (peak):** 30237 req/s @ 2000c | p50 196ms | p90 295ms | p99 3892ms
  - Avg CPU: 0.01% | Max CPU: 1.19%
  - Avg Mem: 3.59MB | Max Mem: 7.23MB
- **Stress errors:** 256 | **Non-2xx:** 0

### Vue

- **Type:** javascript
- **Build time:** 1 s
- **Total size:** 66.1 KB
  - **JS:** 62.09 KB
  - **CSS:** 3.09 KB
  - **HTML:** 946 Bytes
- **Lighthouse:** 100/100 | FCP: 1053ms | LCP: 1204ms | TTI: 1179ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 3.29 MB / 3.29 MB
- **Stress (peak):** 29949 req/s @ 2000c | p50 201ms | p90 380ms | p99 3887ms
  - Avg CPU: 0.04% | Max CPU: 2.13%
  - Avg Mem: 3.62MB | Max Mem: 7.23MB
- **Stress errors:** 384 | **Non-2xx:** 0

### Blade

- **Type:** php
- **Build time:** 3 s
- **Total size:** 4.01 KB
  - **JS:** 0 Bytes
  - **CSS:** 4.01 KB
  - **HTML:** 0 Bytes
- **Lighthouse:** 87/100 | FCP: 751ms | LCP: 751ms | TTI: 751ms
- **Runtime (avg/max cpu):** 0.00% / 0.00%
- **Memory (avg/max):** 14.16 MB / 14.16 MB
- **Stress (peak):** 309 req/s @ 2000c | p50 2002ms | p90 2016ms | p99 7923ms
  - Avg CPU: 0.73% | Max CPU: 27.47%
  - Avg Mem: 64.52MB | Max Mem: 128.30MB
- **Stress errors:** 6100 | **Non-2xx:** 0

---

## Testing Methodology

All tests were performed using the included `benchmarks/scripts` runner and are reproducible with the Docker-based setup. See `README.md` for details.

## Key Findings

- This summary shows approximate throughput, bundle sizes, and Lighthouse metrics. Results will vary by environment.
