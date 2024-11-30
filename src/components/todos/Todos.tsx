'use client';

import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';
import useFetch from '@/hooks/use-fetch';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { startTransition, useState } from 'react';

import { z } from 'zod';

import { Priority } from '@prisma/client';

const formSchema = z.object({
  title: z.string().min(2).max(50),
  totalPomodoros: z.number(),
  priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]),
  deadline: z.date(),
});

const Todos = () => {
  const { data: todos, error, isLoading } = useFetch<Todo[]>('/api/todos');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      console.log(formData.get('title'));
    });
  };
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
        <SheetContent>
          <div>Edit Todo</div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Todos;
