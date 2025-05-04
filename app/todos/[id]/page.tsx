'use client';

import EditTodoForm from '@/components/todos/EditTodoForm';
import { Label } from '@/components/ui/label';
import useFetch from '@hooks/use-fetch';
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
        <MultipleSelectorWithAsyncSearchAndCreatable />
        <Label>Subtask</Label>
      </div>
    </div>
  );
};
export default TodoDetail;

import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useState } from 'react';

const OPTIONS: Option[] = [
  { label: 'nextjs', value: 'Nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember' },
  { label: 'Gatsby', value: 'gatsby' },
  { label: 'Astro', value: 'astro' },
];

const mockSearch = async (value: string): Promise<Option[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const res = OPTIONS.filter((option) => option.value.includes(value));
      resolve(res);
    }, 1000);
  });
};

const MultipleSelectorWithAsyncSearchAndCreatable = () => {
  const [_isTrigger, setIsTriggered] = useState(false);

  return (
    <div className="flex w-full flex-col gap-5 px-10">
      <MultipleSelector
        onSearch={async (value) => {
          setIsTriggered(true);
          const res = await mockSearch(value);
          setIsTriggered(false);
          return res;
        }}
        // onChange={(value) => {
        //   console.log(value);
        // }}
        defaultOptions={[]}
        creatable={true}
        placeholder="trying to search 'a' to get more options..."
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
    </div>
  );
};
