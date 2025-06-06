// lib/api/tag.ts
// import { mutate } from 'swr';
'use server';

import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { TagController } from '@/interface-adapters/controllers/TagController';
import { Tag } from '@/domain/tag/Tag';
import { TagTargetType } from '@/domain/tag/TagTypes';

// ✅ 1. 讀取 Tags
export const getTags = async (): Promise<Tag[]> => {
  try {
    const tagController = container.resolve(TagController);
    const tags = await tagController.getAll();
    return JSON.parse(JSON.stringify(tags));
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
};

// ✅ 2. 建立 Tag
export const createTag = async (data: {
  name: string;
  targetType: TagTargetType;
  targetId: string;
}): Promise<Tag> => {
  try {
    const tagController = container.resolve(TagController);
    const tag = await tagController.create(data);

    return JSON.parse(JSON.stringify(tag));
  } catch (error) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// ✅ 3. 更新 Tag
export const updateTag = async (
  id: number,
  data: Partial<Tag>
): Promise<Tag> => {
  try {
    const tagController = container.resolve(TagController);
    const tag = await tagController.update(id, data);

    return JSON.parse(JSON.stringify(tag));
  } catch (error) {
    console.error('Error updating tag:', error);
    throw error;
  }
};

// ✅ 4. 刪除 Tag
export const deleteTag = async (id: number): Promise<boolean> => {
  try {
    const tagController = container.resolve(TagController);
    await tagController.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting tag:', error);
    return false;
  }
};
