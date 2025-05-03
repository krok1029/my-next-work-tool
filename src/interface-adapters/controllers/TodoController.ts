import { inject, injectable } from 'tsyringe';
import { postTodoValidator } from '@/lib/validators';
import { Todo } from '@/domain/todo/Todo';
import { TODO, AUTH } from '@/domain/shared/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';
import type { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import type { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';

@injectable()
export class TodoController {
  constructor(
    @inject(AUTH.Service) private authService: AuthService,
    @inject(TODO.CreateTodoUseCase)
    private readonly createTodoUseCase: CreateTodoUseCase,
    @inject(TODO.GetAllTodosUseCase)
    private readonly getAllTodosUseCase: GetAllTodosUseCase
  ) {}

  /**
   * 獲取所有 Todos
   */
  async getAll(): Promise<Todo[]> {
    try {
      const session = await this.authService.getSession();
      if (!session.success || !session.data) {
        throw new Error('User not authenticated');
      }
      const userId = session.data.userId;

      return await this.getAllTodosUseCase.execute(userId);
    } catch (error) {
      throw new Error('Failed to fetch todos');
    }
  }

  /**
   * 創建新的 Todo
   * @param input - 從請求中接收的數據
   */
  async create(input: unknown): Promise<Todo> {
    try {
      // 驗證輸入數據
      const validatedInput = postTodoValidator.parse(input);

      // 調用 Use Case 創建 Todo
      return await this.createTodoUseCase.execute(validatedInput);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create todo: ${error.message}`);
      }
      throw new Error('Failed to create todo');
    }
  }
}
