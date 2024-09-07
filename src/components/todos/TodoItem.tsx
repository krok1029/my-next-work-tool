'use client';

import { useState } from 'react';
import { Todo } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { id, title, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isSaving, setIsSaving] = useState(false); // 防止重複提交的加載狀態

  const saveTodo = async (
    updatedFields: Partial<{ title: string; completed: boolean }>
  ) => {
    setIsSaving(true); // 開始保存，設置加載狀態
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
        console.log('Updated Todo:', updatedTodo);
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
      // 僅當 title 有更改時保存
      saveTodo({ title: editedTitle });
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
    <Card className="col-span-2">
      <CardContent className="flex justify-between items-center py-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            className="w-fit"
            type="checkbox"
            checked={isCompleted}
            onChange={toggleCompleted} // 當復選框狀態改變時，更新資料庫
            disabled={isSaving} // 如果正在保存，禁用操作
          />
          {isEditing ? (
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave(); // 用戶按下回車鍵時保存編輯
                }
              }}
              className="border border-gray-300 rounded-md"
              disabled={isSaving} // 如果正在保存，禁用操作
            />
          ) : (
            <span className={`grow ${isCompleted ? 'line-through' : ''}`}>
              {editedTitle}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isSaving) {
                if (isEditing) {
                  handleSave(); // 當處於編輯模式時保存
                } else {
                  setIsEditing(true); // 否則進入編輯模式
                }
              }
            }}
            disabled={isSaving} // 如果正在保存，禁用按鈕
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
