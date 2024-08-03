'use client';
import DraggableCard from '@/components/custom/DraggableCard';
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function Home() {
  return (
    <main className="p-24">
      <Dashboard />
    </main>
  );
}

interface DashboardProps {}
const Dashboard: React.FC<DashboardProps> = () => {
  const [cards, setCards] = useState([
    { id: 1, text: 'Card 1', className: '' },
  ]);

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
      <div className="grid grid-cols-3 ">
        {cards.map((card) => (
          <DraggableCard
            className={card.className}
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
          >
            {card.text}
          </DraggableCard>
        ))}
      </div>
    </DndProvider>
  );
};
