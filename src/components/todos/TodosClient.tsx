'use client';

import { useState } from 'react';
import TodoItem from './TodoItem';
import TodoSheet from './TodoSheet';
import NewTodos from './NewTodos';
import { TodoDTO } from '@/interface-adapters/dto/TodoDTO';

const TodosClient = ({ initialTodos }: { initialTodos: TodoDTO[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <NewTodos />
      <div className="max-h-72 overflow-y-auto">
        {initialTodos?.map((todo) => (
          <TodoItem key={todo.id} todo={todo} setIsOpen={setIsOpen} />
        ))}
      </div>
      <TodoSheet isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default TodosClient;
