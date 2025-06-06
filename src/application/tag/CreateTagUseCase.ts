import '@/infrastructure/di/Container';
import { injectable, inject } from 'tsyringe';

import { TAG } from '@/domain/shared/DependencyInjectionTokens';
import type { TagRepository } from '@/domain/tag/TagRepository';
import { Tag } from '@/domain/tag/Tag';
import { TagTargetType } from '@/domain/tag/TagTypes';

@injectable()
export class CreateTagUseCase {
  constructor(
    @inject(TAG.Repo) private readonly tagRepository: TagRepository
  ) {}

  async execute(params: {
    name: string;
    targetId: string;
    targetType: TagTargetType;
  }): Promise<Tag> {
    const tag = Tag.createNew(params);

    return await this.tagRepository.create(tag); // ✅ 正確地呼叫 create
  }
}
