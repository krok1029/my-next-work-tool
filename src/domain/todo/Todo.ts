export class Todo {
  constructor(
    public readonly id: number,
    public title: string,
    public completed: boolean
  ) {}

  complete() {
    if (this.completed) {
      throw new Error('Todo is already completed');
    }
    this.completed = true;
  }

  rename(newTitle: string) {
    if (!newTitle.trim()) {
      throw new Error('Title cannot be empty');
    }
    this.title = newTitle;
  }
}