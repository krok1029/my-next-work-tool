import CountdownTimer from '@/app/dashboard/CountdownTimer';
import React from 'react';
import Todos from '@/components/todos/Todos';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

const defaultCards = [
  {
    id: 1,
    text: 'CountdownTimer',
    className: '',
    element: <CountdownTimer />,
  },
  { id: 2, text: 'Todos', className: 'col-span-2', element: <Todos /> },
];

export default function Dashboard() {
  return (
    <div className="pt-8 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {defaultCards.map((card) => (
        <div className={cn(card.className, 'h-96')}>
          <Card className={cn('h-full p-3')}>{card.element}</Card>
        </div>
      ))}
    </div>
  );
}
