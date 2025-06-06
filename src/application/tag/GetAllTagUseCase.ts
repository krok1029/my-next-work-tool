// application/tag/GetAllTagUseCase.ts

import type { TagRepository } from '@/domain/tag/TagRepository';
import { injectable, inject } from 'tsyringe';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';

@injectable()
export class GetAllTagUseCase {
  constructor(@inject(TAG.Repo) private tagRepository: TagRepository) {}

  async execute() {
    return this.tagRepository.findAll();
  }
}
