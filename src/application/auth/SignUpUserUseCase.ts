import { injectable, inject } from 'tsyringe';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';

@injectable()
export class SignUpUserUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute(email: string, password: string) {
    // 雜湊密碼

    const { user, error } = await this.authService.signUp(email, password);

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      throw new Error('User ID not found after sign up.');
    }

    return user;
  }
}
