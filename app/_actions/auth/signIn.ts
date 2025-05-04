'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { AuthController } from '@/interface-adapters/controllers/AuthController';
import { signInSchema } from '@/lib/validators';

// 定義 Server Action
export async function signIn(data: FormData) {
  const formValues: Record<string, string> = {
    email: data.get('email')?.toString() ?? '',
    password: data.get('password')?.toString() ?? '',
  };
  try {
    signInSchema.parse(formValues);
    const controller = container.resolve(AuthController);
    await controller.signIn(formValues.email, formValues.password);

    return { success: true, message: 'User signin successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function demoSignIn() {
  const DEMO_ACCOUNT = process.env.DEMO_ACCOUNT!;
  const DEMO_PASSWORD = process.env.DEMO_PASSWORD!;

  try {
    const controller = container.resolve(AuthController);
    await controller.signIn(DEMO_ACCOUNT, DEMO_PASSWORD);

    return { success: true, message: 'User signin successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
