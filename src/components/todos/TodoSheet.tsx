'use client';
import React, { useEffect, useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Todo } from '@/domain/todo/Todo';

interface TodoSheetProps {
  selectedTodo: Todo | null;
}

const TodoSheet: React.FC<TodoSheetProps> = ({ selectedTodo }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedTodo) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selectedTodo]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent>
        <div>Edit Todo: {selectedTodo?.title}</div>
      </SheetContent>
    </Sheet>
  );
};

export default TodoSheet;
