import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { container } from 'tsyringe';
import { UpdateTodoUseCase } from '@/application/todo/UpdateTodoUseCase';
import { GetTodoUseCase } from '@/application/todo/GetTodoUseCase';

// 使用 Zod 進行數據驗證，要求至少有一個字段
const putTodoValidator = z
  .object({
    title: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .refine((data) => data.title !== undefined || data.completed !== undefined, {
    message: 'No valid fields to update', // 自定義錯誤消息
    path: [], // 將錯誤附加到整個數據體上
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 解析請求的 JSON 體
    const json = await req.json();

    // 使用 Zod 驗證請求數據
    const parsed = putTodoValidator.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues },
        { status: 400 }
      );
    }

    // 提取已驗證的數據
    const { title, completed } = parsed.data;
    const updateTodoUseCase = container.resolve(UpdateTodoUseCase);
    await updateTodoUseCase.execute(Number(id), { title, completed });

    const getTodoUseCase = container.resolve(GetTodoUseCase);
    const updatedTodo = await getTodoUseCase.execute(Number(id));

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update todo' },
      { status: 500 }
    );
  }
}
