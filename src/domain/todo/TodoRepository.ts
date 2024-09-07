import { Todo } from './Todo';

// domain/todo/TodoRepository.ts
export interface TodoRepository {
  findById(id: number): Promise<Todo | null>;
  save(todo: Todo): Promise<void>;
}
