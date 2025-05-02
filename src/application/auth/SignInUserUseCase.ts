import '@/infrastructure/di/Container';
import { injectable, inject } from 'tsyringe';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/domain/shared/DependencyInjectionTokens';

@injectable()
export class SignInUserUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute(email: string, password: string) {
    const { data, error } = await this.authService.signIn(email, password);
    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
      throw new Error('User ID not found after sign in.');
    }

    return data.userId;
  }
}
