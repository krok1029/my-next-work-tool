import 'reflect-metadata';
import '@/infrastructure/di/Container';
import { NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { GetUserUseCase } from '@/application/user/GetUserUseCase';

export async function GET() {
  try {
    const getUserUseCase = container.resolve(GetUserUseCase);
    const user = await getUserUseCase.execute();

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { message: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}
