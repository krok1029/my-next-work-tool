// application/todo/TodoService.ts
import { TodoRepository } from '@/domain/todo/TodoRepository';

export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  async getAllTodos() {
    return this.todoRepository.findAll();
  }

  async updateTodo(
    id: number,
    updatedFields: { title?: string; completed?: boolean }
  ) {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    // 根據需要更新 title 和 completed
    if (updatedFields.title !== undefined) {
      todo.rename(updatedFields.title);
    }

    if (updatedFields.completed !== undefined) {
      if (updatedFields.completed) {
        todo.complete();
      } else {
        todo.markIncomplete();
      }
    }

    // 保存變更
    await this.todoRepository.save(todo);
  }

  async createTodo(title: string) {
    const newTodo = await this.todoRepository.create({ title });
    return newTodo;
  }
}
