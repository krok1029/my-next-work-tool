import '@/infrastructure/di/Container';
import 'reflect-metadata';
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';
import { AUTH, TODO } from '@/infrastructure/di/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';

@injectable()
export class CreateTodoUseCase {
  constructor(
    @inject(TODO.Repo) private todoRepository: TodoRepository,
    @inject(AUTH.Service) private authService: AuthService
  ) {}

  async execute(title: string) {
    const session = await this.authService.getSession();
    if (!session.success || !session.data) {
      throw new Error('User not authenticated');
    }
    const userId = session.data.userId;
    const newTodo = await this.todoRepository.create({ title, userId });
    return newTodo;
  }
}
