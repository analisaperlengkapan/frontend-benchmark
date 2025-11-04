# CI/CD Guide - GitHub Actions

This guide explains the GitHub Actions workflows configured for the frontend-benchmark repository.

## Overview

We use a **dual workflow approach** to balance speed and comprehensiveness:

1. **Basic Checks** - Fast validation (~5-10 min)
2. **Full Build** - Comprehensive testing (~90-120 min)

## Workflows

### 1. Basic Checks (`.github/workflows/basic-checks.yml`)

**Purpose:** Quick validation that runs on every commit

**When it runs:**
- Every push to main or develop
- Every pull request to main
- Manual trigger via workflow_dispatch

**What it checks:**
- ✅ Repository structure (all required files exist)
- ✅ Documentation files exist
- ✅ JavaScript dependencies resolve
- ✅ Rust code compiles (cargo check)
- ✅ PHP syntax is valid
- ✅ Docker configurations are valid

**Time:** ~5-10 minutes

**Jobs:**
```
validate-structure → Check files exist
check-javascript   → npm install --package-lock-only
check-rust         → cargo check (no build)
check-php          → php -l (syntax check)
check-docker       → docker compose config + hadolint
all-basic-checks-passed → Summary
```

### 2. Full Build (`.github/workflows/benchmark.yml`)

**Purpose:** Complete build validation with artifacts

**When it runs:**
- Push to main or develop
- Pull requests to main
- Manual trigger

**What it does:**
- ✅ Full builds of all 7 frameworks
- ✅ Upload build artifacts (7 day retention)
- ✅ Docker image builds
- ✅ Build verification

**Time:** ~90-120 minutes (runs in parallel)

**Jobs:**

| Job | Framework | Type | Timeout | Output |
|-----|-----------|------|---------|--------|
| build-react | React | JS | 15 min | dist/ |
| build-vue | Vue | JS | 15 min | dist/ |
| build-angular | Angular | JS | 20 min | dist/ |
| build-leptos | Leptos | Rust | 45 min | dist/ |
| build-yew | Yew | Rust | 45 min | dist/ |
| build-dioxus | Dioxus | Rust | 45 min | dist/ |
| check-blade | Blade | PHP | 10 min | validation |
| docker-build-test | React/Vue/Angular | Docker | 30 min | images |
| all-checks-passed | Summary | - | - | status |

## Framework-Specific Details

### JavaScript Frameworks (React, Vue, Angular)

**Build Process:**
```yaml
- Setup Node.js 20
- npm install
- npm run build
- Verify dist/ exists
- Upload artifacts
```

**Why not npm ci?**
- No package-lock.json files in repo
- npm install works without lock files
- Still validates dependencies resolve

### Rust/WASM Frameworks (Leptos, Yew, Dioxus)

**Build Process:**
```yaml
- Setup Rust (stable)
- Add wasm32-unknown-unknown target
- Install Trunk/DX CLI
- Build with --release
- Verify dist/ exists
- Upload artifacts
```

**Why 45 minute timeout?**
- Rust compilation is slow
- WASM builds add overhead
- First build downloads crates
- Release builds are optimized

**Tools:**
- **Leptos & Yew:** Use Trunk
- **Dioxus:** Uses DX CLI

### PHP Framework (Blade)

**Check Process:**
```yaml
- Setup PHP 8.2
- Validate composer.json (--no-check-publish)
- Install dependencies
- Check PHP syntax (php -l)
- Verify index.php exists
```

**Why --no-check-publish?**
- Avoids warnings about missing license
- Still validates JSON structure
- Checks dependencies install

### Docker Builds

**Test Process:**
```yaml
- Setup Docker Buildx
- Build image for framework
- Verify image exists
```

**Matrix Strategy:**
- Tests React, Vue, Angular
- Runs in parallel (fail-fast: false)
- Each takes ~10 minutes

## Troubleshooting

### Build Failures

**JavaScript frameworks fail:**
```bash
# Check dependencies locally
cd implementations/<framework>
npm install
npm run build
```

**Rust frameworks fail:**
```bash
# Check compilation locally
cd implementations/<framework>
cargo check
trunk build --release
```

**Docker builds fail:**
```bash
# Test locally
cd implementations/<framework>
docker build -t test .
```

### Timeout Issues

If jobs timeout, check the timeout values:

```yaml
timeout-minutes: 45  # Increase if needed
```

