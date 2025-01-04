'use client';

import React, { useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { putTodoValidator } from '@/lib/validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Priority } from '@prisma/client';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { mutate } from 'swr';
import { toast } from '@/hooks/use-toast';
import { useTodoStore } from '@/lib/zustandStore';

const TodoSheet: React.FC<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}> = ({ isOpen, setIsOpen }) => {
  const { selectedTodo, clearSelectedTodo } = useTodoStore();
  const form = useForm<z.infer<typeof putTodoValidator>>({
    resolver: zodResolver(putTodoValidator),
  });

  useEffect(() => {
    if (!!selectedTodo) {
      form.reset({
        ...selectedTodo,
        deadline: String(selectedTodo.deadline),
      });
    }
  }, [selectedTodo]);

  const onSubmit = async (
    id: number,
    data: z.infer<typeof putTodoValidator>
  ) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsOpen(false);
        clearSelectedTodo();
        toast({
          title: 'Todo updated successfully',
          description: 'Your todo has been updated',
        });
        mutate('/api/todos');
        form.reset();
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(false);
    if (!open) {
      clearSelectedTodo();
    }
  };

  const inputs: {
    name: keyof z.infer<typeof putTodoValidator>;
    label: string;
    renderInput: (field: any) => React.JSX.Element;
  }[] = [
    {
      name: 'title',
      label: 'Title',
      renderInput: (field: any) => (
        <Input
          id="title"
          placeholder="Todo Title"
          defaultValue={selectedTodo?.title}
          {...field}
        />
      ),
    },
    {
      name: 'completed',
      label: 'Completed',
      renderInput: (field: any) => (
        <div className="flex flex-row items-center space-x-3 space-y-0">
          <Switch
            id="completed"
            checked={field.value}
            onCheckedChange={(value) => field.onChange(value)}
          />
          <FormLabel htmlFor="completed">
            {field.value ? 'Completed' : 'Not Completed'}
          </FormLabel>
        </div>
      ),
    },
    {
      name: 'totalPomodoros',
      label: 'Total Pomodoros',
      renderInput: (field: any) => (
        <Input
          {...field}
          id="totalPomodoros"
          placeholder="Total Pomodoros"
          defaultValue={selectedTodo?.totalPomodoros}
          onChange={(e) => {
            const value = Number(e.target.value);
            field.onChange(isNaN(value) ? 0 : value);
          }}
        />
      ),
    },
    {
      name: 'completedPomodoros',
      label: 'Completed Pomodoros',
      renderInput: (field: any) => (
        <Input
          {...field}
          id="completedPomodoros"
          placeholder="Completed Pomodoros"
          defaultValue={selectedTodo?.completedPomodoros}
          onChange={(e) => {
            const value = Number(e.target.value);
            field.onChange(isNaN(value) ? 0 : value);
          }}
        />
      ),
    },
    {
      name: 'priority',
      label: 'Priority',
      renderInput: (field: any) => (
        <Select
          {...field}
          onValueChange={field.onChange}
          defaultValue={selectedTodo?.priority}
        >
          <SelectTrigger id="priority">
            <SelectValue placeholder="Select a priority" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(Priority).map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    {
      name: 'deadline',
      label: 'Deadline',
      renderInput: (field: any) => (
        <Popover>
          <div className="w-full">
            <PopoverTrigger asChild>
              <Button
                id="deadline"
                variant={'outline'}
                className={cn(
                  'w-full pl-3 text-left font-normal',
                  !field.value && 'text-muted-foreground'
                )}
              >
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) =>
                  field.onChange(date ? new Date(date).toISOString() : null)
                }
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </div>
        </Popover>
      ),
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{selectedTodo?.title}</SheetTitle>
          <SheetDescription>
            Edit the todo with the form below.
          </SheetDescription>
        </SheetHeader>

        {selectedTodo && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                onSubmit(selectedTodo.id, data)
              )}
              className="space-y-8 py-4"
            >
              {inputs.map((input) => (
                <FormField
                  control={form.control}
                  name={input.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor={input.name}>{input.label}</FormLabel>
                      <FormControl>{input.renderInput(field)}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TodoSheet;
