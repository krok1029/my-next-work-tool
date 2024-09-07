import { NextRequest, NextResponse } from 'next/server';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoService } from '@/application/todo/TodoService';
import { z } from 'zod';

// 使用 Zod 進行數據驗證
const todoValidator = z.object({
  title: z.string().optional(), // title 是可選的
  completed: z.boolean().optional(), // completed 是可選的
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
    const parsed = todoValidator.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues },
        { status: 400 }
      );
    }

    // 提取已驗證的數據
    const { title, completed } = parsed.data;

    // 初始化倉儲和服務
    const todoRepository = new PrismaTodoRepository();
    const todoService = new TodoService(todoRepository);

    // 根據不同的數據進行操作
    if (title !== undefined) {
      await todoService.renameTodo(Number(id), title); // 只更新標題
    }

    if (completed !== undefined) {
      if (completed) {
        await todoService.completeTodo(Number(id)); // 完成 Todo
      } else {
        await todoService.markTodoIncomplete(Number(id)); // 取消完成狀態
      }
    }
    // 返回更新後的 Todo 數據
    const updatedTodo = await todoRepository.findById(Number(id));

    return NextResponse.json(updatedTodo, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Failed to update todo' },
      { status: 500 }
    );
  }
}
