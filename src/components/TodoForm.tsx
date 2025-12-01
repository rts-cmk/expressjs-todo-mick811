import { useRef } from 'react';

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void>;
  disabled?: boolean;
}

export function TodoForm({ onSubmit, disabled }: TodoFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const formData = new FormData(formRef.current!);
    const title = formData.get('title') as string;

    if (!title.trim()) return;

    await onSubmit(title);
    formRef.current?.reset();
    inputRef.current?.focus();
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className="todo-form"
    >
      <input
        ref={inputRef}
        type="text"
        name="title"
        placeholder="What needs to be done?"
        className="todo-input"
        required
        autoComplete="off"
        disabled={disabled}
      />
      <button 
        type="submit" 
        disabled={disabled}
        className="btn btn-primary"
      >
        {disabled ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
}
