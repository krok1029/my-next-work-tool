import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { ZodError } from 'zod';
import { TodoController } from '@/interface-adapters/controllers/TodoController';

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const todoController = container.resolve(TodoController);
    await todoController.consumePomodoro(Number(id));
    const newTodo = await todoController.get(Number(id));

    return NextResponse.json(newTodo, { status: 200 });
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
