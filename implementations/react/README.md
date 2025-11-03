# React Todo Implementation

This is the React implementation of the frontend benchmark Todo application.

## Tech Stack

- React 19.1.1
- Vite (Build tool)
- ESLint (Linting)

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

- Uses `useMemo` for filtered todos and remaining count
- Efficient key-based list rendering
- Minimal re-renders through proper state management
- Single source of truth for state

## Bundle Size

Run `npm run build` to see the production bundle size.

## Code Structure

- `src/App.jsx` - Main Todo application component
- `src/App.css` - Shared styling (copied from `/shared/styles/`)
- `src/main.jsx` - Entry point
