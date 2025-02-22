'use client';

import TodoItem from '@/components/todos/TodoItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Priority } from '@prisma/client';
import { Search } from 'lucide-react';

function setIsOpen() {}

const testTodo = {
  id: 1,
  title: 'werwer',
  completed: false,
  totalPomodoros: 2,
  completedPomodoros: 4,
  userId: 'dsfasdfasdfasf',
  createdAt: new Date(),
  priority: Priority.HIGH,
  parentTodoId: null,
  deadline: new Date(),
};
export default function Todos() {
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
            <TodoItem todo={testTodo} setIsOpen={setIsOpen} />
          </CardContent>
        </Card>
      </main>
    </>
  );
}
