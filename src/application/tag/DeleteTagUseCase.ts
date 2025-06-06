import '@/infrastructure/di/Container';
import { inject, injectable } from 'tsyringe';
import type { TagRepository } from '@/domain/tag/TagRepository';
import { TAG } from '@/domain/shared/DependencyInjectionTokens';

@injectable()
export class DeleteTagUseCase {
  constructor(@inject(TAG.Repo) private tagRepository: TagRepository) {}

  async execute(id: number) {
    return this.tagRepository.delete(id);
  }
}
