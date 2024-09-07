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
    console.log("complete todo", todo)
    todo.complete();
    await this.todoRepository.save(todo);
  }

  async markTodoIncomplete(id: number) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.markIncomplete();  // 取消完成
    await this.todoRepository.save(todo);
  }

  async renameTodo(id: number, newTitle: string) {
    const todo = await this.todoRepository.findById(id);
    console.log("todo", todo)
    if (!todo) {
      throw new Error('Todo not found');
    }
    todo.rename(newTitle);
    await this.todoRepository.save(todo);
  }
}
