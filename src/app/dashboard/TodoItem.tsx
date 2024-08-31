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

  const saveTodo = async (
    updatedFields: Partial<{ title: string; completed: boolean }>
  ) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
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
    }
  };

  const handleSave = () => {
    saveTodo({
      title: editedTitle,
      completed: isCompleted,
    });
  };

  const toggleCompleted = () => {
    const newCompletedStatus = !isCompleted;
    setIsCompleted(newCompletedStatus);
    saveTodo({ completed: newCompletedStatus });
  };

  return (
    <Card className="col-span-2">
      <CardContent className="flex justify-between items-center py-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            className="w-fit"
            type="checkbox"
            checked={isCompleted}
            onChange={toggleCompleted} // 當復選框狀態改變時，立即更新資料庫
          />
          {isEditing ? (
            <Input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
              className="border border-gray-300 rounded-md"
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
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodoItem;
