'use client';

import { useState } from 'react';
import { Todo } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const NewTodos = () => {
  const [editedTitle, setEditedTitle] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  const saveTodo = async (
    updatedFields: Partial<{ title: string; completed: boolean }>
  ) => {
    try {
      // const response = await fetch(`/api/todos/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(updatedFields),
      // });
      // if (response.ok) {
      //   const updatedTodo = await response.json();
      //   setEditedTitle(updatedTodo.title);
      //   setIsCompleted(updatedTodo.completed);
      //   setIsEditing(false);
      // } else {
      //   console.error('Failed to update todo');
      // }
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

  return (
    <div className="flex w-full items-center space-x-2 mb-3">
      <Input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          }
        }}
        className="border rounded-md"
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          handleSave();
        }}
      >
        {'Create'}
      </Button>
    </div>
  );
};

export default NewTodos;
