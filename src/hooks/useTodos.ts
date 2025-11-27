import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(() => {
    axios.get<Todo[]>(`${import.meta.env.VITE_API_ENDPOINT}/todos`)
      .then(res => {
        setTodos(res.data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to fetch todos:', err);
        setError('Failed to fetch todos');
      });
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTodo = (title: string) => {
    if (!title.trim()) return;
    axios.post(`${import.meta.env.VITE_API_ENDPOINT}/todos`, { title: title.trim(), completed: false })
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to create todo:', err);
        setError('Failed to create todo');
      });
  };

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    axios.put(`${import.meta.env.VITE_API_ENDPOINT}/todos/${id}`, updates)
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to update todo:', err);
        setError('Failed to update todo');
      });
  };

  const deleteTodo = (id: number) => {
    axios.delete(`${import.meta.env.VITE_API_ENDPOINT}/todos/${id}`)
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to delete todo:', err);
        setError('Failed to delete todo');
      });
  };

  const reorderTodos = (newTodos: Todo[]) => {
    setTodos(newTodos); // optimistically update the todos
    axios.put(`${import.meta.env.VITE_API_ENDPOINT}/todos`, newTodos)
      .catch(err => {
        console.error('Failed to reorder todos:', err);
        setError('Failed to reorder todos');
        fetchTodos(); // revert on error
      });
  };

  return {
    todos,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    refreshTodos: fetchTodos,
  };
}

