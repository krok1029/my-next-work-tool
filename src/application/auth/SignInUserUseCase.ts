import { injectable, inject } from 'tsyringe';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';
import '@/infrastructure/di/Container';

@injectable()
export class SignInUserUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute(email: string, password: string) {
    const { data, error } = await this.authService.signIn(email, password);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }
}
