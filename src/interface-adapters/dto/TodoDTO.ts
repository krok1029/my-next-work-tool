
// src/interface-adapters/dto/TodoDTO.ts
// 在接口适配层处理序列化
import { Todo } from '@/domain/todo/Todo';
import { Priority } from '@/domain/todo/TodoTypes';

export interface TodoDTO {
  id: number;
  userId: string;
  title: string;
  completed: boolean;
  totalPomodoros: number;
  completedPomodoros: number;
  priority: Priority;
  deadline: string | null;
}

export class TodoMapper {
  static toDTO(todo: Todo): TodoDTO {
    return {
      id: todo.id,
      userId: todo.userId,
      title: todo.title,
      completed: todo.completed,
      totalPomodoros: todo.totalPomodoros,
      completedPomodoros: todo.completedPomodoros,
      priority: todo.priority,
      deadline: todo.deadline
    };
  }
}