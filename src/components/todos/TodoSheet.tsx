'use client';

import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { putTodoValidator } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTodoStore } from '@/lib/zustandStore';
import EditTodoForm from '@/components/todos/EditTodoForm';

const TodoSheet: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const { selectedTodo, clearSelectedTodo } = useTodoStore();
  const form = useForm<z.infer<typeof putTodoValidator>>({
    resolver: zodResolver(putTodoValidator),
  });

  useEffect(() => {
    if (!!selectedTodo) {
      form.reset({
        ...selectedTodo,
        deadline: String(selectedTodo.deadline),
      });
    } else {
      setIsOpen(false);
      clearSelectedTodo();
    }
  }, [selectedTodo]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(false);
    if (!open) {
      clearSelectedTodo();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{selectedTodo?.title}</SheetTitle>
          <SheetDescription>
            Edit the todo with the form below.
          </SheetDescription>
        </SheetHeader>

        {selectedTodo && <EditTodoForm selectedTodo={selectedTodo} />}
      </SheetContent>
    </Sheet>
  );
};

export default TodoSheet;
