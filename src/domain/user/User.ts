// src/domain/user/User.ts
export class User {
  constructor(
    public id: string, // 使用 Supabase 的 user.id
    public email: string,
    public name: string,
    public workDuration: number = 25, // 默認工作時間
    public breakDuration: number = 5 // 默認休息時間
  ) {}

  // 添加方法來更改用戶信息（業務邏輯）
  updateWorkDuration(newDuration: number) {
    if (newDuration <= 0) {
      throw new Error('Work duration must be positive.');
    }
    this.workDuration = newDuration;
  }

  updateBreakDuration(newDuration: number) {
    if (newDuration <= 0) {
      throw new Error('Break duration must be positive.');
    }
    this.breakDuration = newDuration;
  }
}
