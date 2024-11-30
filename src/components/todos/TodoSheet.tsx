'use client';
import React, { useEffect, useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Todo } from '@/domain/todo/Todo';
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

interface TodoSheetProps {
  selectedTodo: Todo | null;
  clearSelectedTodo: () => void;
}

const TodoSheet: React.FC<TodoSheetProps> = ({
  selectedTodo,
  clearSelectedTodo,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof putTodoValidator>>({
    resolver: zodResolver(putTodoValidator),
  });

  const onSubmit = async (
    id: number,
    data: z.infer<typeof putTodoValidator>
  ) => {
    console.log('data', data);
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        clearSelectedTodo();
        toast({
          title: 'Todo updated successfully',
          description: 'Your todo has been updated',
        });
        mutate('/api/todos');
      } else {
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  useEffect(() => {
    if (selectedTodo) {
      form.reset(selectedTodo);
      setIsOpen(true);
    }
  }, [selectedTodo]);

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      clearSelectedTodo();
    }
  };

  const renderFormField = (
    name: keyof z.infer<typeof putTodoValidator>,
    label: string,
    renderInput: (field: any) => JSX.Element
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <FormControl>{renderInput(field)}</FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
  if (!selectedTodo) return null;
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{selectedTodo?.title}</SheetTitle>
          <SheetDescription>
            Edit the todo with the form below.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              onSubmit(selectedTodo.id, data)
            )}
            className="space-y-8 py-4"
          >
            {renderFormField('title', 'Title', (field) => (
              <Input
                id="title"
                placeholder="Todo Title"
                defaultValue={selectedTodo?.title}
                {...field}
              />
            ))}
            {renderFormField('completed', 'Completed', (field) => (
              <div className="flex flex-row items-center space-x-3 space-y-0">
                <Switch
                  id="completed"
                  checked={field.value}
                  onCheckedChange={(value) => {
                    console.log('Switch value:', value);
                    field.onChange(value);
                  }}
                />
                <FormLabel htmlFor="completed">
                  {field.value ? 'Completed' : 'Not Completed'}
                </FormLabel>
              </div>
            ))}
            {renderFormField('totalPomodoros', 'Total Pomodoros', (field) => (
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
            ))}
            {renderFormField(
              'completedPomodoros',
              'Completed Pomodoros',
              (field) => (
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
              )
            )}
            {renderFormField('priority', 'Priority', (field) => (
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
            ))}
            {renderFormField('deadline', 'Deadline', (field) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[240px] pl-3 text-left font-normal',
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
              </Popover>
            ))}
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default TodoSheet;
