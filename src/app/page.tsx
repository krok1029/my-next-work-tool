import { redirect } from 'next/navigation';
import { container } from 'tsyringe';
import { CheckSessionUseCase } from '@/application/user/CheckSessionUseCase';

export default async function Home() {
  const checkSessionUseCase = container.resolve(CheckSessionUseCase);
  const { session } = await checkSessionUseCase.execute();

  if (!session) {
    redirect('/user/signin');
  }
  redirect('/dashboard');
}
