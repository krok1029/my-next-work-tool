import { inject, injectable } from 'tsyringe';
import { postTodoValidator } from '@/lib/validators';
import { Todo } from '@/domain/todo/Todo';
import { TODO, AUTH } from '@/domain/shared/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';
import type { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import type { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import type { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import type { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import type { DeleteTodoUseCase } from '@/application/todo/DeleteTodoUseCase';
import type { ConsumePomodoroUseCase } from '@/application/todo/ConsumePomodoroUseCase';
import { AuthenticationError, NotFoundError } from '@/domain/shared/Error';
import { ZodError } from 'zod';

@injectable()
export class TodoController {
  constructor(
    @inject(AUTH.Service) private authService: AuthService,
    @inject(TODO.CreateTodoUseCase)
    private readonly createTodoUseCase: CreateTodoUseCase,
    @inject(TODO.GetAllTodosUseCase)
    private readonly getAllTodosUseCase: GetAllTodosUseCase,
    @inject(TODO.GetTodoUseCase)
    private readonly getTodoUseCase: GetTodoUseCase,
    @inject(TODO.UpdateTodoUseCase)
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    @inject(TODO.DeleteTodoUseCase)
    private readonly deleteTodoUseCase: DeleteTodoUseCase,
    @inject(TODO.ConsumePomodoroUseCase)
    private readonly consumePomodoroUseCase: ConsumePomodoroUseCase
  ) {}

  /**
   * 驗證用戶是否已認證
   */
  private async ensureAuthenticated(): Promise<string> {
    const session = await this.authService.getSession();
    if (!session.success || !session.data) {
      throw new AuthenticationError('User not authenticated');
    }
    return session.data.userId;
  }

  /**
   * 統一的錯誤處理
   */
  private handleError(error: unknown, defaultMessage: string): never {
    if (error instanceof AuthenticationError) {
      throw error; // 重新拋出認證錯誤
    }
    if (error instanceof NotFoundError) {
      throw new Error(`NotFoundError: ${error.message}`);
    }
    if (error instanceof ZodError) {
      throw new Error(`Invalid input: ${error.message}`);
    }
    if (error instanceof Error) {
      throw new Error(`${defaultMessage}: ${error.message}`);
    }
    throw new Error(defaultMessage);
  }

  /**
   * 獲取所有 Todos
   */
  async getAll(): Promise<Todo[]> {
    try {
      const userId = await this.ensureAuthenticated();
      return await this.getAllTodosUseCase.execute(userId);
    } catch (error) {
      this.handleError(error, 'Failed to fetch todos');
    }
  }

  /**
   * 獲取單個 Todo
   * @param id - Todo 的 ID
   */
  async get(id: number): Promise<Todo> {
    try {
      await this.ensureAuthenticated();
      return await this.getTodoUseCase.execute(id);
    } catch (error) {
      this.handleError(error, 'Failed to fetch todo');
    }
  }

  /**
   * 創建新的 Todo
   * @param input - 從請求中接收的數據
   */
  async create(input: unknown): Promise<Todo> {
    try {
      const userId = await this.ensureAuthenticated();
      const { title } = postTodoValidator.parse(input);
      return await this.createTodoUseCase.execute(title, userId);
    } catch (error) {
      this.handleError(error, 'Failed to create todo');
    }
  }

  /**
   * 更新 Todo
   * @param id - Todo 的 ID
   * @param input - 從請求中接收的數據
   */
  async update(id: number, input: unknown): Promise<Todo> {
    try {
      await this.ensureAuthenticated();
      const updatedFields = postTodoValidator.parse(input);
      const todo = await this.getTodoUseCase.execute(id);
      return await this.updateTodoUseCase.execute(todo, updatedFields);
    } catch (error) {
      this.handleError(error, 'Failed to update todo');
    }
  }

  /**
   * 刪除 Todo
   * @param id - Todo 的 ID
   */
  async delete(id: number): Promise<void> {
    try {
      await this.ensureAuthenticated();
      const todo = await this.getTodoUseCase.execute(id);
      if (!todo) {
        throw new NotFoundError(`Todo with id ${id} not found`);
      }
      await this.deleteTodoUseCase.execute(id);
    } catch (error) {
      this.handleError(error, 'Failed to delete todo');
    }
  }

  /**
   * 消耗 Pomodoro
   * @param id - Todo 的 ID
   */
  async consumePomodoro(id: number): Promise<Todo> {
    try {
      await this.ensureAuthenticated();
      const todo = await this.getTodoUseCase.execute(id);
      if (!todo) {
        throw new NotFoundError(`Todo with id ${id} not found`);
      }
      await this.consumePomodoroUseCase.execute(todo);
      return await this.getTodoUseCase.execute(id);
    } catch (error) {
      this.handleError(error, 'Failed to consume pomodoro');
    }
  }
}
