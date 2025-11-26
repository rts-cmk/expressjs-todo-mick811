import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
const API_URL = 'http://localhost:3000/todos';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(() => {
    axios.get<Todo[]>(API_URL)
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
    axios.post(API_URL, { title: title.trim(), completed: false })
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to create todo:', err);
        setError('Failed to create todo');
      });
  };

  const updateTodo = (id: number, updates: Partial<Todo>) => {
    axios.put(`${API_URL}/${id}`, updates)
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to update todo:', err);
        setError('Failed to update todo');
      });
  };

  const deleteTodo = (id: number) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchTodos())
      .catch(err => {
        console.error('Failed to delete todo:', err);
        setError('Failed to delete todo');
      });
  };

  return {
    todos,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    refreshTodos: fetchTodos,
  };
}

