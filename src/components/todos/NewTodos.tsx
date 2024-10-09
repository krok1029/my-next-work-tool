'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const NewTodos = ({ onTodoCreated }: { onTodoCreated: () => void }) => {
  const [editedTitle, setEditedTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false); // 用於防止重複提交和顯示加載狀態

  const saveTodo = async (
    updatedFields: Partial<{
      title: string;
      completed: boolean;
    }>
  ) => {
    setIsSaving(true); // 開始保存，設置加載狀態
    try {
      const response = await fetch(`/api/todos`, {
        method: 'POST', // POST 用於創建新資源
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        const newTodo = await response.json();
        console.log('New Todo created:', newTodo);
        setEditedTitle(''); // 重置輸入框
        onTodoCreated();
      } else {
        console.error('Failed to create todo');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false); // 完成保存，取消加載狀態
    }
  };

  const handleSave = () => {
    if (!editedTitle.trim()) {
      console.error('Title cannot be empty');
      return;
    }
    saveTodo({
      title: editedTitle,
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
        disabled={isSaving} // 當正在保存時禁用輸入
      />
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isSaving} // 當正在保存時禁用按鈕
      >
        {isSaving ? 'Creating...' : 'Create'}
      </Button>
    </div>
  );
};

export default NewTodos;
