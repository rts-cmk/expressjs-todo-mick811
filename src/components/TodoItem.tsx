import { useState, memo, type KeyboardEvent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
}

export const TodoItem = memo(function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
    <li
      ref={setNodeRef}
      style={style}
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
    >
      <div className="drag-handle" {...attributes} {...listeners} aria-label="Drag handle">
        ⋮⋮
      </div>
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
});
