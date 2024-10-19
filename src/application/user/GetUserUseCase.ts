// src/application/user/GetUserUseCase.ts
import { injectable, inject } from 'tsyringe';
import type { UserRepository } from '@/domain/user/UserRepository';
import { User } from '@/domain/user/User';
import { AUTH } from '@/infrastructure/di/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';

@injectable()
export class GetUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
    @inject(AUTH.Service) private authService: AuthService
  ) {}

  async execute(): Promise<User> {
    const session = await this.authService.getSession();
    if (!session.success || !session.data) {
      throw new Error('User not authenticated');
    }
    const userId = session.data.userId;
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
