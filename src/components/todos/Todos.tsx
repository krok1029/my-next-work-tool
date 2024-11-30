'use client';

import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';
import useFetch from '@/hooks/use-fetch';
import { useState } from 'react';
import TodoSheet from '@/components/todos/TodoSheet';

const Todos = () => {
  const { data: todos, error, isLoading } = useFetch<Todo[]>('/api/todos');
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  if (isLoading) return;

  if (error) return <p className="text-red-500">Error fetching todos</p>;
  console.log('todos', todos);
  return (
    <div className="p-4">
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
      <TodoSheet
        selectedTodo={selectedTodo}
        clearSelectedTodo={() => setSelectedTodo(null)}
      />
    </div>
  );
};

export default Todos;
