import { useDrag, useDrop } from 'react-dnd';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ItemType = 'CARD';

interface CardProps {
  id: number;
  text: string;
  moveCard: (draggedId: number, hoveredId: number) => void;
  children?: React.ReactNode;
  className?: string;
}

const DraggableCard: React.FC<CardProps> = ({
  id,
  moveCard,
  children,
  className,
}) => {
  const [_, drag] = useDrag(() => ({
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

  return drop(
    drag(
      <div className={className}>
        <Card className={cn('p-4 m-2')}>{children}</Card>
      </div>
    )
  );
};

export default DraggableCard;
