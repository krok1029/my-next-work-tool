import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import React from 'react';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';
import Todos from '@/components/todos/Todos';
import { Card } from '@/components/ui/card';
import CountdownTimer from './dashboard/CountdownTimer';
import { AuthController } from '@/interface-adapters/controllers/AuthController';
import { AuthenticationError } from '@/domain/shared/Error';

const defaultCards = [
  // {
  //   id: 1,
  //   text: 'CountdownTimer',
  //   className: '',
  //   element: <CountdownTimer />,
  // },
  { id: 2, text: 'Todos', className: 'col-span-2', element: <Todos /> },
];

export default async function Home() {
  try {
    const controller = container.resolve(AuthController);
    await controller.checkSession();

    return (
      <div className="grid grid-cols-1 gap-2 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {defaultCards.map((card) => (
          <div key={card.id} className={cn(card.className, 'h-96')}>
            <Card className={cn('h-full p-3')}>{card.element}</Card>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect('user/signin');
    }
  }
}
