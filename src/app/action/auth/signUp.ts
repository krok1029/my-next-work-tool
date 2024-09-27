'use server'; // 指定這個文件是伺服器端運行的

import bcrypt from 'bcrypt';
import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { SignUpUserUseCase } from '@/application/user/SignUpUserUseCase';
import { signUpSchema, validatePayload } from '@/lib/validators';

// 定義 Server Action
export async function signUp(data: FormData) {
  const formValues = {
    firstName: data.get('firstName') as string,
    lastName: data.get('lastName') as string,
    email: data.get('email') as string,
    password: data.get('password') as string,
    confirmPassword: data.get('confirmPassword') as string,
  };

  try {
    // 使用 Zod 進行表單驗證
    signUpSchema.parse(formValues);
    
    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(formValues.password, 10);
    
    console.log('hashedPassword:', hashedPassword);
    const signUpUserUseCase = container.resolve(SignUpUserUseCase);

    const user = await signUpUserUseCase.execute(
      formValues.email,
      hashedPassword
    );
    console.log("user", user);
    return { success: true, message: 'User created successfully' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
