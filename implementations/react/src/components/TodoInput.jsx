import React, { useState } from 'react';

export const TodoInput = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="todo-input-container">
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        aria-label="New todo input"
      />
      <button
        className="btn btn-primary"
        onClick={handleAdd}
        aria-label="Add todo"
      >
        Add
      </button>
    </div>
  );
};
