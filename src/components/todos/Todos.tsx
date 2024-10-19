'use client';

import useSWR from 'swr';
import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Todos = () => {
  const {
    data: todos,
    error,
    isLoading,
  } = useSWR<Todo[]>('/api/todos', fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 0,
  });

  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;

  return (
    <div className="p-4">
      <NewTodos />
      <div className="max-h-80 overflow-y-auto">
        {todos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default Todos;
