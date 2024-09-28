'use server'; // 指定這個文件是伺服器端運行的

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { SignUpUserUseCase } from '@/application/auth/SignUpUserUseCase';
import { signUpSchema } from '@/lib/validators';
import { CreateUserUseCase } from '@/application/user/CreateUserUseCase';

// 定義 Server Action
export async function signUp(data: FormData) {
  const formValues: Record<string, string> = {
    firstName: data.get('firstName')?.toString() ?? '',
    lastName: data.get('lastName')?.toString() ?? '',
    email: data.get('email')?.toString() ?? '',
    password: data.get('password')?.toString() ?? '',
    confirmPassword: data.get('confirmPassword')?.toString() ?? '',
  };

  try {
    signUpSchema.parse(formValues);

    const signUpUserUseCase = container.resolve(SignUpUserUseCase);
    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userId = await signUpUserUseCase.execute(
      formValues.email,
      formValues.password
    );

    const newUser = await createUserUseCase.execute({
      userId,
      email: formValues.email,
      name: `${formValues.firstName} ${formValues.lastName}`,
    });
    console.log('user', newUser);
    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
