import React from 'react';
import './App.css';
import { useTodos } from './hooks/useTodos';
import { TodoHeader } from './components/TodoHeader';
import { TodoInput } from './components/TodoInput';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';

function App() {
  const {
    loading,
    error,
    filter,
    setFilter,
    filteredTodos,
    remainingCount,
    addTodo,
    toggleTodo,
    deleteTodo
  } = useTodos();

  return (
    <div className="todo-app">
      <TodoHeader />

      <TodoInput onAdd={addTodo} />

      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

      <div className="todo-stats">
        {remainingCount} {remainingCount === 1 ? 'item' : 'items'} remaining
      </div>

      {loading ? (
        <div className="loading-state">Loading...</div>
      ) : error ? (
        <div className="error-state">Error: {error}</div>
      ) : (
        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      )}

      <div className="todo-footer">
        Frontend Benchmark - React Implementation
      </div>
    </div>
  );
}

export default App;
