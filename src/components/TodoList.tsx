import { TodoItem } from './TodoItem';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: number, updates: Partial<Todo>) => void;
  onDelete: (id: number) => void;
  onReorder: (newTodos: Todo[]) => void;
}

export function TodoList({ todos, onUpdate, onDelete, onReorder }: TodoListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    
    if (active.id !== over?.id) {
        const oldIndex = todos.findIndex((item) => item.id === active.id);
        const newIndex = todos.findIndex((item) => item.id === over?.id);
        
        onReorder(arrayMove(todos, oldIndex, newIndex));
    }
  }

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={todos}
        strategy={verticalListSortingStrategy}
      >
        <ul className="todo-list">
          {todos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

