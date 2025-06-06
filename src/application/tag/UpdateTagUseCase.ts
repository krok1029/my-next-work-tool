// application/tag/UpdateTagUseCase.ts
import type { TagRepository } from '@/domain/tag/TagRepository';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';
import { injectable, inject } from 'tsyringe';
import '@/infrastructure/di/Container';
import { Tag } from '@/domain/tag/Tag';

@injectable()
export class UpdateTagUseCase {
  constructor(@inject(TAG.Repo) private tagRepository: TagRepository) {}

  async execute(tag: Tag, name: string) {
    tag.update(name);
    return await this.tagRepository.update(tag);
  }
}
