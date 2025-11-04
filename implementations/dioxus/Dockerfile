# Build stage
FROM rust:1.75-slim AS builder

# Install dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev wget && \
    rm -rf /var/lib/apt/lists/*

# Install dioxus-cli and wasm target
RUN rustup target add wasm32-unknown-unknown && \
    cargo install dioxus-cli

WORKDIR /app

# Copy source files
COPY . .

# Build for production
RUN dx build --release

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
