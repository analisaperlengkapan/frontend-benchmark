# Vue.js Todo Implementation

This is the Vue.js implementation of the frontend benchmark Todo application.

## Tech Stack

- Vue.js 3.5.13
- Vite (Build tool)
- Composition API with `<script setup>`

## Features

- Add, toggle, and delete todos
- Filter todos (All, Active, Completed)
- Display remaining todo count
- Pre-populated with 100 todos
- Responsive design
- Accessibility support

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

The production build will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Performance Considerations

- Uses Composition API for optimal reactivity
- Computed properties for filtered todos and remaining count
- Efficient v-for rendering with keys
- Reactive state management

## Bundle Size

Run `npm run build` to see the production bundle size.

## Code Structure

- `src/App.vue` - Main Todo application component using Composition API
- `src/style.css` - Shared styling (copied from `/shared/styles/`)
- `src/main.js` - Entry point
