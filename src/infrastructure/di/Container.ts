// infrastructure/di/Container.ts
import 'reflect-metadata';
import { registerTodoModule } from './modules/todo.di';
import { registerUserModule } from './modules/user.di';
import { registerAuthModule } from './modules/auth.di';

registerTodoModule();
registerUserModule();
registerAuthModule();
