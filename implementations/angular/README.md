# Angular Todo Implementation

This is the Angular implementation of the frontend benchmark Todo application.

## Tech Stack

- Angular 19.1.2
- TypeScript
- Standalone Components
- Signals API

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
npm start
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### Build

```bash
npm run build
```

The production build will be in the `dist/angular-todo` directory.

## Performance Considerations

- Uses Angular Signals for reactive state management
- Computed properties for filtered todos and remaining count
- OnPush change detection strategy through standalone components
- Efficient trackBy with *ngFor

## Bundle Size

Run `npm run build` to see the production bundle size.

## Code Structure

- `src/app/app.ts` - Main Todo application component with Signals
- `src/app/app.html` - Template
- `src/styles.css` - Shared styling (copied from `/shared/styles/`)
- `src/main.ts` - Entry point
