// infrastructure/prisma/TodoRepositoryImpl.ts
import { PrismaClient } from '@prisma/client';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo } from '@/domain/todo/Todo';

const prisma = new PrismaClient();

export class PrismaTodoRepository implements TodoRepository {
  async findById(id: number): Promise<Todo | null> {
    const todoData = await prisma.todo.findUnique({ where: { id } });
    if (!todoData) {
      return null;
    }
    return new Todo(todoData.id, todoData.title, todoData.completed);
  }

  async save(todo: Todo): Promise<void> {
    await prisma.todo.update({
      where: { id: todo.id },
      data: {
        title: todo.title,
        completed: todo.completed,
      },
    });
  }
}
