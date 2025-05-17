// infrastructure/di/modules/di.auth.ts
import { container } from 'tsyringe';
import { AUTH } from '@/domain/shared/DependencyInjectionTokens';
import { SupabaseAuthService } from '@/infrastructure/auth/SupabaseAuthService';
import { CheckSessionUseCase } from '@/application/auth/CheckSessionUseCase';
import { AuthController } from '@/interface-adapters/controllers/AuthController';
import { SignInUserUseCase } from '@/application/auth/SignInUserUseCase';
import { SignOutUserUseCase } from '@/application/auth/SignOutUserUseCase';
import { SignUpUserUseCase } from '@/application/auth/SignUpUserUseCase';
import { AuthService } from '@/domain/auth/AuthService';

export function registerAuthModule() {
  if (!container.isRegistered(AUTH.Service)) {
    container.register<AuthService>(AUTH.Service, {
      useFactory: () => new SupabaseAuthService(),
    });
  }

  if (!container.isRegistered(AUTH.CheckSessionUseCase)) {
    container.registerSingleton(AUTH.CheckSessionUseCase, CheckSessionUseCase);
  }

  if (!container.isRegistered(AUTH.Controller)) {
    container.registerSingleton(AUTH.Controller, AuthController);
  }
  if (!container.isRegistered(AUTH.SignInUserUseCase)) {
    container.registerSingleton(AUTH.SignInUserUseCase, SignInUserUseCase);
  }
  if (!container.isRegistered(AUTH.SignOutUserUseCase)) {
    container.registerSingleton(AUTH.SignOutUserUseCase, SignOutUserUseCase);
  }
  if (!container.isRegistered(AUTH.SignUpUserUseCase)) {
    container.registerSingleton(AUTH.SignUpUserUseCase, SignUpUserUseCase);
  }
}
