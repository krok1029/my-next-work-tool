import '@/infrastructure/di/Container';
import { injectable, inject } from 'tsyringe';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';

@injectable()
export class SignOutUserUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute() {
    const { success, error } = await this.authService.signOut();

    if (error) {
      throw new Error(error.message);
    }

    if (!success) {
      throw new Error('Sign out failed.');
    }

    return;
  }
}
