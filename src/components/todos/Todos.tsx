'use client';

import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@prisma/client';
import useFetch from '@/hooks/use-fetch';
import TodoSheet from '@/components/todos/TodoSheet';

const Todos = () => {
  const { data: todos, error, isLoading } = useFetch<Todo[]>('/api/todos');
  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;
  return (
    <div className="p-4">
      <NewTodos />
      <div className="max-h-80 overflow-y-auto">
        {todos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
      </div>
      <TodoSheet />
    </div>
  );
};

export default Todos;
