import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { container } from 'tsyringe';
import { CreateTodoUseCase } from '@/application/todo/CreateTodoUseCase';
import { GetAllTodosUseCase } from '@/application/todo/GetAllTodosUseCase';

// 使用 Zod 進行數據驗證，確保 title 和 completed 是有效的
const postTodoValidator = z.object({
  title: z.string().min(1, { message: "Title can't be empty" }), // title 是必填且不能為空
  userId: z.number(),
  completed: z.boolean().optional(), // completed 是可選的
});

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
    // 解析請求的 JSON 體
    const json = await req.json();

    // 使用 Zod 驗證請求數據
    const parsed = postTodoValidator.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues },
        { status: 400 }
      );
    }

    // 提取已驗證的數據
    const { title, userId } = parsed.data;

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
