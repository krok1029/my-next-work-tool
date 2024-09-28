import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { SignInUserUseCase } from '@/application/auth/SignInUserUseCase';
import { signInSchema, validatePayload } from '@/lib/validators';
import '@/infrastructure/di/Container';

export async function POST(req: NextRequest) {
  try {
    const parsedBody = await validatePayload(signInSchema)(req);

    const { email, password } = parsedBody;

    const signInUserUseCase = container.resolve(SignInUserUseCase);

    const user = await signInUserUseCase.execute(email, password);

    return NextResponse.json({ user });
  } catch (error: any) {
    const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status: statusCode });
  }
}
