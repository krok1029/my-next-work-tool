import 'reflect-metadata';
import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';
import { DeleteTodoUseCase } from '@/application/todo/DeleteTodoUseCase';
import { putTodoValidator, validatePayload } from '@/lib/validators';
import { ZodError } from 'zod';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const parsedBody = await validatePayload(putTodoValidator)(req);

    // 提取已驗證的數據
    const updateTodoUseCase = container.resolve(UpdateTodoUseCase);
    await updateTodoUseCase.execute(Number(id), parsedBody);

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // 提取已驗證的數據
    const deleteTodoUseCase = container.resolve(DeleteTodoUseCase);
    await deleteTodoUseCase.execute(Number(id));

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
