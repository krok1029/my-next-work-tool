import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/domain/shared/DependencyInjectionTokens';
import { NotFoundError } from '@/domain/shared/Error';

@injectable()
export class GetTodoUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(id: number) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundError(`Todo with id ${id} not found`);
    }
    return todo;
  }
}
