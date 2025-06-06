// application/tag/GetAllTagUseCase.ts

import type { TagRepository } from '@/domain/tag/TagRepository';
import { injectable, inject } from 'tsyringe';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';

@injectable()
export class SearchTagsUseCase {
  constructor(@inject(TAG.Repo) private tagRepository: TagRepository) {}

  async execute(keyword: string) {
    return this.tagRepository.findByKeyword(keyword);
  }
}
