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
   * 獲取所有 Todos
   */
  async getAll(): Promise<Todo[]> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError('User not authenticated');
      }
      const userId = session.data.userId;

      return await this.getAllTodosUseCase.execute(userId);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch todos: ${error.message}`);
      }
      // 其他錯誤處理
      throw new Error('Failed to fetch todos');
    }
  }

  /**
   * 獲取單個 Todo
   * @param id - Todo 的 ID
   */
  async get(id: number): Promise<Todo> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError('User not authenticated');
      }

      return await this.getTodoUseCase.execute(id);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof NotFoundError) {
        throw new Error(`NotFoundError: ${error.message}`);
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch todo: ${error.message}`);
      }
      // 其他錯誤處理
      throw new Error('Failed to fetch todo');
    }
  }

  /**
   * 創建新的 Todo
   * @param input - 從請求中接收的數據
   */
  async create(input: unknown): Promise<Todo> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError();
      }
      const userId = session.data.userId;

      // 驗證輸入數據
      const { title } = postTodoValidator.parse(input);

      // 調用 Use Case 創建 Todo
      return await this.createTodoUseCase.execute(title, userId);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof ZodError) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      // 其他錯誤處理
      if (error instanceof Error) {
        throw new Error(`Failed to create todo: ${error.message}`);
      }
      throw new Error('Failed to create todo');
    }
  }
  /**
   * 更新 Todo
   * @param id - Todo 的 ID
   * @param input - 從請求中接收的數據
   */
  async update(id: number, input: unknown): Promise<Todo> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError('User not authenticated');
      }

      // 驗證輸入數據
      const updatedFields = postTodoValidator.parse(input);
      const todo = await this.getTodoUseCase.execute(id);
      // 調用 Use Case 更新 Todo
      return await this.updateTodoUseCase.execute(todo, updatedFields);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof NotFoundError) {
        throw new Error(`NotFoundError: ${error.message}`);
      }
      if (error instanceof ZodError) {
        throw new Error(`Invalid input: ${error.message}`);
      }
      // 其他錯誤處理
      if (error instanceof Error) {
        throw new Error(`Failed to update todo: ${error.message}`);
      }
      throw new Error('Failed to update todo');
    }
  }

  /**
   * 刪除 Todo
   * @param id - Todo 的 ID
   */
  async delete(id: number): Promise<void> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError('User not authenticated');
      }

      // 先獲取 Todo 以確認它存在
      const todo = await this.getTodoUseCase.execute(id);
      if (!todo) {
        throw new NotFoundError(`Todo with id ${id} not found`);
      }

      // 調用 Use Case 刪除 Todo
      await this.deleteTodoUseCase.execute(id);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof NotFoundError) {
        throw new Error(`NotFoundError: ${error.message}`);
      }
      // 其他錯誤處理
      if (error instanceof Error) {
        throw new Error(`Failed to delete todo: ${error.message}`);
      }
      throw new Error('Failed to delete todo');
    }
  }
  /**
   * 消耗 Pomodoro
   * @param id - Todo 的 ID
   */
  async consumePomodoro(id: number): Promise<Todo> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new AuthenticationError('User not authenticated');
      }

      // 先獲取 Todo 以確認它存在
      const todo = await this.getTodoUseCase.execute(id);
      if (!todo) {
        throw new NotFoundError(`Todo with id ${id} not found`);
      }
      // 調用 Use Case 消耗 Pomodoro
      await this.consumePomodoroUseCase.execute(todo);

      // 獲取更新後的 Todo
      return await this.getTodoUseCase.execute(id);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error; // 重新拋出認證錯誤
      }
      if (error instanceof NotFoundError) {
        throw new Error(`NotFoundError: ${error.message}`);
      }
      // 其他錯誤處理
      if (error instanceof Error) {
        throw new Error(`Failed to consume pomodoro: ${error.message}`);
      }
      throw new Error('Failed to consume pomodoro');
    }
  }
}
