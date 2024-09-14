// /components/Todos.tsx
'use client';

import { useState, useEffect } from 'react';
import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos'); // 調用 API 路由
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data); // 設置拿到的 todos 列表
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <NewTodos onTodoCreated={fetchTodos} /> {/* 創建新 Todo 後重新 fetch */}
      <div className="max-h-80 overflow-y-auto">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
};

export default Todos;
