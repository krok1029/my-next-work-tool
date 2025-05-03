// infrastructure/di/modules/di.auth.ts
import { container } from 'tsyringe';
import { AUTH } from '@/domain/shared/DependencyInjectionTokens';
import { SupabaseAuthService } from '@/infrastructure/auth/SupabaseAuthService';

export function registerAuthModule() {
  if (!container.isRegistered(AUTH.Service)) {
    container.registerSingleton(AUTH.Service, SupabaseAuthService);
  }
}
