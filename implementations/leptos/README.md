# Leptos Todo Implementation

This is the Leptos (Rust WebAssembly) implementation of the frontend benchmark Todo application.

## Tech Stack

- Leptos (latest version)
- Rust + WebAssembly
- Trunk (build tool)

## Features

- Add, toggle, and delete todos
- Filter todos (All, Active, Completed)
- Display remaining todo count
- Pre-populated with 100 todos
- Responsive design
- Fine-grained reactivity

## Prerequisites

- Rust 1.70+
- Trunk: `cargo install trunk`
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

## Project Setup

```bash
# Initialize Leptos project
cargo init --name leptos-todo
```

Add to `Cargo.toml`:
```toml
[dependencies]
leptos = { version = "0.7", features = ["csr"] }
console_error_panic_hook = "0.1"
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

- Fine-grained reactivity system
- Minimal WASM bundle size with optimization
- Direct DOM manipulation without virtual DOM
- Zero-cost abstractions

## Implementation Notes

Leptos provides exceptional performance through its fine-grained reactivity system. The framework compiles to WebAssembly, resulting in near-native performance in the browser.

Key features used:
- Signals for reactive state
- Memos for computed values
- Components for UI organization
- No Virtual DOM overhead

## Code Structure

- `src/main.rs` - Entry point and main Todo component
- `src/components/` - Individual components (if split)
- `index.html` - HTML template for Trunk
- `Trunk.toml` - Trunk configuration
