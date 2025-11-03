# Yew Todo Implementation

This is the Yew (Rust WebAssembly) implementation of the frontend benchmark Todo application.

## Tech Stack

- Yew (latest version)
- Rust + WebAssembly
- Trunk (build tool)

## Features

- Add, toggle, and delete todos
- Filter todos (All, Active, Completed)
- Display remaining todo count
- Pre-populated with 100 todos
- Responsive design
- Component-based architecture

## Prerequisites

- Rust 1.70+
- Trunk: `cargo install trunk`
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

## Project Setup

```bash
# Initialize Yew project
cargo init --name yew-todo
```

Add to `Cargo.toml`:
```toml
[dependencies]
yew = { version = "0.21", features = ["csr"] }
web-sys = "0.3"
wasm-bindgen = "0.2"

[profile.release]
opt-level = 'z'
lto = true
codegen-units = 1
```

## Getting Started

### Development

```bash
trunk serve --open
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
trunk build --release
```

The production build will be in the `dist/` directory.

## Performance Considerations

- Component-based architecture inspired by React
- Virtual DOM with efficient diffing
- WebAssembly compilation for performance
- Optimized bundle size

## Implementation Notes

Yew is one of the most mature Rust frontend frameworks, following a component-based architecture similar to React. It compiles to WebAssembly and provides excellent performance.

Key features used:
- Components with lifecycle methods
- Message passing for state updates
- Props for component communication
- Hooks for modern functional components

## Code Structure

- `src/main.rs` - Entry point
- `src/app.rs` - Main Todo component
- `src/components/` - Individual components (if split)
- `index.html` - HTML template for Trunk
- `Trunk.toml` - Trunk configuration
