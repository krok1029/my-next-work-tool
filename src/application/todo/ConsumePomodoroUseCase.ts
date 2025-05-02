// application/todo/ConsumePomodoroUseCase.ts
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { TODO } from '@/domain/shared/DependencyInjectionTokens';
import { injectable, inject } from 'tsyringe';
import '@/infrastructure/di/Container';

@injectable()
export class ConsumePomodoroUseCase {
  constructor(@inject(TODO.Repo) private todoRepository: TodoRepository) {}

  async execute(id: number) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    todo.consumePomodoro();
    await this.todoRepository.update(todo);
  }
}
