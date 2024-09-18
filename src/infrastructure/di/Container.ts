// infrastructure/di/Container.ts
import 'reflect-metadata'; // tsyringe 需要
import { container } from 'tsyringe';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { TodoRepository } from '@/domain/todo/TodoRepository';

console.log('Container initialized');
// 註冊依賴
container.register<TodoRepository>('TodoRepository', {
  useClass: PrismaTodoRepository,
});

// 如果需要註冊 Use Case，也可以這樣做
container.register('CreateTodoUseCase', {
  useClass: CreateTodoUseCase,
});
container.register('UpdateTodoUseCase', {
  useClass: UpdateTodoUseCase,
});
container.register('GetAllTodosUseCase', {
  useClass: GetAllTodosUseCase,
});
container.register('GetTodoUseCase', {
  useClass: GetTodoUseCase,
});
