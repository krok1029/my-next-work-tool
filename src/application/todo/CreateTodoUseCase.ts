import 'reflect-metadata';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject('TodoRepository') private todoRepository: TodoRepository
  ) {}

  async execute(title: string, userId: number) {
    const newTodo = await this.todoRepository.create({ title, userId });
    return newTodo;
  }
}
