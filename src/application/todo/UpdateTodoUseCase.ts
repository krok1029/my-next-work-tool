// application/todo/UpdateTodoUseCase.ts
import type { TodoRepository } from '@/domain/todo/TodoRepository';
import { injectable, inject } from 'tsyringe';

@injectable()
export class UpdateTodoUseCase {
  constructor(
    @inject('TodoRepository') private todoRepository: TodoRepository
  ) {}

  async execute(id: number, updatedFields: { title?: string; completed?: boolean }) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    if (updatedFields.title !== undefined) {
      todo.rename(updatedFields.title);
    }

    if (updatedFields.completed !== undefined) {
      updatedFields.completed ? todo.complete() : todo.markIncomplete();
    }

    await this.todoRepository.save(todo);
  }
}