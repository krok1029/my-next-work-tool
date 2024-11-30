import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { GripVertical } from 'lucide-react';

const ItemType = 'CARD';

interface CardProps {
  id: number;
  text: string;
  moveCard: (draggedId: number, hoveredId: number) => void;
  children?: React.ReactNode;
  className?: string;
}

const DraggableCard: React.FC<CardProps> = React.memo(
  ({ id, moveCard, children, className }) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
      type: ItemType,
      item: { id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }));

    const [, drop] = useDrop({
      accept: ItemType,
      hover: (item: { id: number }) => {
        if (item.id !== id) {
          moveCard(item.id, id);
        }
      },
    });

    drag(drop(ref));

    return (
      <div className={cn(className, isDragging ? 'opacity-50' : '')}>
        <Card className={cn('m-2 p-4')}>
          <div ref={ref} className="w-1/2 cursor-move">
            <GripVertical />
          </div>
          {children}
        </Card>
      </div>
    );
  }
);

DraggableCard.displayName = 'DraggableCard';

export default DraggableCard;
