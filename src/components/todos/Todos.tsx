import { PrismaClient } from '@prisma/client';
import TodoItem from './TodoItem';
import NewTodos from './NewTodos';

const prisma = new PrismaClient();

const Todos = async () => {
  const todos = await prisma.todo.findMany();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todos</h1>
      <NewTodos />
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default Todos;
