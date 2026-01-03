import React from 'react';

export const TodoFilter = ({ currentFilter, onFilterChange }) => (
  <div className="todo-filters">
    <button
      className={`btn filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
      onClick={() => onFilterChange('all')}
      aria-label="Show all todos"
    >
      All
    </button>
    <button
      className={`btn filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
      onClick={() => onFilterChange('active')}
      aria-label="Show active todos"
    >
      Active
    </button>
    <button
      className={`btn filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
      onClick={() => onFilterChange('completed')}
      aria-label="Show completed todos"
    >
      Completed
    </button>
  </div>
);
