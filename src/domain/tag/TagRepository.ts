// domain/tag/TagRepository.ts
import { Tag } from './Tag';
import { TagTargetType } from './TagTypes';

export interface TagRepository {
  create(tag: Tag): Promise<Tag>;
  findById(id: number): Promise<Tag | null>;
  findByTargetTypeAndId(
    targetType: TagTargetType,
    targetId: string
  ): Promise<Tag[]>;
  findByKeyword(keyword: string): Promise<Tag[]>;
  update(tag: Partial<Tag>): Promise<Tag>;
  delete(id: number): Promise<void>;
  findAll(): Promise<Tag[]>;
}
