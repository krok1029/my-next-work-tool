'use client';

import { useState } from 'react';
import { mutate } from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Todo } from '@/domain/todo/Todo';
import { EllipsisVertical, GripVertical } from 'lucide-react';
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

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isSaving, setIsSaving] = useState(false); // 防止重複提交的加載狀態
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
        setIsCompleted(updatedTodo.completed);
        setIsEditing(false);
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false); // 保存完成，取消加載狀態
    }
  };

  const handleSave = () => {
    if (!isSaving && editedTitle !== title) {
      saveTodo({ title: editedTitle });
    }
  };

  const deleteTodo = async () => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Todo deleted successfully');
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

  const toggleCompleted = () => {
    if (!isSaving) {
      const newCompletedStatus = !isCompleted;
      setIsCompleted(newCompletedStatus); // 本地樂觀更新狀態
      saveTodo({ completed: newCompletedStatus });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <GripVertical />
      <Card className="my-3 flex-1">
        <CardContent className="flex justify-between items-center py-4">
          <div className="flex w-full items-center space-x-2">
            {isEditing ? (
              <Input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave(); // 用戶按下回車鍵時保存編輯
                  }
                }}
                onBlur={handleSave}
                className="border border-gray-300 rounded-md"
                disabled={isSaving} // 如果正在保存，禁用操作
              />
            ) : (
              <span
                className={`grow ${isCompleted ? 'line-through' : ''}`}
                onClick={() => {
                  if (!isSaving) {
                    if (isEditing) {
                      handleSave(); // 當處於編輯模式時保存
                    } else {
                      setIsEditing(true); // 否則進入編輯模式
                    }
                  }
                }}
              >
                {editedTitle}
              </span>
            )}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                <EllipsisVertical />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleCompleted} disabled={isSaving}>
                  Completed
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
