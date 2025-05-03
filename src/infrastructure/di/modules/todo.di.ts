// infrastructure/di/modules/di.todo.ts
import { container } from 'tsyringe';
import { TODO } from '@/domain/shared/DependencyInjectionTokens';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { TodoController } from '@/interface-adapters/controllers/TodoController';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '@/application/todo/DeleteTodoUseCase';

export function registerTodoModule() {
  if (!container.isRegistered(TODO.Repo)) {
    container.registerSingleton<TodoRepository>(TODO.Repo, PrismaTodoRepository);
  }

  if (!container.isRegistered(TODO.Controller)) {
    container.registerSingleton<TodoController>(TODO.Controller, TodoController);
  }

  if (!container.isRegistered(TODO.CreateTodoUseCase)) {
    container.registerSingleton(TODO.CreateTodoUseCase, CreateTodoUseCase);
  }

  if (!container.isRegistered(TODO.GetAllTodosUseCase)) {
    container.registerSingleton(TODO.GetAllTodosUseCase, GetAllTodosUseCase);
  }

  if (!container.isRegistered(TODO.GetTodoUseCase)) {
    container.registerSingleton(TODO.GetTodoUseCase, GetTodoUseCase);
  }

  if (!container.isRegistered(TODO.UpdateTodoUseCase)) {
    container.registerSingleton(TODO.UpdateTodoUseCase, UpdateTodoUseCase);
  }

  if (!container.isRegistered(TODO.DeleteTodoUseCase)) {
    container.registerSingleton(TODO.DeleteTodoUseCase, DeleteTodoUseCase);
  }
}
