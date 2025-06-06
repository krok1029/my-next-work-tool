import { TagTargetType } from '@/domain/tag/TagTypes';

export class Tag {
  public readonly id: number;
  public name: string;
  public targetType: TagTargetType;
  public targetId: string;
  public createdAt: Date;

  constructor(params: {
    id: number;
    name: string;
    targetType: TagTargetType;
    targetId: string;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.targetType = params.targetType;
    this.targetId = params.targetId;
    this.createdAt = params.createdAt;
  }

  static createNew(params: {
    name: string;
    targetType: TagTargetType;
    targetId: string;
  }) {
    return new Tag({
      id: 0,
      name: params.name,
      targetType: params.targetType,
      targetId: params.targetId,
      createdAt: new Date(),
    });
  }

  update(name: string) {
    this.name = name;
  }
}
