import { useState, useEffect, useCallback, useMemo } from 'react';
import { todoService } from '../services/api';

export const useTodos = (initialFilter = 'all') => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await todoService.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (text) => {
    try {
      const newTodo = await todoService.addTodo(text);
      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTodo = async (id, completed) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    try {
      await todoService.updateTodo(id, { completed: !completed });
    } catch (err) {
      // Revert if failed
      setError(err.message);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: completed } : todo
        )
      );
    }
  };

  const deleteTodo = async (id) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      setError(err.message);
      setTodos(previousTodos);
    }
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const remainingCount = useMemo(
    () => todos.filter((todo) => !todo.completed).length,
    [todos]
  );

  return {
    todos,
    loading,
    error,
    filter,
    setFilter,
    filteredTodos,
    remainingCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    refreshTodos: fetchTodos
  };
};
