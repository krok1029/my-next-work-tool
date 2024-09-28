export interface AuthResult<T = any> {
  success: boolean;
  data?: any;
  error?: Error;
}

export interface AuthService {
  signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>>;
  signUp(
    email: string,
    password: string
  ): Promise<AuthResult<{ userId: string }>>;
  getSession(): Promise<
    AuthResult<{ userId: string; expiresAt?: Date } | null>
  >;
}
