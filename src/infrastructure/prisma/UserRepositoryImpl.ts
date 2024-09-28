// infrastructure/prisma/UserRepositoryImpl.ts
import prisma from './PrismaClient';
import { UserRepository } from '@/domain/user/UserRepository';
import { User } from '@/domain/user/User';
import { injectable } from 'tsyringe';

@injectable()
export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.name,
      user.workDuration,
      user.breakDuration
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(
      user.id,
      user.email,
      user.name,
      user.workDuration,
      user.breakDuration
    );
  }

  async save(user: User): Promise<void> {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        name: user.name,
        workDuration: user.workDuration,
        breakDuration: user.breakDuration,
      },
    });
  }

  async create(data: {
    id: string;
    email: string;
    name: string;
    workDuration?: number;
    breakDuration?: number;
  }): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        workDuration: data.workDuration ?? 25,
        breakDuration: data.breakDuration ?? 5,
      },
    });
    return new User(
      newUser.id,
      newUser.email,
      newUser.name,
      newUser.workDuration,
      newUser.breakDuration
    );
  }
}
