import '@/infrastructure/di/Container';
import { container } from 'tsyringe';
import { TodoController } from '@/interface-adapters/controllers/TodoController';
import TodosClient from './TodosClient';
import { TodoMapper } from '@/interface-adapters/dto/TodoDTO';

const Todos = async () => {
  const controller = container.resolve(TodoController);
  const todos = await controller.getAll();
  const todoDTOs = todos.map((todo) => TodoMapper.toDTO(todo));

  return (
    <div className="p-4">
      <TodosClient initialTodos={todoDTOs} />
    </div>
  );
};

export default Todos;
