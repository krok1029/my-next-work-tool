'use client';

import useSWR from 'swr';
import NewTodos from './NewTodos';
import TodoItem from './TodoItem';
import { Todo } from '@/domain/todo/Todo';

// fetcher 函數用來處理資料抓取
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Todos = () => {
  // 使用 SWR 來抓取資料
  const {
    data: todos,
    error,
    isLoading,
  } = useSWR<Todo[]>('/api/todos', fetcher, {
    revalidateOnFocus: true, // 當重新聚焦頁面時，重新抓取資料
  });

  // 處理載入中狀態
  if (isLoading) return <p>Loading...</p>;

  // 處理錯誤
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
