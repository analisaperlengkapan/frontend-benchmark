# Dioxus Todo Implementation

This is the Dioxus (Rust WebAssembly) implementation of the frontend benchmark Todo application.

## Tech Stack

- Dioxus (latest version)
- Rust + WebAssembly
- Dioxus CLI (dx)

## Features

- Add, toggle, and delete todos
- Filter todos (All, Active, Completed)
- Display remaining todo count
- Pre-populated with 100 todos
- Responsive design
- React-like syntax with RSX

## Prerequisites

- Rust 1.70+
- Dioxus CLI: `cargo install dioxus-cli`
- wasm32-unknown-unknown target: `rustup target add wasm32-unknown-unknown`

## Project Setup

```bash
# Initialize Dioxus project
dx new dioxus-todo
```

Or manually add to `Cargo.toml`:
```toml
[dependencies]
dioxus = { version = "0.6", features = ["web"] }
dioxus-web = "0.6"

[profile.release]
opt-level = 'z'
lto = true
codegen-units = 1
```

## Getting Started

### Development

```bash
dx serve --hot-reload
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
dx build --release
```

The production build will be in the `dist/` directory.

## Performance Considerations

- React-like mental model with Rust performance
- Fine-grained reactivity without virtual DOM overhead
- WebAssembly compilation
- Hot reloading in development

## Implementation Notes

Dioxus provides a familiar React-like API but with Rust's performance and safety benefits. It uses RSX syntax similar to JSX and compiles to WebAssembly.

Key features used:
- use_state hook for reactive state
- use_memo for computed values
- RSX for declarative UI
- Event handlers with strong typing

## Code Structure

- `src/main.rs` - Entry point and main Todo component
- `src/components.rs` - Component definitions (if split)
- `Dioxus.toml` - Dioxus configuration
- `public/` - Static assets
