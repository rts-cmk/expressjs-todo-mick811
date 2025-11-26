import { useState, type FormEvent } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (newTodoTitle.trim()) {
      onSubmit(newTodoTitle);
      setNewTodoTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="todo-input"
      />
      <button type="submit" className="btn btn-primary">Add</button>
    </form>
  );
}
