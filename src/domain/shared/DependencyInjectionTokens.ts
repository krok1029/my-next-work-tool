// src/domain/shared/DependencyInjectionTokens.ts

import { Search } from "lucide-react";

export const AUTH = {
  Service: 'AuthService',
  Controller: 'AuthController',
  CheckSessionUseCase: 'CheckSessionUseCase',
  SignInUserUseCase: 'SignInUserUseCase',
  SignOutUserUseCase: 'SignOutUserUseCase',
  SignUpUserUseCase: 'SignUpUserUseCase',
} as const;
export const TODO = {
  Repo: 'TodoRepository',
  Controller: 'TodoController',
  CreateTodoUseCase: 'CreateTodoUseCase',
  UpdateTodoUseCase: 'UpdateTodoUseCase',
  GetAllTodosUseCase: 'GetAllTodosUseCase',
  GetTodoUseCase: 'GetTodoUseCase',
  DeleteTodoUseCase: 'DeleteTodoUseCase',
  ConsumePomodoroUseCase: 'ConsumePomodoroUseCase',
} as const;
export const USER = {
  Repo: 'UserRepository',
  CreateUserUseCase: 'CreateUserUseCase',
  GetUserUseCase: 'GetUserUseCase',
} as const;

export const TAG = {
  Repo: 'TagRepository',
  CreateTagUseCase: 'CreateTagUseCase',
  GetTagUseCase: 'GetTagUseCase',
  UpdateTagUseCase: 'UpdateTagUseCase',
  DeleteTagUseCase: 'DeleteTagUseCase',
  GetAllTagUseCase: 'GetAllTagUseCase',
  SearchTagsUseCase: 'SearchTagsUseCase',
  Controller: 'TagController'
}
