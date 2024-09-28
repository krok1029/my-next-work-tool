// src/domain/auth/AuthService.ts
export interface AuthService {
  signIn(
    email: string,
    password: string
  ): Promise<{ user: string; error: null } | { user: null; error: any }>;
  signUp(
    email: string,
    password: string
  ): Promise<{ user: string; error: null } | { user: null; error: any }>;
  getSession(): Promise<{ session: { user: string; expiresAt?: Date } | null }>;
}
