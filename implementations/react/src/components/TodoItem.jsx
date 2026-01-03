import React from 'react';

export const TodoItem = ({ todo, onToggle, onDelete }) => (
  <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
    <input
      type="checkbox"
      className="todo-checkbox"
      checked={todo.completed}
      onChange={() => onToggle(todo.id, todo.completed)}
      aria-label={`Toggle ${todo.text}`}
    />
    <span className="todo-text">{todo.text}</span>
    <button
      className="btn btn-delete"
      onClick={() => onDelete(todo.id)}
      aria-label={`Delete ${todo.text}`}
    >
      Delete
    </button>
  </li>
);
