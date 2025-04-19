'use client';

import { useState } from 'react';
import { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@prisma/client';
import { EllipsisVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { useTodoStore } from '@/lib/zustandStore';
import { deleteTodo } from '@/lib/api/todos';
import DeleteDialog from '@/components/todos/DeleteDialog';

const TodoItem = ({
  todo,
  setIsOpen,
}: {
  todo: Todo;
  setIsOpen: (open: boolean) => void;
}) => {
  const { id, title, completed, totalPomodoros, completedPomodoros } = todo;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { selectedTodo, setSelectedTodo, clearSelectedTodo, isInProgress } =
    useTodoStore();
  const handleDelete = async () => {
    await deleteTodo(id);
    mutate('todos');
    clearSelectedTodo();
    setOpenDeleteDialog(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Card
        className={cn(
          'my-3 flex-1',
          isInProgress ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
        onClick={() => {
          if (!isInProgress) {
            setSelectedTodo(todo);
          }
        }}
      >
        <CardContent
          className={cn(
            'flex items-center justify-between py-4',
            selectedTodo?.id === todo.id && 'bg-primary-foreground'
          )}
        >
          <div className="flex w-full items-center space-x-2">
            <span
              className={clsx(
                'w-0 shrink grow truncate',
                completed && 'line-through'
              )}
              onClick={() => {}}
            >
              {title}
            </span>

            <span className="text-nowrap">{`${completedPomodoros} / ${totalPomodoros}`}</span>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="w-full"
                  onClick={() => {
                    if (isInProgress) {
                      // go to edit page
                    } else {
                      setSelectedTodo(todo);
                      setIsOpen(true);
                    }
                  }}
                >
                  <Button
                    className="h-fit w-full justify-start p-0"
                    variant="clear"
                    size="sm"
                  >
                    Edit
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog
        todo={todo}
        open={openDeleteDialog}
        setOpen={(open) => setOpenDeleteDialog(open)}
      />
    </div>
  );
};

export default TodoItem;
