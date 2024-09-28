// application/todo/GetAllTodosUseCase.ts
import '@/infrastructure/di/Container';
import 'reflect-metadata';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';
import { TODO } from '@/infrastructure/di/DependencyInjectionTokens';

@injectable()
export class GetAllTodosUseCase {
  constructor(
    @inject(TODO.Repo) private todoRepository: TodoRepository
  ) {}

  async execute() {
    return this.todoRepository.findAll();
  }
}
