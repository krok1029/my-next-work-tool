// application/todo/GetAllTodosUseCase.ts
import 'reflect-metadata';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';
import { TODO } from '@/infrastructure/di/DependencyInjectionTokens';
import '@/infrastructure/di/Container';

@injectable()
export class GetAllTodosUseCase {
  constructor(
    @inject(TODO.Repo) private todoRepository: TodoRepository
  ) {}

  async execute() {
    return this.todoRepository.findAll();
  }
}
