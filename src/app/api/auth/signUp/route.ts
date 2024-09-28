import { NextRequest, NextResponse } from 'next/server';
import { container } from 'tsyringe';
import { SignUpUserUseCase } from '@/application/auth/SignUpUserUseCase';
import { signUpSchema, validatePayload } from '@/lib/validators';

// 定義 Zod Schema

export async function POST(req: NextRequest) {
  try {
    console.log('Received request to sign up');
    const parsedBody = await validatePayload(signUpSchema)(req);

    const { email, password } = parsedBody;

    const signUpUserUseCase = container.resolve(SignUpUserUseCase);

    const user = await signUpUserUseCase.execute(email, password);

    return NextResponse.json({ user });
  } catch (error: any) {
    const statusCode = error.message === 'Invalid credentials' ? 401 : 500;
    return NextResponse.json({ error: error.message }, { status: statusCode });
  }
}
