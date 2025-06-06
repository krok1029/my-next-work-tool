// src/lib/validators.ts
import { z, ZodError } from 'zod';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Priority } from '@/domain/todo/TodoTypes';
import { TagTargetType } from '@/domain/tag/TagTypes';

// Todo 的驗證邏輯
export const postTodoValidator = z.object({
  title: z.string().min(1, { message: "Title can't be empty" }),
  completed: z.boolean().optional(),
});

export const putTodoValidator = z
  .object({
    title: z.string().optional(),
    completed: z.boolean().optional(),
    totalPomodoros: z.number().optional(),
    completedPomodoros: z.number().optional(),
    priority: z.enum([Priority.LOW, Priority.MEDIUM, Priority.HIGH]).optional(),
    deadline: z
      .string()
      .refine((dateString) => !isNaN(Date.parse(dateString)), {
        message: 'Invalid date format',
      })
      .optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be updated',
    path: [],
  });

// 用戶登錄的驗證邏輯
export const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: 'Password must contain at least one letter and one number',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // 指定錯誤訊息應該顯示在哪個欄位
  });

export const postTagValidator = z.object({
  name: z.string().min(1, { message: "Tag name can't be empty" }),
  targetType: z.enum([TagTargetType.TODO, TagTargetType.USER]),
  targetId: z.string(),
});

export const putTagValidator = z.object({
  name: z.string().min(1, { message: "Tag name can't be empty" }),
  tagTargetType: z.enum([TagTargetType.TODO, TagTargetType.USER]).optional(),
  targetId: z.number().optional(),
  id: z.number().int().positive({ message: 'ID must be a positive integer' }),
});

export function validatePayload<T>(schema: z.ZodType<T>) {
  return async (req: NextRequest): Promise<T> => {
    try {
      const body = await req.json();
      // 使用 Zod 進行驗證，返回具體的解析類型 T
      return schema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        throw error;
      }
      throw NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
  };
}
