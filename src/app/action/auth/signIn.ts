'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { SignInUserUseCase } from '@/application/auth/SignInUserUseCase';
import { signInSchema } from '@/lib/validators';

// 定義 Server Action
export async function signIn(data: FormData) {
  const formValues: Record<string, string> = {
    email: data.get('email')?.toString() ?? '',
    password: data.get('password')?.toString() ?? '',
  };
  try {
    signInSchema.parse(formValues);

    const signInUserUseCase = container.resolve(SignInUserUseCase);

    const res = await signInUserUseCase.execute(
      formValues.email,
      formValues.password
    );
    return { success: true, message: 'User signin successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
