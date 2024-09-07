import { NextRequest, NextResponse } from 'next/server';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoService } from '@/application/todo/TodoService';
import { z } from 'zod';

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
// 使用 Zod 進行數據驗證，確保 title 和 completed 是有效的
const postTodoValidator = z.object({
  title: z.string().min(1, { message: "Title can't be empty" }), // title 是必填且不能為空
  completed: z.boolean().optional(), // completed 是可選的
});

export async function GET() {
  try {
    // 初始化倉儲和服務
    const todoRepository = new PrismaTodoRepository();
    const todoService = new TodoService(todoRepository);
    // 使用 TodoService 來獲取所有的 todos
    const todos = await todoService.getAllTodos();
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
    const { title, completed } = parsed.data;

    // 初始化倉儲和服務
    const todoRepository = new PrismaTodoRepository();
    const todoService = new TodoService(todoRepository);

    // 創建新的 Todo，這裡傳入 title 和 completed
    const newTodo = await todoService.createTodo(title);

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
