// infrastructure/di/Container.ts
import 'reflect-metadata'; // tsyringe 需要
import { container } from 'tsyringe';
import {
  AUTH,
  TODO,
  USER,
} from '@/infrastructure/di/DependencyInjectionTokens';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { SignInUserUseCase } from '@/application/auth/SignInUserUseCase';
import { SupabaseAuthService } from '@/infrastructure/auth/SupabaseAuthService';
import { SignUpUserUseCase } from '@/application/auth/SignUpUserUseCase';
import { UserRepository } from '@/domain/user/UserRepository';
import { PrismaUserRepository } from '@/infrastructure/prisma/UserRepositoryImpl';

// 註冊 Todo
if (!container.isRegistered(TODO.Repo)) {
  container.register<TodoRepository>(TODO.Repo, {
    useClass: PrismaTodoRepository,
  });
  container.register(TODO.Create, {
    useClass: CreateTodoUseCase,
  });
  container.register(TODO.Update, {
    useClass: UpdateTodoUseCase,
  });
  container.register(TODO.GetAll, {
    useClass: GetAllTodosUseCase,
  });
  container.register(TODO.Get, {
    useClass: GetTodoUseCase,
  });
}

if (!container.isRegistered(USER.Repo)) {
  // 註冊 User
  container.register<UserRepository>(USER.Repo, {
    useClass: PrismaUserRepository,
  });
}

if (!container.isRegistered(AUTH.Service)) {
  // 註冊 Auth
  container.register(AUTH.Service, { useClass: SupabaseAuthService });
  container.register(AUTH.SignIn, { useClass: SignInUserUseCase });
  container.register(AUTH.SignUp, { useClass: SignUpUserUseCase });
}
