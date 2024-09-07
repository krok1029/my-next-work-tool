'use client';

import DraggableCard from '@/components/custom/DraggableCard';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface ClientDashboardProps {
  cards: {
    id: number;
    text: string;
    className: string;
    element: JSX.Element;
  }[];
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({
  cards: initialCards,
}) => {
  const [cards, setCards] = useState(initialCards);

  const moveCard = (draggedId: number, hoveredId: number) => {
    const draggedIndex = cards.findIndex((card) => card.id === draggedId);
    const hoveredIndex = cards.findIndex((card) => card.id === hoveredId);

    if (draggedIndex < 0 || hoveredIndex < 0) return;

    const updatedCards = [...cards];
    const [draggedCard] = updatedCards.splice(draggedIndex, 1);
    updatedCards.splice(hoveredIndex, 0, draggedCard);

    setCards(updatedCards);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
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

export default ClientDashboard;
