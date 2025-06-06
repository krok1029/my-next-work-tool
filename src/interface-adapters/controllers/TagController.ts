import { inject, injectable } from 'tsyringe';
// import { postTagValidator, putTagValidator } from '@/lib/validators';
import { Tag } from '@/domain/tag/Tag';
import { TAG, AUTH } from '@/domain/shared/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';
import type { CreateTagUseCase } from '@/application/tag/CreateTagUseCase';
import type { GetAllTagUseCase } from '@/application/tag/GetAllTagUseCase';
import type { UpdateTagUseCase } from '@/application/tag/UpdateTagUseCase';
import type { GetTagUseCase } from '@/application/tag/GetTagUseCase';
import type { DeleteTagUseCase } from '@/application/tag/DeleteTagUseCase';
import { AuthenticationError, NotFoundError } from '@/domain/shared/Error';
import { ZodError } from 'zod';
import { postTagValidator, putTagValidator } from '@/lib/validators';

@injectable()
export class TagController {
  constructor(
    @inject(AUTH.Service) private authService: AuthService,
    @inject(TAG.CreateTagUseCase)
    private readonly createTagUseCase: CreateTagUseCase,
    @inject(TAG.GetAllTagUseCase)
    private readonly getAllTagsUseCase: GetAllTagUseCase,
    @inject(TAG.GetTagUseCase)
    private readonly getTagUseCase: GetTagUseCase,
    @inject(TAG.UpdateTagUseCase)
    private readonly updateTagUseCase: UpdateTagUseCase,
    @inject(TAG.DeleteTagUseCase)
    private readonly deleteTagUseCase: DeleteTagUseCase
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
   * 獲取所有 Tags
   */
  async getAll(): Promise<Tag[]> {
    try {
      await this.ensureAuthenticated();
      return await this.getAllTagsUseCase.execute();
    } catch (error) {
      this.handleError(error, 'Failed to fetch tags');
    }
  }

  /**
   * 獲取單個 Tag
   * @param id - Tag 的 ID
   */
  async get(id: number): Promise<Tag> {
    try {
      await this.ensureAuthenticated();
      return await this.getTagUseCase.execute(id);
    } catch (error) {
      this.handleError(error, 'Failed to fetch tag');
    }
  }

  /**
   * 創建新的 Tag
   * @param input - 從請求中接收的數據
   */
  async create(input: unknown): Promise<Tag> {
    try {
      await this.ensureAuthenticated();
      const payload = postTagValidator.parse(input);
      return await this.createTagUseCase.execute(payload);
    } catch (error) {
      this.handleError(error, 'Failed to create tag');
    }
  }

  /**
   * 更新 Tag
   * @param id - Tag 的 ID
   * @param input - 從請求中接收的數據
   */
  async update(id: number, input: unknown): Promise<Tag> {
    try {
      await this.ensureAuthenticated();
      const { name } = putTagValidator.parse(input);
      const tag = await this.getTagUseCase.execute(id);
      return await this.updateTagUseCase.execute(tag, name);
    } catch (error) {
      this.handleError(error, 'Failed to update tag');
    }
  }

  /**
   * 刪除 Tag
   * @param id - Tag 的 ID
   */
  async delete(id: number): Promise<void> {
    try {
      await this.ensureAuthenticated();
      const tag = await this.getTagUseCase.execute(id);
      if (!tag) {
        throw new NotFoundError(`Tag with id ${id} not found`);
      }
      await this.deleteTagUseCase.execute(id);
    } catch (error) {
      this.handleError(error, 'Failed to delete tag');
    }
  }
}
