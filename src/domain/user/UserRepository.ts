// src/domain/user/UserRepository.ts
import { User } from './User';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
  create(data: {
    id: string;
    email: string;
    name: string;
    workDuration?: number;
    breakDuration?: number;
  }): Promise<User>;
}
