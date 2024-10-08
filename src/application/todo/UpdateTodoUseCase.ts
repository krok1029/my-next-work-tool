// application/todo/UpdateTodoUseCase.ts
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/infrastructure/di/DependencyInjectionTokens';
import { injectable, inject } from 'tsyringe';
import '@/infrastructure/di/Container';

@injectable()
export class UpdateTodoUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(
    id: number,
    updatedFields: { title?: string; completed?: boolean }
  ) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (updatedFields.title !== undefined) {
      todo.rename(updatedFields.title);
    }

    if (updatedFields.completed !== undefined) {
      updatedFields.completed ? todo.complete() : todo.markIncomplete();
    }

    await this.todoRepository.save(todo);
  }
}
