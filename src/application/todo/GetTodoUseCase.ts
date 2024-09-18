import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import type { TodoRepository } from '@/domain/todo/TodoRepository';

@injectable()
export class GetTodoUseCase {
  constructor(
    @inject('TodoRepository') private todoRepository: TodoRepository
  ) {}

  async execute(id: number) {
    return this.todoRepository.findById(id);
  }
}
