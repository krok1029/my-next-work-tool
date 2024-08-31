import CountdownTimer from '@/components/custom/CountdownTimer';
import React from 'react';
import ClientDashboard from './ClientDashboard';
import Todos from './Todos';

export const defaultCards = [
  {
    id: 1,
    text: 'CountdownTimer',
    className: '',
    element: <CountdownTimer />,
  },
  { id: 2, text: 'Todos', className: 'col-span-2', element: <Todos /> },
];

export default function Dashboard() {
  return <ClientDashboard cards={defaultCards} />;
}
