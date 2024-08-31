import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { cleanObject } from '@/lib/utils';

const prisma = new PrismaClient();

const todoValidator = z.object({
  title: z.string().optional(),
  completed: z.boolean().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const json = await req.json();
    const parsed = todoValidator.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues },
        { status: 400 }
      );
    }
    const cleanedData = cleanObject(parsed.data);

    const updatedTodo = await prisma.todo.update({
      where: { id: Number(id) },
      data: cleanedData,
    });

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error('Failed to update todo:', error);
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
