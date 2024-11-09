'use client';

import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';
import useFetch from '@/hooks/use-fetch';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

const Todos = () => {
  const { data: todos, error, isLoading } = useFetch<Todo[]>('/api/todos');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;

  return (
    <div className="p-4">
      <Sheet>
        <NewTodos />
        <div className="max-h-80 overflow-y-auto">
          {todos?.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              setSelectedTodo={(todo: Todo) => setSelectedTodo(todo)}
            />
          ))}
        </div>
        {/* <SheetTrigger>Open</SheetTrigger> */}
        <SheetContent>
          {selectedTodo && (
            <SheetHeader>
              <SheetTitle>{selectedTodo.title}</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Todos;
