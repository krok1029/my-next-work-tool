import 'reflect-metadata';
import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { ConsumePomodoroUseCase } from '@/application/todo/ConsumePomodoroUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { ZodError } from 'zod';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 提取已驗證的數據
    const consumePomodoroUseCase = container.resolve(ConsumePomodoroUseCase);
    await consumePomodoroUseCase.execute(Number(id));

    const getTodoUseCase = container.resolve(GetTodoUseCase);
    const updatedTodo = await getTodoUseCase.execute(Number(id));

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
