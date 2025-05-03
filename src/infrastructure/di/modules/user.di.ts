// infrastructure/di/modules/di.user.ts
import { container } from 'tsyringe';
import { USER } from '@/domain/shared/DependencyInjectionTokens';
import { UserRepository } from '@/domain/user/UserRepository';
import { PrismaUserRepository } from '@/infrastructure/prisma/UserRepositoryImpl';

export function registerUserModule() {
  if (!container.isRegistered(USER.Repo)) {
    container.registerSingleton<UserRepository>(USER.Repo, PrismaUserRepository);
  }
}
