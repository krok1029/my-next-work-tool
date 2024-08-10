'use client';

import CountdownTimer from '@/components/custom/CountdownTimer';
import DraggableCard from '@/components/custom/DraggableCard';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface DashboardProps {}

const defaultCards = [
  {
    id: 1,
    text: 'CountdownTimer',
    className: '',
    element: <CountdownTimer />,
  },
  { id: 2, text: 'Card 2', className: '', element: 'todos' },
];

const Dashboard: React.FC<DashboardProps> = () => {
  const [cards, setCards] = useState(defaultCards);

  const moveCard = (draggedId: number, hoveredId: number) => {
    const draggedIndex = cards.findIndex((card) => card.id === draggedId);
    const hoveredIndex = cards.findIndex((card) => card.id === hoveredId);

    const updatedCards = [...cards];
    const [draggedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(hoveredIndex, 0, draggedCard);

    setCards(updatedCards);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {defaultCards.map((card) => (
          <DraggableCard
            className={card.className}
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          >
            {card.element}
          </DraggableCard>
        ))}
      </div>
    </DndProvider>
  );
};

export default Dashboard;
