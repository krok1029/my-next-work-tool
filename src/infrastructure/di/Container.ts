// infrastructure/di/Container.ts
import 'reflect-metadata';
import { registerTodoModule } from './modules/todo.di';
import { registerUserModule } from './modules/user.di';
import { registerAuthModule } from './modules/auth.di';
import { registerTagModule } from './modules/tag.di';

registerTodoModule();
registerUserModule();
registerAuthModule();
registerTagModule();
