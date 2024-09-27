// src/infrastructure/di/DependencyInjectionTokens.ts
export enum TODO {
  Repo = 'TodoRepository',
  Create = 'CreateTodoUseCase',
  Update = 'UpdateTodoUseCase',
  GetAll = 'GetAllTodosUseCase',
  Get = 'GetTodoUseCase',

}
export enum AUTH {
  Service = 'AuthService',
  SignIn = 'SignInUserUseCase',
  SignUp = 'SignUpUserUseCase',
}