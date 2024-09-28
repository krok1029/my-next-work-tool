// src/application/user/CreateUserUseCase.ts
import { injectable, inject } from 'tsyringe';
import type { UserRepository } from '@/domain/user/UserRepository';
import { User } from '@/domain/user/User';

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository
  ) {}

  async execute(data: {
    userId: string;
    email: string;
    name: string;
  }): Promise<User> {
    // 在資料庫中創建新的用戶
    const newUser = await this.userRepository.create({
      id: data.userId,
      email: data.email,
      name: data.name,
      workDuration: 25, // 默認番茄鐘工作時間
      breakDuration: 5, // 默認番茄鐘休息時間
    });

    return newUser;
  }
}
