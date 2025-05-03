import '@/infrastructure/di/Container';
import { injectable, inject } from 'tsyringe';

import { TODO } from '@/domain/shared/DependencyInjectionTokens';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo } from '@/domain/todo/Todo';

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject(TODO.Repo) private readonly todoRepository: TodoRepository
  ) {}

  async execute(title: string, userId: string): Promise<Todo> {
    const todo = Todo.createNew(userId, title);

    return await this.todoRepository.create(todo); // ✅ 正確地呼叫 create
  }
}
