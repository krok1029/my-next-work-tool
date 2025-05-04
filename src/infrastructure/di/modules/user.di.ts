// infrastructure/di/modules/di.user.ts
import { container } from 'tsyringe';
import { USER } from '@/domain/shared/DependencyInjectionTokens';
import { UserRepository } from '@/domain/user/UserRepository';
import { PrismaUserRepository } from '@/infrastructure/prisma/UserRepositoryImpl';
import { CreateUserUseCase } from '@/application/user/CreateUserUseCase';
import { GetUserUseCase } from '@/application/user/GetUserUseCase';

export function registerUserModule() {
  if (!container.isRegistered(USER.Repo)) {
    container.registerSingleton<UserRepository>(
      USER.Repo,
      PrismaUserRepository
    );
  }
  if (!container.isRegistered(USER.CreateUserUseCase)) {
    container.registerSingleton(USER.CreateUserUseCase, CreateUserUseCase);
  }
  if (!container.isRegistered(USER.GetUserUseCase)) {
    container.registerSingleton(USER.GetUserUseCase, GetUserUseCase);
  }
}
