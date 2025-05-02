// infrastructure/di/Container.ts

import 'reflect-metadata'; // tsyringe 需要
import { container } from 'tsyringe';
import {
  AUTH,
  TODO,
  USER,
} from '@/domain/shared/DependencyInjectionTokens';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { SupabaseAuthService } from '@/infrastructure/auth/SupabaseAuthService';
import { UserRepository } from '@/domain/user/UserRepository';
import { PrismaUserRepository } from '@/infrastructure/prisma/UserRepositoryImpl';

// 註冊 Todo
if (!container.isRegistered(TODO.Repo)) {
  container.register<TodoRepository>(TODO.Repo, {
    useClass: PrismaTodoRepository,
  });
}

// 註冊 User
if (!container.isRegistered(USER.Repo)) {
  container.register<UserRepository>(USER.Repo, {
    useClass: PrismaUserRepository,
  });
}

// 註冊 Auth
if (!container.isRegistered(AUTH.Service)) {
  container.register(AUTH.Service, { useClass: SupabaseAuthService });
}
