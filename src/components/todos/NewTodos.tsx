'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createTodo } from '@/lib/api/todos';

const NewTodos = () => {
  const [editedTitle, setEditedTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false); // 用於防止重複提交和顯示加載狀態

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      console.error('Title cannot be empty');
      return;
    }

    setIsSaving(true); // 開始保存，設置加載狀態
    try {
      await createTodo({
        title: editedTitle,
        completed: false,
      });
      setEditedTitle(''); // 重置輸入框
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false); // 完成保存，取消加載狀態
    }
  };

  return (
    <div className="mb-3 flex w-full items-center space-x-2">
      <Input
        type="text"
        value={editedTitle}
        onChange={(e) => setEditedTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSave();
          }
        }}
        className="rounded-md border"
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
