# Frontend Framework Benchmark

A comprehensive benchmark comparing various frontend frameworks including React, Vue.js, Angular, Leptos, Yew, Dioxus, and Blade.php.

## Overview

This project implements the same Todo List application across multiple frontend frameworks to provide objective performance comparisons and developer experience insights.

## Frameworks Included

### JavaScript/TypeScript
- **React** - Popular declarative UI library
- **Vue.js** - Progressive JavaScript framework
- **Angular** - Full-featured TypeScript framework

### Rust WebAssembly (CSR)
- **Leptos** - Fine-grained reactivity Rust framework
- **Yew** - Component-based Rust framework
- **Dioxus** - React-like Rust framework

### Server-Side
- **Blade.php** - Laravel's templating engine

## Project Structure

```
frontend-benchmark/
├── implementations/
│   ├── react/           # React implementation
│   ├── vue/             # Vue.js implementation
│   ├── angular/         # Angular implementation
│   ├── leptos/          # Leptos (Rust) implementation
│   ├── yew/             # Yew (Rust) implementation
│   ├── dioxus/          # Dioxus (Rust) implementation
│   └── blade/           # Laravel Blade implementation
├── benchmarks/
│   ├── scripts/         # Benchmark automation scripts
│   ├── results/         # Benchmark results and data
│   └── tools/           # Custom measurement tools
├── shared/
│   └── styles/          # Common CSS styles
└── BENCHMARK_SPEC.md    # Detailed specification
```

## Getting Started

### Prerequisites

- Node.js 18+ (for JS frameworks)
- Rust 1.70+ (for Rust frameworks)
- PHP 8.1+ and Composer (for Blade)
- Modern web browser (Chrome recommended for testing)

### Running Implementations

Each implementation has its own directory with specific instructions. See the README in each implementation folder.

#### React
```bash
cd implementations/react
npm install
npm run dev
```

#### Vue.js
```bash
cd implementations/vue
npm install
npm run dev
```

#### Angular
```bash
cd implementations/angular
npm install
npm start
```

#### Leptos
```bash
cd implementations/leptos
trunk serve
```

#### Yew
```bash
cd implementations/yew
trunk serve
```

#### Dioxus
```bash
cd implementations/dioxus
dx serve
```

#### Blade
```bash
cd implementations/blade
composer install
php artisan serve
```

## Running Benchmarks

### Local Benchmarks

```bash
cd benchmarks/scripts
npm install
npm run benchmark:all
```

### Docker-based Benchmarks

For consistent, isolated benchmarking using Docker containers:

```bash
cd benchmarks/scripts
npm install

# Quick benchmark (JS frameworks only, ~30 min)
npm run benchmark:docker

# Comprehensive benchmark (ALL frameworks including Rust, ~2 hours)
# Includes: CPU usage, RAM usage, performance metrics
npm run benchmark:docker:full
```

See [DOCKER.md](DOCKER.md) for Docker setup and [BENCHMARK_GUIDE.md](BENCHMARK_GUIDE.md) for comprehensive benchmarking guide.

## Benchmark Results

*Last updated: 2025-11-13*

### Quick Highlights

- **Top Lighthouse score:** react (100/100)
- **Smallest gzipped bundle:** blade (1.32 KB)
- **Highest measured throughput:** yew (38,499 req/s peak)

**Notes:**
- Dioxus Lighthouse audit produced NaN values; rebuild and re-run Lighthouse in idle conditions (no concurrent stress test).

- Top throughput (top 3): yew (38,499 req/s), dioxus (36,243 req/s), leptos (35,047 req/s)
- Top Lighthouse (top 3): react (100/100), vue (100/100), angular (100/100)
- Smallest bundles (top 3): blade (1.32 KB), dioxus (13.75 KB), vue (25.91 KB)

---

### Summary (at-a-glance)

#### Bundle Sizes (gzipped)

| Framework | Bundle (gzipped) | Total Size |
|-----------|------------------:|-----------:|
| blade | 1.32 KB | 4.01 KB |
| dioxus | 13.75 KB | 43.63 KB |
| vue | 25.91 KB | 65.18 KB |
| react | 61.27 KB | 195.46 KB |
| angular | 62.06 KB | 190.41 KB |
| leptos | 75.73 KB | 244.77 KB |
| yew | 79.89 KB | 219.04 KB |

#### Lighthouse Performance

| Framework | Perf | FCP | LCP | TTI |
|-----------|-----:|----:|----:|----:|
| react | 100/100 | 1203ms | 1354ms | 1203ms |
| vue | 100/100 | 1053ms | 1204ms | 1179ms |
| angular | 100/100 | 1212ms | 1589ms | 1394ms |
| leptos | 100/100 | 906ms | 1582ms | 1244ms |
| yew | 100/100 | 903ms | 1579ms | 1612ms |
| blade | 87/100 | 751ms | 751ms | 751ms |
| dioxus | 0/100 | N/A | N/A | N/A |

#### Throughput

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

### Stress Test Summary

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

### Testing Methodology

All tests were performed using the included `benchmarks/scripts` runner and are reproducible with the Docker-based setup. Results will vary by environment.

For detailed per-framework analysis and complete methodology, see [BENCHMARK_GUIDE.md](BENCHMARK_GUIDE.md).

## Contributing

Contributions are welcome! Please read the [BENCHMARK_SPEC.md](BENCHMARK_SPEC.md) for implementation guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
