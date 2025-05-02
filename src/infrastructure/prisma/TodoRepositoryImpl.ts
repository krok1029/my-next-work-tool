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
    return todoData ? Todo.fromPrisma(todoData) : null;
  }

  async findAllByUser(userId: string, filter: TodoFilter = {}): Promise<Todo[]> {
    const where: Prisma.TodoWhereInput = {
      userId,
      ...(filter.deadlineToday && {
        deadline: {
          gte: dayjs().startOf('day').toDate(),
          lte: dayjs().endOf('day').toDate(),
        },
      }),
      ...(filter.completed !== undefined && { completed: filter.completed }),
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.deadlineBefore && { deadline: { lte: filter.deadlineBefore } }),
      ...(filter.deadlineAfter && { deadline: { gte: filter.deadlineAfter } }),
      ...(filter.search && { title: { contains: filter.search } }),
    };

    const orderBy: Prisma.TodoOrderByWithRelationInput[] = [];
    if (filter.sortByPriority) {
      orderBy.push({ priority: 'desc' });
    }

    const todoData = await prisma.todo.findMany({
      where,
      orderBy: orderBy.length ? orderBy : undefined,
    });

    return todoData.map((todo) => Todo.fromPrisma(todo)); // ✅ 統一 fromPrisma
  }

  async update(todo: Todo): Promise<Todo> {
    if (todo.id === null) {
      throw new Error('Cannot update a Todo without an ID');
    }
    const todoData = await prisma.todo.update({
      where: { id: todo.id },
      data: {
        title: todo.title,
        completed: todo.completed,
        totalPomodoros: todo.totalPomodoros,
        completedPomodoros: todo.completedPomodoros,
        priority: todo.priority,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
      },
    });
    return Todo.fromPrisma(todoData);
  }

  async create(todo: Todo): Promise<Todo> {
    const todoData = await prisma.todo.create({
      data: {
        title: todo.title,
        completed: todo.completed,
        totalPomodoros: todo.totalPomodoros,
        completedPomodoros: todo.completedPomodoros,
        priority: todo.priority,
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
        userId: todo.userId,
      },
    });
    return Todo.fromPrisma(todoData);
  }

  async delete(id: number): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  }
}
