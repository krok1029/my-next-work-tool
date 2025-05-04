'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { AuthController } from '@/interface-adapters/controllers/AuthController';
import { signUpSchema } from '@/lib/validators';

// 定義 Server Action
export async function signUp(data: FormData) {
  const formValues: Record<string, string> = {
    firstName: data.get('firstName')?.toString() ?? '',
    lastName: data.get('lastName')?.toString() ?? '',
    email: data.get('email')?.toString() ?? '',
    password: data.get('password')?.toString() ?? '',
    confirmPassword: data.get('confirmPassword')?.toString() ?? '',
  };

  try {
    signUpSchema.parse(formValues);

    const controller = container.resolve(AuthController);

    await controller.signUp(data);

    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
