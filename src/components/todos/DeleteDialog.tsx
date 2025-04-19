'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { deleteTodo } from '@/lib/api/todos';
import { mutate } from 'swr';
import { Todo } from '@prisma/client';

const DeleteDialog = ({
  todo,
  open,
  setOpen,
}: {
  todo: Todo;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const handleDelete = async () => {
    await deleteTodo(todo.id);
    mutate('todos');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure to delete <strong>{todo.title}</strong> ?
        </DialogDescription>
        <DialogFooter>
          <Button type="button" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDialog;
