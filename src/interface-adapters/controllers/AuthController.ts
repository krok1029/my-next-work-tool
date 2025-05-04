import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import { AUTH, USER } from '@/domain/shared/DependencyInjectionTokens';
import type { AuthService } from '@/domain/auth/AuthService';
import type { CheckSessionUseCase } from '@/application/auth/CheckSessionUseCase';
import { AuthenticationError } from '@/domain/shared/Error';
import { SignInUserUseCase } from '@/application/auth/SignInUserUseCase';
import { SignOutUserUseCase } from '@/application/auth/SignOutUserUseCase';
import { SignUpUserUseCase } from '@/application/auth/SignUpUserUseCase';
import { signUpSchema } from '@/lib/validators';
import { CreateUserUseCase } from '@/application/user/CreateUserUseCase';

@injectable()
export class AuthController {
  constructor(
    @inject(AUTH.Service) private readonly authService: AuthService,
    @inject(AUTH.CheckSessionUseCase)
    private readonly checkSessionUseCase: CheckSessionUseCase,
    @inject(AUTH.SignInUserUseCase)
    private readonly signInUserUseCase: SignInUserUseCase,
    @inject(AUTH.SignOutUserUseCase)
    private readonly signOutUserUseCase: SignOutUserUseCase,
    @inject(AUTH.SignUpUserUseCase)
    private readonly signUpUserUseCase: SignUpUserUseCase,
    @inject(USER.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase
  ) {}

  async checkSession() {
    const session = await this.checkSessionUseCase.execute();
    if (!session.success || !session.data) {
      throw new AuthenticationError('User not authenticated');
    }
    return session.data;
  }

  async signIn(email: string, password: string) {
    const userId = await this.signInUserUseCase.execute(email, password);
    if (!userId) {
      throw new AuthenticationError('Invalid credentials');
    }
    return userId;
  }

  async signOut() {
    return await this.signOutUserUseCase.execute();
  }

  async signUp(data: FormData) {
    const formValues: Record<string, string> = {
      firstName: data.get('firstName')?.toString() ?? '',
      lastName: data.get('lastName')?.toString() ?? '',
      email: data.get('email')?.toString() ?? '',
      password: data.get('password')?.toString() ?? '',
      confirmPassword: data.get('confirmPassword')?.toString() ?? '',
    };

    signUpSchema.parse(formValues);

    const userId = await this.signUpUserUseCase.execute(
      formValues.email,
      formValues.password
    );

    if (!userId) {
      throw new AuthenticationError('Sign up failed');
    }

    await this.createUserUseCase.execute({
      userId,
      email: formValues.email,
      name: `${formValues.firstName} ${formValues.lastName}`,
    });

    return userId;
  }
}
