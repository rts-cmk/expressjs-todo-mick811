import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';

export default function App() {
  const { 
    todos, 
    isLoading, 
    error, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    reorderTodos 
  } = useTodos();

  return (
    <div className="app">
      <h1>Todo List</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <TodoForm 
        onSubmit={addTodo} 
        disabled={isLoading} 
      />
      
      <TodoList 
        todos={todos} 
        onUpdate={updateTodo} 
        onDelete={deleteTodo}
        onReorder={reorderTodos}
      />
    </div>
  );
}
