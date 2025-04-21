'use client';

import EditTodoForm from '@/components/todos/EditTodoForm';
import { Label } from '@/components/ui/label';
import useFetch from '@/hooks/use-fetch';
import { Todo } from '@prisma/client';
import { useParams } from 'next/navigation';

const TodoDetail = () => {
  const { id } = useParams();
  const { data: todo } = useFetch<Todo>(`todos/${id}`);
  if (!todo) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-full flex-row items-center justify-center gap-x-2">
      <div className="flex-1">
        <EditTodoForm selectedTodo={todo} />
      </div>
      <div className="flex flex-1 flex-col gap-y-2">
        <Label>Label</Label>
        <Label>Subtask</Label>
      </div>
    </div>
  );
};
export default TodoDetail;
