import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/infrastructure/di/DependencyInjectionTokens';

@injectable()
export class DeleteTodoUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(id: number) {
    return this.todoRepository.delete(id);
  }
}
