import '@/infrastructure/di/Container';
import { NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { UserController } from '@/interface-adapters/controllers/UserController';

export async function GET() {
  try {
    const controller = container.resolve(UserController);
    const user = await controller.getUser();

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}
