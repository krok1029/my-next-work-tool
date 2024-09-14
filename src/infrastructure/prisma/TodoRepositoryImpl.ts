// infrastructure/prisma/TodoRepositoryImpl.ts
import prisma from './PrismaClient';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo } from '@/domain/todo/Todo';

export class PrismaTodoRepository implements TodoRepository {
  async findById(id: number): Promise<Todo | null> {
    const todoData = await prisma.todo.findUnique({ where: { id } });
    if (!todoData) {
      return null;
    }
    return new Todo(todoData.id, todoData.title, todoData.completed);
  }

  async findAll(): Promise<Todo[]> {
    const todoData = await prisma.todo.findMany();
    return todoData.map(
      (todoData) => new Todo(todoData.id, todoData.title, todoData.completed)
    );
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
  async create(data: { title: string }): Promise<Todo> {
    const todoData = await prisma.todo.create({
      data: {
        title: data.title,
        completed: false, // 每次創建時，completed 都默認為 false
      },
    });

    return new Todo(todoData.id, todoData.title, todoData.completed);
  }
}
