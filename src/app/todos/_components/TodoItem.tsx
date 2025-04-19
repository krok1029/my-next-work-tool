'use client';
import { useState } from 'react';
import Link from 'next/link';
import { mutate } from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@prisma/client';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { useTodoStore } from '@/lib/zustandStore';
import { deleteTodo } from '@/lib/api/todos';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from '@/components/todos/DeleteDialog';

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { id, title, completed, totalPomodoros } = todo;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { selectedTodo, setSelectedTodo, clearSelectedTodo } = useTodoStore();
  const handleDelete = async () => {
    await deleteTodo(id);
    mutate('todos');
    clearSelectedTodo();
    setOpenDeleteDialog(false);
  };

  return (
    <div className="flex items-center gap-4">
      <Card
        className="my-3 flex-1 cursor-pointer"
        onClick={() => {
          setSelectedTodo(todo);
        }}
      >
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex w-full items-center space-x-2">
            <Link
              className="text-xs text-secondary-foreground hover:underline"
              href={`/todos/${todo.id}`}
            >{`TODO-${todo.id}`}</Link>
            <span
              className={clsx(
                'w-0 shrink grow truncate',
                completed && 'line-through'
              )}
              onClick={() => {}}
            >
              {title}
            </span>
            <Badge variant="default">{totalPomodoros}</Badge>

            <Trash2
              className="h-4 w-4 cursor-pointer text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDeleteDialog(true);
              }}
            />
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
