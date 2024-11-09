import { Todo, TodoFilter } from './Todo';

// domain/todo/TodoRepository.ts
export interface TodoRepository {
  findById(id: number): Promise<Todo | null>;
  findAllByUser(userId: string, filter?: TodoFilter): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  create(data: { title: string; userId: string }): Promise<Todo>;
  delete(id: number): Promise<void>;
}
