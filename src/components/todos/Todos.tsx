'use client';

import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@prisma/client';
import useFetch from '@/hooks/use-fetch';
import TodoSheet from '@/components/todos/TodoSheet';
import { useState } from 'react';

const Todos = () => {
  const { data: todos, error, isLoading } = useFetch<Todo[]>('/api/todos');
  const [isOpen, setIsOpen] = useState(false);
  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;
  return (
    <div className="p-4">
      <NewTodos />
      <div className="max-h-72 overflow-y-auto">
        {todos &&
          todos.map((todo) => (
            <div key={todo.id}>
              <TodoItem todo={todo} setIsOpen={setIsOpen} />
            </div>
          ))}
      </div>
      <TodoSheet isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Todos;
