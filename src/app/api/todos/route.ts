import { NextResponse } from 'next/server';
import { PrismaTodoRepository } from '@/infrastructure/prisma/TodoRepositoryImpl';
import { TodoService } from '@/application/todo/TodoService';

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
