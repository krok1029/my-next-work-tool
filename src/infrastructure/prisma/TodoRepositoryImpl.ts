// infrastructure/prisma/TodoRepositoryImpl.ts
import prisma from './PrismaClient';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo, TodoFilter } from '@/domain/todo/Todo';
import { injectable } from 'tsyringe';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

@injectable()
export class PrismaTodoRepository implements TodoRepository {
  async findById(id: number): Promise<Todo | null> {
    const todoData = await prisma.todo.findUnique({ where: { id } });
    if (!todoData) {
      return null;
    }
    return new Todo(todoData);
  }

  async findAllByUser(
    userId: string,
    filter: TodoFilter = {}
  ): Promise<Todo[]> {
    const query = {
      where: {
        userId,
        ...(filter.deadlineToday && {
          deadline: {
            gte: dayjs().startOf('day').toDate(),
            lte: dayjs().endOf('day').toDate(),
          },
        }),
        ...(filter.completed !== undefined && { completed: filter.completed }),
        ...(filter.priority && { priority: filter.priority }),
        ...(filter.deadlineBefore && {
          deadline: { lte: filter.deadlineBefore },
        }),
        ...(filter.deadlineAfter && {
          deadline: { gte: filter.deadlineAfter },
        }),
        ...(filter.search && { title: { contains: filter.search } }),
      },
      orderBy: [
        filter.sortByPriority && {
          priority: Prisma.SortOrder.desc,
        },
      ].filter(Boolean),
    } as Prisma.TodoFindManyArgs;

    const todoData = await prisma.todo.findMany(query);
    return todoData.map((todo) => new Todo(todo));
  }
  async save(todo: Todo): Promise<void> {
    await prisma.todo.update({
      where: { id: todo.id },
      data: {
        title: todo.title,
        completed: todo.completed,
        totalPomodoros: todo.totalPomodoros,
        completedPomodoros: todo.completedPomodoros,
      },
    });
  }
  async create(data: { title: string; userId: string }): Promise<Todo> {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // 設置為今天的 23:59:59

    const todoData = await prisma.todo.create({
      data: {
        title: data.title,
        completed: false, // 默認為未完成
        totalPomodoros: 1, // 默認需要 1 個番茄鐘
        completedPomodoros: 0, // 默認完成 0 個番茄鐘
        userId: data.userId, // 關聯到 User
        deadline: today,
      },
    });

    return new Todo(todoData);
  }
  async delete(id: number): Promise<void> {
    await prisma.todo.delete({
      where: { id },
    });
  }
}
