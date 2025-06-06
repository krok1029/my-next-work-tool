import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import type { TagRepository } from '@/domain/tag/TagRepository';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';
import { NotFoundError } from '@/domain/shared/Error';

@injectable()
export class GetTagUseCase {
  constructor(@inject(TAG.Repo) private tagRepository: TagRepository) {}

  async execute(id: number) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundError(`Tag with id ${id} not found`);
    }
    return tag;
  }
}
