// infrastructure/prisma/PrismaClient.ts
import { PrismaClient } from '@prisma/client';

// 這裡確保在開發環境中不會重複初始化 Prisma 客戶端
const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export default prisma;