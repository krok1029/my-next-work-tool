// infrastructure/di/Container.ts
import 'reflect-metadata'; // tsyringe 需要
import { container } from 'tsyringe';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { SignInUserUseCase } from '@/application/user/SignInUserUseCase';
import { SupabaseAuthService } from '@/infrastructure/auth/SupabaseAuthService';
import { AUTH, TODO } from '@/infrastructure/di/DependencyInjectionTokens';

console.log('Container initialized');

// 註冊 Todo
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

// 註冊 Auth
container.registerSingleton(AUTH.Service, SupabaseAuthService);
container.registerSingleton(AUTH.SignIn, SignInUserUseCase);
