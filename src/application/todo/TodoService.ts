// application/todo/TodoService.ts
import { TodoRepository } from '@/domain/todo/TodoRepository';
import { Todo } from '@/domain/todo/Todo';

export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async completeTodo(id: number) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.complete();
    await this.todoRepository.save(todo);
  }

  async renameTodo(id: number, newTitle: string) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.rename(newTitle);
    await this.todoRepository.save(todo);
  }
}
