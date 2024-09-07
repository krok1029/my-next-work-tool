import { NextRequest, NextResponse } from 'next/server';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoService } from '@/application/todo/TodoService';
import { z } from 'zod';

const todoValidator = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const json = await req.json();

  const parsed = todoValidator.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues }, { status: 400 });
  }

  const todoRepository = new PrismaTodoRepository();
  const todoService = new TodoService(todoRepository);

  try {
    const { title, completed } = parsed.data;

    if (completed !== undefined) {
      await todoService.completeTodo(Number(id));
    }

    if (title) {
      await todoService.renameTodo(Number(id), title);
    }

    return NextResponse.json(
      { message: 'Todo updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update todo' },
      { status: 500 }
    );
  }
}
