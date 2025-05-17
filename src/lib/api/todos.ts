// libtodos.ts
// import { mutate } from 'swr';
'use server'
import { api } from './client';
import { Todo } from '@/domain/todo/Todo';

// ✅ 1. 讀取 Todos
export const getTodos = async (): Promise<Todo[] | undefined> => {
  try {
    return await api.get('todos').json<Todo[]>();
  } catch (error) {
    console.error('Error fetching todos:', error);
    return undefined;
  }
};

// ✅ 2. 建立 Todo
export const createTodo = async (data: { title: string; completed: boolean }): Promise<Todo | undefined> => {
  try {
    const todo = await api.post('todos', { json: data }).json<Todo>();
    // mutate('todos');
    return todo;
  } catch (error) {
    console.error('Error creating todo:', error);
    return undefined;
  }
};

// ✅ 3. 更新 Todo
export const updateTodo = async (
  id: number,
  data: Partial<
    Pick<Todo, 'title' | 'completed' | 'totalPomodoros' | 'completedPomodoros'>
  >
): Promise<Todo | undefined> => {
  try {
    const updated = await api.patch(`todos/${id}`, { json: data }).json<Todo>();
    // mutate('todos');
    return updated;
  } catch (error) {
    console.error('Error updating todo:', error);
    return undefined;
  }
};

// ✅ 4. 刪除 Todo
export const deleteTodo = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`todos/${id}`);
    // mutate('todos');
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
    // mutate('todos');
    return true;
  } catch (error) {
    console.error('Error consuming pomodoro:', error);
    return false;
  }
};
