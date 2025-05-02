import React from 'react';
import { redirect } from 'next/navigation';
import { container } from 'tsyringe';
import { cn } from '@/lib/utils';
import { CheckSessionUseCase } from '@/application/auth/CheckSessionUseCase';
import Todos from '@/components/todos/Todos';
import { Card } from '@/components/ui/card';
import CountdownTimer from './dashboard/CountdownTimer';

const defaultCards = [
  {
    id: 1,
    text: 'CountdownTimer',
    className: '',
    element: <CountdownTimer />,
  },
  { id: 2, text: 'Todos', className: 'col-span-2', element: <Todos /> },
];

export default async function Home() {
  const checkSessionUseCase = container.resolve(CheckSessionUseCase);
  const { success, data } = await checkSessionUseCase.execute();

  if (!success || !data) {
    // 如果沒有 session，重定向到登入頁面
    redirect('/user/signin');
  }

  return (
    <div className="grid grid-cols-1 gap-2 pt-8 md:grid-cols-2 lg:grid-cols-3">
      {defaultCards.map((card) => (
        <div className={cn(card.className, 'h-96')}>
          <Card className={cn('h-full p-3')}>{card.element}</Card>
        </div>
      ))}
    </div>
  );
}
