import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ENDPOINT,
});

export const getTodos = async () => {
  const { data } = await api.get<Todo[]>('/todos');
  return data;
};

export const createTodo = async (title: string) => {
  const { data } = await api.post<Todo>('/todos', { title, completed: false });
  return data;
};

export const updateTodo = async (id: number, updates: Partial<Todo>) => {
  const { data } = await api.put<Todo>(`/todos/${id}`, updates);
  return data;
};

export const deleteTodo = async (id: number) => {
  await api.delete(`/todos/${id}`);
};

export const reorderTodos = async (todos: Todo[]) => {
  const { data } = await api.put<Todo[]>('/todos', todos);
  return data;
};

