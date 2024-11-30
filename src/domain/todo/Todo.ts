import { Todo as PrismaTodo, Priority } from '@prisma/client';

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
  public title: string;
  public completed: boolean;
  public totalPomodoros: number;
  public completedPomodoros: number;
  public priority: Priority;
  public deadline: Date;

  constructor({
    id,
    title,
    completed,
    totalPomodoros,
    completedPomodoros,
    priority,
    deadline,
  }: PrismaTodo) {
    this;
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.totalPomodoros = totalPomodoros;
    this.completedPomodoros = completedPomodoros;
    this.priority = priority;
    this.deadline = deadline;
  }

  complete() {
    if (this.completed) {
      throw new Error('Todo is already completed');
    }
    this.completed = true;
  }

  markIncomplete() {
    if (!this.completed) {
      throw new Error('Todo is not completed yet');
    }
    this.completed = false;
  }

  rename(newTitle: string) {
    if (!newTitle.trim()) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle;
  }

  consumePomodoro() {
    if (this.completedPomodoros >= this.totalPomodoros) {
      throw new Error('Todo is already completed');
    }
    this.completedPomodoros++;
    if (this.completedPomodoros === this.totalPomodoros) {
      this.complete();
    }
  }
}
