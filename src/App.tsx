import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

export default function App() {
  const { todos, createTodo, updateTodo, deleteTodo, error } = useTodos();

  return (
    <div className="app">
      <h1>Todo List</h1>
      {error && <div className="error-message">{error}</div>}
      
      <TodoForm onSubmit={createTodo} />
      
      <TodoList 
        todos={todos} 
        onUpdate={updateTodo} 
        onDelete={deleteTodo} 
      />
    </div>
  );
}
