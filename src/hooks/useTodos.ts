import { useState, useEffect, useCallback } from 'react';
import * as api from '../api';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // initial load
  useEffect(() => {
    api.getTodos()
      .then(setTodos)
      .catch((err) => {
        console.error(err);
        setError('Failed to load todos');
      });
  }, []);

  const addTodo = async (title: string) => {
    setIsLoading(true);
    // optimistic update: create a fake todo and add it immediately
    const tempId = Date.now();
    const tempTodo: Todo = { id: tempId, title, completed: false };
    
    setTodos(prev => [...prev, tempTodo]);

    try {
      // network request
      const newTodo = await api.createTodo(title);
      
      // replace the fake one with the real one from server
      setTodos(prev => prev.map(t => t.id === tempId ? newTodo : t));
    } catch (err) {
      // rollback on error
      setError('Failed to create todo');
      setTodos(prev => prev.filter(t => t.id !== tempId));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id: number, updates: Partial<Todo>) => {
    // snapshot previous state for rollback
    const previousTodos = [...todos];

    // optimistic update
    setTodos(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));

    try {
      // network request
      await api.updateTodo(id, updates);
    } catch (err) {
      // rollback
      setError('Failed to update todo');
      setTodos(previousTodos);
    }
  };

  const deleteTodo = async (id: number) => {
    const previousTodos = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));

    try {
      await api.deleteTodo(id);
    } catch (err) {
      setError('Failed to delete todo');
      setTodos(previousTodos);
    }
  };

  const reorderTodos = async (newTodos: Todo[]) => {
    const previousTodos = [...todos];
    setTodos(newTodos);

    try {
      await api.reorderTodos(newTodos);
    } catch (err) {
      setError('Failed to reorder todos');
      setTodos(previousTodos);
    }
  };

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
  };
}
