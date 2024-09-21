// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { container } from 'tsyringe';
import { CheckSessionUseCase } from '@/application/user/CheckSessionUseCase';

export async function middleware(request: NextRequest) {
  const checkSessionUseCase = container.resolve(CheckSessionUseCase);
  const { session } = await checkSessionUseCase.execute();

  const { pathname } = request.nextUrl;

  // 如果有 session 並且路徑是 /login 或 /，則重定向到 /dashboard
  if (session && (pathname === '/' || pathname === '/login')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 如果沒有 session，重定向到 /login
  if (!session && pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// 使用 matcher 來定義 middleware 應用的路徑
export const config = {
  matcher: ['/', '/login'],  // 將這些路徑納入 middleware 驗證
};