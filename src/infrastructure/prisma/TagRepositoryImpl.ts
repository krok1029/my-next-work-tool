// infrastructure/prisma/TagRepositoryImpl.ts
import prisma from './PrismaClient';
import { TagRepository } from '@/domain/tag/TagRepository';
import { TagTargetType as DomainTagTargetType } from '@/domain/tag/TagTypes';
import {
  TagTargetType as PrismaTagTargetType,
  Tag as PrismaTag,
} from '@prisma/client';
import { Tag } from '@/domain/tag/Tag';
import { injectable } from 'tsyringe';
import { Prisma } from '@prisma/client';

@injectable()
export class PrismaTagRepository implements TagRepository {
  private mapPrismaTagToDomain(prismaTodo: PrismaTag): Tag {
    return new Tag({
      id: prismaTodo.id,
      name: prismaTodo.name,
      targetType: this.mapPrismaTagTargetTypeToDomain(prismaTodo.targetType),
      targetId: prismaTodo.targetId,
      createdAt: prismaTodo.createdAt,
    });
  }

  private mapPrismaTagTargetTypeToDomain(
    tagTargetType: PrismaTagTargetType
  ): DomainTagTargetType {
    switch (tagTargetType) {
      case PrismaTagTargetType.TODO:
        return DomainTagTargetType.TODO;
      case PrismaTagTargetType.USER:
        return DomainTagTargetType.USER;
      default:
        return DomainTagTargetType.TODO;
    }
  }

  private mapDomainTagTargetTypeToPrisma(
    priority: DomainTagTargetType
  ): PrismaTagTargetType {
    switch (priority) {
      case DomainTagTargetType.TODO:
        return PrismaTagTargetType.TODO;
      case DomainTagTargetType.USER:
        return PrismaTagTargetType.USER;
      default:
        return PrismaTagTargetType.TODO;
    }
  }

  async findAll(): Promise<Tag[]> {
    const tags = await prisma.tag.findMany();
    return tags.map((tag) => this.mapPrismaTagToDomain(tag));
  }

  async findById(id: number): Promise<Tag | null> {
    const tag = await prisma.tag.findUnique({ where: { id } });
    return tag ? this.mapPrismaTagToDomain(tag) : null;
  }

  async findByTargetTypeAndId(
    targetType: DomainTagTargetType,
    targetId: string
  ): Promise<Tag[]> {
    const where: Prisma.TagWhereInput = {
      targetId,
      targetType: this.mapDomainTagTargetTypeToPrisma(targetType),
    };

    const tags = await prisma.tag.findMany({
      where,
    });

    return tags.map((tag) => this.mapPrismaTagToDomain(tag));
  }

  async update(tag: Tag): Promise<Tag> {
    if (tag.id === null) {
      throw new Error('Cannot update a Todo without an ID');
    }
    const newTag = await prisma.tag.update({
      where: { id: tag.id },
      data: { name: tag.name },
    });
    return this.mapPrismaTagToDomain(newTag);
  }

  async create(tag: Tag): Promise<Tag> {
    const tagData = await prisma.tag.create({
      data: {
        name: tag.name,
        targetType: this.mapDomainTagTargetTypeToPrisma(tag.targetType),
        targetId: tag.targetId,
        createdAt: new Date(), // Prisma will handle the timestamp
      },
    });
    return this.mapPrismaTagToDomain(tagData);
  }

  async delete(id: number): Promise<void> {
    await prisma.tag.delete({ where: { id } });
  }
}
