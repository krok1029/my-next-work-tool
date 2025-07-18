import { cleanObject } from '@/lib/utils';
import { Priority } from './TodoTypes';

export interface TodoFilter {
  deadlineToday?: boolean;
  sortByPriority?: boolean;
  completed?: boolean;
  deadlineBefore?: Date;
  deadlineAfter?: Date;
  priority?: Priority;
  tag?: string; // 根據標籤過濾
  search?: string; // 根據標題模糊搜尋
}

export class Todo {
  public readonly id: number;
  public readonly userId: string;
  public title: string;
  public completed: boolean;
  public totalPomodoros: number;
  public completedPomodoros: number;
  public priority: Priority;
  public deadline: string | null;

  constructor(params: {
    id: number;
    userId: string;
    title: string;
    completed?: boolean;
    totalPomodoros?: number;
    completedPomodoros?: number;
    priority?: Priority;
    deadline?: Date | string | null;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.title = params.title;
    this.completed = params.completed ?? false;
    this.totalPomodoros = params.totalPomodoros ?? 1;
    this.completedPomodoros = params.completedPomodoros ?? 0;
    this.priority = params.priority ?? Priority.MEDIUM;
    this.deadline = params.deadline
      ? typeof params.deadline === 'string'
        ? params.deadline
        : params.deadline.toISOString()
      : null;
  }

  static createNew(
    userId: string,
    title: string,
    totalPomodoros: number = 1,
    priority: Priority = Priority.MEDIUM,
    deadline?: Date | null
  ) {
    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    return new Todo({
      id: 0,
      userId,
      title: title.trim(),
      totalPomodoros,
      priority,
      deadline: deadline ?? null,
    });
  }

  complete() {
    if (this.completed) {
      throw new Error('Todo is already completed');
    }
    this.completed = true;
  }

  consumePomodoro() {
    if (this.completedPomodoros >= this.totalPomodoros) {
      throw new Error('All pomodoros are already completed');
    }
    this.completedPomodoros++;
    if (this.completedPomodoros === this.totalPomodoros) {
      this.complete();
    }
  }

  update(fields: Partial<Omit<Todo, 'id' | 'userId'>>) {
    // ✅ userId 不能被 update
    const filteredFields = cleanObject(fields);
    Object.assign(this, filteredFields);
  }
}
