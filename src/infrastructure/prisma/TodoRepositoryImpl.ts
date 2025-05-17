// infrastructure/prisma/TodoRepositoryImpl.ts
import prisma from './PrismaClient';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Priority as DomainPriority } from '@/domain/todo/TodoTypes';
import { Priority as PrismaPriority, Todo as PrismaTodo } from '@prisma/client';
import { Todo, TodoFilter } from '@/domain/todo/Todo';
import { injectable } from 'tsyringe';
import dayjs from 'dayjs';
import { Prisma } from '@prisma/client';

@injectable()
export class PrismaTodoRepository implements TodoRepository {
  private mapPrismaTodoToDomain(prismaTodo: PrismaTodo): Todo {
    return new Todo({
      id: prismaTodo.id,
      userId: prismaTodo.userId,
      title: prismaTodo.title,
      completed: prismaTodo.completed,
      totalPomodoros: prismaTodo.totalPomodoros,
      completedPomodoros: prismaTodo.completedPomodoros,
      priority: this.mapPrismaPriorityToDomain(prismaTodo.priority),
      deadline: prismaTodo.deadline,
    });
  }

  private mapPrismaPriorityToDomain(priority: PrismaPriority): DomainPriority {
    switch (priority) {
      case PrismaPriority.LOW:
        return DomainPriority.LOW;
      case PrismaPriority.MEDIUM:
        return DomainPriority.MEDIUM;
      case PrismaPriority.HIGH:
        return DomainPriority.HIGH;
      default:
        return DomainPriority.MEDIUM;
    }
  }

  private mapDomainPriorityToPrisma(priority: DomainPriority): PrismaPriority {
    switch (priority) {
      case DomainPriority.LOW:
        return PrismaPriority.LOW;
      case DomainPriority.MEDIUM:
        return PrismaPriority.MEDIUM;
      case DomainPriority.HIGH:
        return PrismaPriority.HIGH;
      default:
        return PrismaPriority.MEDIUM;
    }
  }

  async findById(id: number): Promise<Todo | null> {
    const todoData = await prisma.todo.findUnique({ where: { id } });
    return todoData ? this.mapPrismaTodoToDomain(todoData) : null;
  }

  async findAllByUser(
    userId: string,
    filter: TodoFilter = {}
  ): Promise<Todo[]> {
    const where: Prisma.TodoWhereInput = {
      userId,
      ...(filter.deadlineToday && {
        deadline: {
          gte: dayjs().startOf('day').toDate(),
          lte: dayjs().endOf('day').toDate(),
        },
      }),
      ...(filter.completed !== undefined && { completed: filter.completed }),
      ...(filter.priority && {
        priority: this.mapDomainPriorityToPrisma(filter.priority),
      }),
      ...(filter.deadlineBefore && {
        deadline: { lte: filter.deadlineBefore },
      }),
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

    return todoData.map((todo) => this.mapPrismaTodoToDomain(todo));
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
        priority: this.mapDomainPriorityToPrisma(todo.priority),
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
      },
    });
    return this.mapPrismaTodoToDomain(todoData);
  }

  async create(todo: Todo): Promise<Todo> {
    const todoData = await prisma.todo.create({
      data: {
        title: todo.title,
        completed: todo.completed,
        totalPomodoros: todo.totalPomodoros,
        completedPomodoros: todo.completedPomodoros,
        priority: this.mapDomainPriorityToPrisma(todo.priority),
        deadline: todo.deadline ? new Date(todo.deadline) : undefined,
        userId: todo.userId,
      },
    });
    return this.mapPrismaTodoToDomain(todoData);
  }

  async delete(id: number): Promise<void> {
    await prisma.todo.delete({ where: { id } });
  }
}