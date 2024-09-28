import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/infrastructure/di/DependencyInjectionTokens';
import '@/infrastructure/di/Container';

@injectable()
export class GetTodoUseCase {
  constructor(
    @inject(TODO.Repo) private todoRepository: TodoRepository
  ) {}

  async execute(id: number) {
    return this.todoRepository.findById(id);
  }
}