Current timeouts:
- JS frameworks: 15-20 min
- Rust frameworks: 45 min
- PHP check: 10 min
- Docker: 30 min

### Cache Issues

**Node.js cache:**
- Not used (no package-lock.json)
- Each job installs fresh

**Rust cache:**
- Cargo registry cached automatically
- Speeds up subsequent builds

## Viewing Results

### GitHub UI

1. Go to repository → Actions tab
2. Click on workflow run
3. View individual job logs
4. Download artifacts if available

### Build Artifacts

Artifacts are stored for 7 days:
- react-build
- vue-build
- angular-build
- leptos-build
- yew-build
- dioxus-build

Download via GitHub UI or API.

## Status Badges

Add to README:

```markdown
![Basic Checks](https://github.com/analisaperlengkapan/frontend-benchmark/workflows/Basic%20Checks/badge.svg)
![Full Build](https://github.com/analisaperlengkapan/frontend-benchmark/workflows/Frontend%20Benchmark%20CI/badge.svg)
```

## Local Testing

### Test Basic Checks

```bash
# Structure check
test -f implementations/react/package.json && echo "✅"

# JavaScript check
cd implementations/react && npm install --package-lock-only

# Rust check
cd implementations/leptos && cargo check

# PHP check
cd implementations/blade && php -l index.php

# Docker check
docker compose config
```

### Test Full Build

```bash
# JavaScript
cd implementations/react && npm install && npm run build

# Rust
cd implementations/leptos && trunk build --release

# Docker
cd implementations/react && docker build -t test .
```

## Performance Optimization

### Current Strategy

**Parallel Execution:**
- All framework builds run in parallel
- Reduces total time from ~180 min to ~90 min

**Caching:**
- Rust cargo cache enabled
- Node modules not cached (no lock files)

**Artifact Retention:**
- 7 days (balance storage vs usefulness)

### Future Improvements

**Possible optimizations:**
- Add package-lock.json files → Enable npm cache
- Use build matrix for JS frameworks → Reduce duplication
- Cache Trunk/DX CLI installations → Save 5-10 min per Rust build
- Add conditional execution → Skip unchanged frameworks

## Integration with PR Workflow

### Recommended Strategy

**On Pull Request:**
```
Basic Checks (required) ✅
    ↓
Code Review
    ↓
Merge to main
    ↓
Full Build (optional) ✅
```

**Branch Protection Rules:**
- Require "All Basic Checks Passed" to merge
- Optional: Require "All Checks Passed" for main

### Setting Up Branch Protection

1. Go to Settings → Branches
2. Add rule for main branch
3. Check "Require status checks to pass"
4. Select: "All Basic Checks Passed"
5. Optional: "All Checks Passed"

## Monitoring

### Success Metrics

Track these over time:
- Build success rate
- Average build time per framework
- Artifact size trends
- Failure patterns

### Notifications

Configure in repository settings:
- Email on failure
- Slack webhook integration
- GitHub mobile app

## Maintenance

### Updating Dependencies

**Node.js version:**
```yaml
node-version: '20'  # Update as needed
```

**Rust version:**
```yaml
toolchain: stable  # Or specific version
```

**PHP version:**
```yaml
php-version: '8.2'  # Update for new PHP
```

### Adding New Frameworks

1. Add to basic-checks.yml (structure + check)
2. Add to benchmark.yml (full build)
3. Update CI_CD_GUIDE.md
4. Test locally first

## Cost Considerations

### GitHub Actions Minutes

**Free tier:** 2,000 minutes/month

**Usage per run:**
- Basic Checks: ~10 min
- Full Build: ~120 min (parallel)

**Monthly estimate:**
- 30 PRs × 10 min = 300 min
- 30 merges × 120 min = 3,600 min
- **Total: ~3,900 min/month**

Exceeds free tier by ~1,900 minutes.

**Solutions:**
- Run full build only on main
- Use self-hosted runners
- Optimize build times

## Support

For issues:
1. Check workflow logs in GitHub Actions
2. Test locally using commands above
3. Review this guide
4. Open issue if problem persists

## Summary

- ✅ Two workflows: Basic (fast) + Full (comprehensive)
- ✅ All 7 frameworks checked
- ✅ Timeouts prevent hanging
- ✅ Artifacts saved for 7 days
- ✅ Parallel execution optimized
- ✅ Docker validation included

**Result:** Robust CI/CD that catches issues early while keeping feedback fast! 🚀
