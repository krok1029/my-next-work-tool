import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { TodoController } from '@/interface-adapters/controllers/TodoController';
import { TodoMapper } from '@/interface-adapters/dto/TodoDTO';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import TodoItem from './_components/TodoItem';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import NewTodos from '@/components/todos/NewTodos';

export default async function Todos() {
  const controller = container.resolve(TodoController);
  const todos = await controller.getAll();
  const todoDTOs = todos.map((todo) => TodoMapper.toDTO(todo));

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
            {todoDTOs.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
