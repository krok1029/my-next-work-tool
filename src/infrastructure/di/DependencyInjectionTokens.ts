// src/infrastructure/di/DependencyInjectionTokens.ts
export enum TODO {
  Repo = 'TodoRepository',
  Create = 'CreateTodoUseCase',
  Update = 'UpdateTodoUseCase',
  GetAll = 'GetAllTodosUseCase',
  Get = 'GetTodoUseCase',
  CompletedPomodoros = "CompletedPomodoros"
}
export enum AUTH {
  Service = 'AuthService',
  SignIn = 'SignInUserUseCase',
  SignUp = 'SignUpUserUseCase',
}
export enum USER {
  Repo = 'UserRepository',
}
