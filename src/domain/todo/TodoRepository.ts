import { Todo } from './Todo';

// domain/todo/TodoRepository.ts
export interface TodoRepository {
  findById(id: number): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
  save(todo: Todo): Promise<void>;
  create(data: { title: string, userId: number }): Promise<Todo>;
}
