// src/domain/shared/DependencyInjectionTokens.ts


export const AUTH = { Service: 'AuthService' } as const;
export const TODO = {
  Repo: 'TodoRepository',
  Controller: 'TodoController',
  CreateTodoUseCase: 'CreateTodoUseCase',
  UpdateTodoUseCase: 'UpdateTodoUseCase',
  GetAllTodosUseCase: 'GetAllTodosUseCase',
  GetTodoUseCase: 'GetTodoUseCase',
  DeleteTodoUseCase: 'DeleteTodoUseCase',

} as const;
export const USER = { Repo: 'UserRepository' } as const;
