import 'server-only';

import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { DeleteTodoUseCase } from '@/application/todo/DeleteTodoUseCase';
import { ZodError } from 'zod';
import { TodoController } from '@/interface-adapters/controllers/TodoController';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const todoController = container.resolve(TodoController);
    const todo = await todoController.get(Number(id));

    return NextResponse.json(todo, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const todoController = container.resolve(TodoController);
    const body = await req.json();
    const newTodo = await todoController.update(Number(id), body);

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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const todoController = container.resolve(TodoController);
    await todoController.delete(Number(id));

    return NextResponse.json({ status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : error },
      { status: 500 }
    );
  }
}
