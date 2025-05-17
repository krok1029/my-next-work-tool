import '@/infrastructure/di/Container';
import type { AuthService } from '@/domain/auth/AuthService';
import { AUTH } from '@/domain/shared/DependencyInjectionTokens';
import { inject, injectable } from 'tsyringe';

@injectable()
export class CheckSessionUseCase {
  constructor(@inject(AUTH.Service) private authService: AuthService) {}

  async execute() {
    console.log('CheckSessionUseCase');
    return await this.authService.getSession();
  }
}
