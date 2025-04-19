import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';


const DeleteDialog = ({
  name,
  open,
  setOpen,
  onDelete,
}: {
  name: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onDelete: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Todo</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure to delete <strong>{name}</strong> ?
        </DialogDescription>
        <DialogFooter>
          <Button type="button" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteDialog;