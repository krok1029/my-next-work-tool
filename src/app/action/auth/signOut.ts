'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { SignOutUserUseCase } from '@/application/auth/SignOutUserUseCase';

// 定義 Server Action
export async function signOut() {
  try {
    const signOutUserUseCase = container.resolve(SignOutUserUseCase);

    const res = await signOutUserUseCase.execute();
    return { success: true, message: 'User signOut successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
