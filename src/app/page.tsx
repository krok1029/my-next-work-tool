import { redirect } from 'next/navigation';
import { container } from 'tsyringe';
import { CheckSessionUseCase } from '@/application/auth/CheckSessionUseCase';

export default async function Home() {
  const checkSessionUseCase = container.resolve(CheckSessionUseCase);
  const { success, data } = await checkSessionUseCase.execute();

  if (!success || !data) {
    // 如果沒有 session，重定向到登入頁面
    redirect('/user/signin');
    return;
  }

  // 如果有 session，重定向到 /dashboard
  redirect('/dashboard');
}
