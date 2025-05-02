import { Todo, TodoFilter } from './Todo';

// domain/todo/TodoRepository.ts
export interface TodoRepository {
  findById(id: number): Promise<Todo | null>;
  findAllByUser(userId: string, filter?: TodoFilter): Promise<Todo[]>;
  create(todo: Todo): Promise<Todo>; // 明確是新建
  update(todo: Todo): Promise<Todo>; // 明確是更新
  delete(id: number): Promise<void>;
}
