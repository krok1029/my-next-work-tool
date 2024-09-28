import { injectable, inject } from 'tsyringe';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';
import '@/infrastructure/di/Container';

@injectable()
export class SignUpUserUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute(email: string, password: string) {
    const { data, error } = await this.authService.signUp(email, password);

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('User ID not found after sign up.');
    }

    return data.user;
  }
}
