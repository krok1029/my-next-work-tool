'use client';

import { useState } from 'react';
import { mutate } from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@/domain/todo/Todo';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import clsx from 'clsx';

const TodoItem = ({
  todo,
  setSelectedTodo,
}: {
  todo: Todo;
  setSelectedTodo: (todo: Todo) => void;
}) => {
  const { id, title, completed, totalPomodoros, completedPomodoros } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const saveTodo = async (
    updatedFields: Partial<{ title: string; completed: boolean }>
  ) => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        const updatedTodo = await response.json();
        setEditedTitle(updatedTodo.title);
        setIsEditing(false);
        mutate(`/api/todos`);
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false); // 保存完成，取消加載狀態
    }
  };

  const handleSave = async () => {
    if (!isSaving && editedTitle !== title) {
      await saveTodo({ title: editedTitle });
      mutate('/api/todos');
    }
    setIsEditing(false);
  };

  const deleteTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        mutate('/api/todos');
      } else {
        console.error('Failed to delete todo');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!isSaving) {
      await deleteTodo();
      mutate('/api/todos');
      setOpenDeleteDialog(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Card className="my-3 flex-1">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex w-full items-center space-x-2">
            {isEditing ? (
              <Input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    handleSave();
                  }
                }}
                onBlur={handleSave}
                className="rounded-md border border-gray-300"
                disabled={isSaving}
                autoFocus
              />
            ) : (
              <span
                className={clsx(
                  'w-0 shrink grow truncate',
                  completed && 'line-through'
                )}
                onClick={() => {
                  if (!isSaving) {
                    if (isEditing) {
                      handleSave();
                    } else {
                      setIsEditing(true);
                    }
                  }
                }}
              >
                {title}
              </span>
            )}

            {!isEditing && (
              <span className="text-nowrap">{`${completedPomodoros} / ${totalPomodoros}`}</span>
            )}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                {!isEditing && <EllipsisVertical />}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => setSelectedTodo(todo)}
                >
                  <Button
                    className="h-fit w-full justify-start p-0"
                    variant="clear"
                    size="sm"
                  >
                    Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenDeleteDialog(true)}
                  disabled={isSaving}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog
        name={title}
        open={openDeleteDialog}
        setOpen={(open) => setOpenDeleteDialog(open)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TodoItem;

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
