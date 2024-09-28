import 'reflect-metadata';
import '@/infrastructure/di/Container';
import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';
import { postTodoValidator, validatePayload } from '@/lib/validators';

export async function GET() {
  try {
    const getAllTodosUseCase = container.resolve(GetAllTodosUseCase);
    const todos = await getAllTodosUseCase.execute();

    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { message: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const parsedBody = await validatePayload(postTodoValidator)(req);

    // 提取已驗證的數據
    const { title, userId } = parsedBody;

    const createTodoUseCase = container.resolve(CreateTodoUseCase);
    const newTodo = await createTodoUseCase.execute(title, userId);

    // 返回新創建的 Todo 數據
    return NextResponse.json(newTodo, { status: 201 }); // 返回 201 創建成功狀態
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
