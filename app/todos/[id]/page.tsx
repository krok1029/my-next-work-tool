'use client';

import EditTodoForm from '@/components/todos/EditTodoForm';
import { Label } from '@/components/ui/label';
import useFetch from '@hooks/use-fetch';
import { Todo } from '@/domain/todo/Todo';
import { useParams } from 'next/navigation';

const TodoDetail = () => {
  const { id } = useParams();
  const { data: todo } = useFetch<Todo>(`todos/${id}`);
  if (!todo) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-full flex-col divide-y md:flex-row md:gap-x-8 md:divide-y-0">
      <div className="flex-1">
        <EditTodoForm selectedTodo={todo} />
      </div>
      <div className="flex-1 py-4">
        <div className="space-y-8">
          <div className="space-y-2">
            <Label>Label</Label>
            <MultipleSelectorWithAsyncSearchAndCreatable />
          </div>
          <div>
            <Label>Subtask</Label>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TodoDetail;

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useState } from 'react';
import { createTag, getTags } from '@/lib/api/tag';
import { TagTargetType } from '@/domain/tag/TagTypes';

const MultipleSelectorWithAsyncSearchAndCreatable = () => {
  const [_isTrigger, setIsTriggered] = useState(false);
  const [value, setValue] = useState<Option[]>([]);
  const { id } = useParams();

  return (
    <div className="my-2 flex w-full flex-col gap-5">
      <MultipleSelector
        onSearch={async () => {
          setIsTriggered(true);
          const res = await getTags();
          setIsTriggered(false);
          const options = res.map((tag) => ({
            value: tag.name,
            label: tag.name,
          }));
          return options;
        }}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
        onCreate={async (value) => {
          await createTag({
            name: value.value,
            targetType: TagTargetType.TODO,
            targetId: id as string,
          });
        }}
        defaultOptions={[]}
        creatable={true}
        placeholder="trying to search options..."
        loadingIndicator={
          <p className="py-2 text-center text-lg leading-10 text-muted-foreground">
            loading...
          </p>
        }
        emptyIndicator={
          <p className="w-full text-center text-lg leading-10 text-muted-foreground">
            no results found.
          </p>
        }
      />
      <button
        onClick={() => {
          console.log('baleu', value.map((b) => b.value).join(','));
        }}
      >
        CHECK
      </button>
    </div>
  );
};
