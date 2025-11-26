import { useState, type KeyboardEvent } from 'react';
interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const startEditing = () => {
    setIsEditing(true);
    setEditingTitle(todo.title);
  };

  const saveEdit = () => {
    if (!editingTitle.trim()) {
      setIsEditing(false);
      return;
    }
    onUpdate(todo.id, { title: editingTitle.trim() });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTitle(todo.title);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') saveEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const toggleComplete = () => {
    onUpdate(todo.id, { completed: !todo.completed });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggleComplete}
        className="todo-checkbox"
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="todo-edit-input"
        />
      ) : (
        <span
          onDoubleClick={startEditing}
          className="todo-title"
        >
          {todo.title}
        </span>
      )}
      
      <button
        onClick={() => onDelete(todo.id)}
        className="btn btn-delete"
        aria-label="Delete todo"
      >
        Delete
      </button>
    </li>
  );
}
