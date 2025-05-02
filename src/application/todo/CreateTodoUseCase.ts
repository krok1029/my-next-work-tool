import '@/infrastructure/di/Container';
import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import { TODO, AUTH } from '@/infrastructure/di/DependencyInjectionTokens';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import type { AuthService } from '@/domain/auth/AuthService';
import { Todo } from '@/domain/todo/Todo'; // ✅ 加上 Todo import

export interface CreateTodoInput {
  title: string;
}

export class AuthenticationError extends Error {
  constructor(message = 'User not authenticated') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject(TODO.Repo) private readonly todoRepository: TodoRepository,
    @inject(AUTH.Service) private readonly authService: AuthService
  ) {}

  async execute(input: CreateTodoInput) {
    const session = await this.authService.getSession();
    if (!session.success || !session.data) {
      throw new AuthenticationError();
    }
    const userId = session.data.userId;

    const todo = Todo.createNew(userId, input.title);

    return await this.todoRepository.create(todo); // ✅ 正確地呼叫 create
  }
}
