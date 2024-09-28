import '@/infrastructure/di/Container';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CheckSessionUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute() {
    return await this.authService.getSession();
  }
}
