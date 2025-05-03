// application/todo/GetAllTodosUseCase.ts

import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';
import { TODO } from '@/domain/shared/DependencyInjectionTokens';

@injectable()
export class GetAllTodosUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(userId: string) {
    return this.todoRepository.findAllByUser(userId, {
      deadlineToday: false,
      sortByPriority: true,
    });
  }
}
