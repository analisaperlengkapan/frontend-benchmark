# Build stage
FROM rust:1.86-slim AS builder

# Install dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev wget && \
    rm -rf /var/lib/apt/lists/*

# Install wasm target and wasm-bindgen CLI (avoid building dioxus-cli to reduce heavy compile deps)
RUN rustup target add wasm32-unknown-unknown && \
    cargo install wasm-bindgen-cli --version 0.2.105

WORKDIR /app

# Copy source files
COPY . .

# Build for production using cargo + wasm-bindgen
RUN cargo build --release --target wasm32-unknown-unknown && \
    wasm-bindgen --target web --out-dir dist target/wasm32-unknown-unknown/release/dioxus_todo.wasm && \
    mkdir -p dist && \
    cp index.html dist/

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
