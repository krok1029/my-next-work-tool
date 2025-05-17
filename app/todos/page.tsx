'use client';

import { useState } from 'react';
import TodoItem from './_components/TodoItem';
import TodoSheet from '@/components/todos/TodoSheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useFetch from '@hooks/use-fetch';
import { Todo } from '@prisma/client';
import { Search } from 'lucide-react';
import NewTodos from '@/components/todos/NewTodos';

export default function Todos() {
  const { data: todos } = useFetch<Todo[]>('todos');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <aside className="fixed bottom-0 left-0 h-[calc(100dvh-4rem)] border-0 border-r border-red-500 p-4">
        sidebar
      </aside>
      <main className="p-4">
        <div className="mb-1 flex gap-1">
          <Input id="firstName" name="firstName" required />
          <Button>
            <Search />
          </Button>
        </div>
        <Card>
          <CardHeader>Todos List</CardHeader>
          <CardContent>
            <NewTodos />
            {todos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
          </CardContent>
        </Card>
        <TodoSheet isOpen={false} setIsOpen={() => {}} />
      </main>
    </>
  );
}
