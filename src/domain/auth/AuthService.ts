// src/domain/auth/AuthService.ts
export interface AuthService {
  signIn(email: string, password: string): Promise<{ user: any, error: any }>;
  signUp(email: string, password: string): Promise<{ user: any, error: any }>;
}