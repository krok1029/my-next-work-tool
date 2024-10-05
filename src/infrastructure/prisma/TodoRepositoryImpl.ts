// infrastructure/prisma/TodoRepositoryImpl.ts
import prisma from './PrismaClient';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo } from '@/domain/todo/Todo';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaTodoRepository implements TodoRepository {
  async findById(id: number): Promise<Todo | null> {
    const todoData = await prisma.todo.findUnique({ where: { id } });
    if (!todoData) {
      return null;
    }
    return new Todo(todoData.id, todoData.title, todoData.completed);
  }

  async findAllByUser(userId: string): Promise<Todo[]> {
    const todoData = await prisma.todo.findMany({
      where: {
        userId,
      },
    });
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
  async create(data: { title: string; userId: string }): Promise<Todo> {
    const todoData = await prisma.todo.create({
      data: {
        title: data.title,
        completed: false, // 默認為未完成
        totalPomodoros: 1, // 默認需要 1 個番茄鐘
        completedPomodoros: 0, // 默認完成 0 個番茄鐘
        userId: data.userId, // 關聯到 User
      },
    });

    return new Todo(todoData.id, todoData.title, todoData.completed);
  }
}
