import { Todo } from '@prisma/client';
import { create } from 'zustand';

type todoState = {
  selectedTodo: Todo | null;
  isInProgress: boolean; // 新增進行中的 flag
  setSelectedTodo: (todo: Todo) => void;
  clearSelectedTodo: () => void;
  startProgress: () => void; // 開始進行
  stopProgress: () => void; // 停止進行
};

export const useTodoStore = create<todoState>((set) => ({
  selectedTodo: null,
  isInProgress: false, // 初始化 flag 為 false
  setSelectedTodo: (todo: Todo) => set({ selectedTodo: todo }),
  clearSelectedTodo: () => set({ selectedTodo: null }),
  startProgress: () => set({ isInProgress: true }), // 設置進行中為 true
  stopProgress: () => set({ isInProgress: false }), // 設置進行中為 false
}));

type LoadingState = {
  loadingCounter: number;
  incrementLoading: () => void;
  decrementLoading: () => void;
};

export const useLoadingStore = create<LoadingState>((set) => ({
  loadingCounter: 0,
  incrementLoading: () =>
    set((state) => ({ loadingCounter: state.loadingCounter + 1 })),
  decrementLoading: () =>
    set((state) => ({ loadingCounter: Math.max(state.loadingCounter - 1, 0) })),
}));
