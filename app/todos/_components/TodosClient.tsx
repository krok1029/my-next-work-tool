import { TodoDTO } from '@/interface-adapters/dto/TodoDTO';
import TodoItem from './TodoItem';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import NewTodos from '@/components/todos/NewTodos';

const TodosClient = ({ initialTodos }: { initialTodos: TodoDTO[] }) => {
  return (
    <>
      <Card>
        <CardHeader>Todos List</CardHeader>
        <CardContent>
          <NewTodos />
          {initialTodos?.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
        </CardContent>
      </Card>
    </>
  );
};

export default TodosClient;
