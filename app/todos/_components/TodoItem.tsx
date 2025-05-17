'use client';
import { useState } from 'react';
import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import clsx from 'clsx';
import { Badge } from '@/components/ui/badge';
import DeleteDialog from '@/components/todos/DeleteDialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { updateTodo } from '@/lib/api/todos';
import { useRouter } from 'next/navigation';
import { TodoDTO } from '@/interface-adapters/dto/TodoDTO';

const TodoItem = ({ todo }: { todo: TodoDTO }) => {
  const { id, title, completed, totalPomodoros } = todo;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editTotalPomodoros, setEditTotalPomodoros] = useState(false);
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <Card className="my-3 flex-1">
        <CardContent className="items-center justify-between space-y-2 py-4">
          <Badge>Tag</Badge>
          <div className="flex w-full items-center space-x-2">
            <Link
              className={cn(
                'text-nowrap text-xs text-gray-400 hover:underline',
                editingTitle && 'hidden'
              )}
              href={`/todos/${todo.id}`}
            >{`TODO-${todo.id}`}</Link>
            {editingTitle ? (
              <>
                <Input
                  id="title"
                  autoFocus
                  type="text"
                  defaultValue={title}
                  className="w-full border-b-2 border-gray-300 focus:outline-none"
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingTitle(false);
                      updateTodo(id, { title: e.currentTarget.value });
                      router.refresh();
                    }
                  }}
                />
              </>
            ) : (
              <span
                className={clsx(
                  'w-0 shrink grow truncate text-lg',
                  completed && 'line-through'
                )}
                onClick={() => setEditingTitle(true)}
              >
                {title}
              </span>
            )}

            {editTotalPomodoros ? (
              <Input
                id="totalPomodoros"
                type="number"
                autoFocus
                defaultValue={totalPomodoros}
                className="w-16 border-b-2 border-gray-300 focus:outline-none"
                onBlur={() => setEditTotalPomodoros(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setEditTotalPomodoros(false);
                    updateTodo(id, {
                      totalPomodoros: Number(e.currentTarget.value),
                    });
                    router.refresh();
                  }
                }}
              />
            ) : (
              <Badge
                variant="outline"
                onClick={() => setEditTotalPomodoros(true)}
              >
                {totalPomodoros}
              </Badge>
            )}
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
        todo={todo}
        open={openDeleteDialog}
        setOpen={(open) => setOpenDeleteDialog(open)}
      />
    </div>
  );
};

export default TodoItem;
