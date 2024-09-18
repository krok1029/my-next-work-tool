// application/todo/GetAllTodosUseCase.ts
import 'reflect-metadata';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
export class GetAllTodosUseCase {
  constructor(
    @inject('TodoRepository') private todoRepository: TodoRepository
  ) {}

  async execute() {
    return this.todoRepository.findAll();
  }
}
