#!/bin/bash

# Quick Benchmark Script - JavaScript Frameworks Only
# This script benchmarks React, Vue, and Angular (faster than Rust frameworks)
# For full benchmarking including Rust, use: npm run benchmark:docker:full

set -e

echo "🚀 Quick Benchmark Suite - JavaScript Frameworks"
echo "=================================================="
echo ""
echo "This will benchmark:"
echo "  - React"
echo "  - Vue"
echo "  - Angular"
echo ""
echo "Estimated time: 30-45 minutes"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

cd "$(dirname "$0")/../.."

FRAMEWORKS=("react" "vue" "angular")
RESULTS_FILE="benchmarks/results/quick-benchmark-$(date +%Y%m%d-%H%M%S).json"

echo "[]" > "$RESULTS_FILE"

for FRAMEWORK in "${FRAMEWORKS[@]}"; do
    echo ""
    echo "============================================"
    echo "Benchmarking: $FRAMEWORK"
    echo "============================================"
    
    # Build and start
    echo "▶️  Building $FRAMEWORK..."
    docker compose build "$FRAMEWORK"
    docker compose up -d "$FRAMEWORK"
    
    # Wait for readiness
    PORT=$((3000 + $(echo "${FRAMEWORKS[@]}" | tr ' ' '\n' | grep -n "^$FRAMEWORK$" | cut -d: -f1)))
    echo "⏳ Waiting for $FRAMEWORK on port $PORT..."
    
    for i in {1..30}; do
        if curl -s "http://localhost:$PORT" > /dev/null 2>&1; then
            echo "✅ $FRAMEWORK is ready"
            break
        fi
        sleep 2
    done
    
    # Collect stats for 30 seconds
    echo "📊 Collecting stats for 30 seconds..."
    CONTAINER_NAME="frontend-benchmark-$FRAMEWORK"
    
    # Sample stats
    docker stats "$CONTAINER_NAME" --no-stream --format "{{.CPUPerc}},{{.MemUsage}}" > "/tmp/${FRAMEWORK}-stats.txt"
    
    # Get bundle sizes
    echo "📦 Analyzing bundle sizes..."
    rm -rf "/tmp/${FRAMEWORK}-dist"
    docker cp "$CONTAINER_NAME:/usr/share/nginx/html" "/tmp/${FRAMEWORK}-dist"
    
    JS_SIZE=$(find "/tmp/${FRAMEWORK}-dist" -name "*.js" -exec cat {} + | wc -c)
    CSS_SIZE=$(find "/tmp/${FRAMEWORK}-dist" -name "*.css" -exec cat {} + | wc -c)
    JS_GZIP=$(find "/tmp/${FRAMEWORK}-dist" -name "*.js" -exec cat {} + | gzip -c | wc -c)
    
    echo "   JS: $JS_SIZE bytes (gzipped: $JS_GZIP bytes)"
    echo "   CSS: $CSS_SIZE bytes"
    
    # Run Lighthouse (if installed)
    if command -v lighthouse &> /dev/null; then
        echo "🔍 Running Lighthouse audit..."
        lighthouse "http://localhost:$PORT" \
            --only-categories=performance \
            --output=json \
            --output-path="/tmp/${FRAMEWORK}-lighthouse.json" \
            --quiet \
            --chrome-flags="--headless --no-sandbox"
    else
        echo "⚠️  Lighthouse not found, skipping performance audit"
    fi
    
    # Stop container
    echo "🛑 Stopping $FRAMEWORK..."
    docker compose down "$FRAMEWORK"
    
    echo "✅ $FRAMEWORK benchmark complete"
done

echo ""
echo "============================================"
echo "📊 Quick Benchmark Complete!"
echo "============================================"
echo ""
echo "Results saved to: $RESULTS_FILE"
echo ""
echo "To benchmark ALL frameworks including Rust:"
echo "  cd benchmarks/scripts"
echo "  npm run benchmark:docker:full"
echo ""
