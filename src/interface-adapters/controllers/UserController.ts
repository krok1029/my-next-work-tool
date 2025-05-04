import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import { USER } from '@/domain/shared/DependencyInjectionTokens';
import { AuthenticationError } from '@/domain/shared/Error';
import type { GetUserUseCase } from '@/application/user/GetUserUseCase';

@injectable()
export class UserController {
  constructor(
    @inject(USER.GetUserUseCase)
    private readonly getUserUseCase: GetUserUseCase
  ) {}
  
  async getUser() {
    const user = await this.getUserUseCase.execute();
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return user;
  }
}
