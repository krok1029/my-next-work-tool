'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { AuthController } from '@/interface-adapters/controllers/AuthController';

// 定義 Server Action
export async function signOut() {
  try {
    const controller = container.resolve(AuthController);

    await controller.signOut();
    return { success: true, message: 'User signOut successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
