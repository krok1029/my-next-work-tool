import { Todo } from '@prisma/client';
import { create } from 'zustand';

type todoState = {
  selectedTodo: Todo | null;
  setSelectedTodo: (todo: Todo) => void;
  clearSelectedTodo: () => void;
};

export const useTodoStore = create<todoState>((set) => ({
  selectedTodo: null,
  setSelectedTodo: (todo: Todo) => set({ selectedTodo: todo }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
}));
