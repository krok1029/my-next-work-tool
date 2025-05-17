import 'server-only';

import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { TodoController } from '@/interface-adapters/controllers/TodoController';

export async function GET() {
  try {
    const todoController = container.resolve(TodoController);
    const todos = await todoController.getAll();
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error is', error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to fetch todos',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const todoController = container.resolve(TodoController);
    const body = await req.json();
    const newTodo = await todoController.create(body);

    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : 'Failed to create todo',
      },
      { status: 400 }
    );
  }
}
