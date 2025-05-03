// application/todo/UpdateTodoUseCase.ts
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/domain/shared/DependencyInjectionTokens';
import { injectable, inject } from 'tsyringe';
import '@/infrastructure/di/Container';
import { Todo } from '@/domain/todo/Todo';

@injectable()
export class UpdateTodoUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(todo: Todo, updatedFields: Partial<Omit<Todo, 'id'>>) {
    todo.update(updatedFields);
    return await this.todoRepository.update(todo);
  }
}
