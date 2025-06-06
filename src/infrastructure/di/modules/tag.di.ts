// infrastructure/di/modules/di.tag.ts
import { container } from 'tsyringe';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';
import { PrismaTagRepository } from '@/infrastructure/prisma/TagRepositoryImpl';
import { TagRepository } from '@/domain/tag/TagRepository';
import { TagController } from '@/interface-adapters/controllers/TagController';
import { CreateTagUseCase } from '@/application/tag/CreateTagUseCase';
import { GetAllTagUseCase } from '@/application/tag/GetAllTagUseCase';
import { GetTagUseCase } from '@/application/tag/GetTagUseCase';
import { UpdateTagUseCase } from '@/application/tag/UpdateTagUseCase';
import { DeleteTagUseCase } from '@/application/tag/DeleteTagUseCase';

export function registerTagModule() {
  if (!container.isRegistered(TAG.Repo)) {
    container.registerSingleton<TagRepository>(
      TAG.Repo,
      PrismaTagRepository
    );
  }

  if (!container.isRegistered(TAG.Controller)) {
    container.registerSingleton<TagController>(
      TAG.Controller,
      TagController
    );
  }

  if (!container.isRegistered(TAG.CreateTagUseCase)) {
    container.registerSingleton(TAG.CreateTagUseCase, CreateTagUseCase);
  }

  if (!container.isRegistered(TAG.GetAllTagUseCase)) {
    container.registerSingleton(TAG.GetAllTagUseCase, GetAllTagUseCase);
  }

  if (!container.isRegistered(TAG.GetTagUseCase)) {
    container.registerSingleton(TAG.GetTagUseCase, GetTagUseCase);
  }

  if (!container.isRegistered(TAG.UpdateTagUseCase)) {
    container.registerSingleton(TAG.UpdateTagUseCase, UpdateTagUseCase);
  }

  if (!container.isRegistered(TAG.DeleteTagUseCase)) {
    container.registerSingleton(TAG.DeleteTagUseCase, DeleteTagUseCase);
  }
}
