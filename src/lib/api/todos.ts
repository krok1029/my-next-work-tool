// lib/api/todos.ts
// import { mutate } from 'swr';
'use server';

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { api } from './client';
import { TodoController } from '@/interface-adapters/controllers/TodoController';
import { Todo } from '@/domain/todo/Todo';

// ✅ 1. 讀取 Todos
export const getTodos = async (): Promise<Todo[]> => {
  try {
    const todoController = container.resolve(TodoController);
    const todos = await todoController.getAll();
    return JSON.parse(JSON.stringify(todos));
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

// ✅ 2. 建立 Todo
export const createTodo = async (data: { title: string }): Promise<Todo> => {
  try {
    const todoController = container.resolve(TodoController);
    const todo = await todoController.create(data);

    return JSON.parse(JSON.stringify(todo));
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

// ✅ 3. 更新 Todo
export const updateTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  try {
    const todoController = container.resolve(TodoController);
    const todo = await todoController.update(id, data);

    return JSON.parse(JSON.stringify(todo));
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

// ✅ 4. 刪除 Todo
export const deleteTodo = async (id: number): Promise<boolean> => {
  try {
    const todoController = container.resolve(TodoController);
    await todoController.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting todo:', error);
    return false;
  }
};

// ✅ 5. Consume Pomodoro
export const consumePomodoro = async (id: number): Promise<boolean> => {
  try {
    await api.post(`todos/${id}/consume_pomodoro`);
    return true;
  } catch (error) {
    console.error('Error consuming pomodoro:', error);
    return false;
  }
};
