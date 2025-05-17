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
import { TodoDTO } from '@/interface-adapters/dto/TodoDTO';
import { deleteTodo } from '@/lib/api/todos';
import { useRouter } from 'next/navigation';

const DeleteDialog = ({
  todo,
  open,
  setOpen,
}: {
  todo: TodoDTO;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteTodo(todo.id);
    router.refresh();
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
