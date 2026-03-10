import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface StoredResult {
  takenAt: string;
  scores: {
    knowledge: number;
    skill: number;
    experience: number;
    environment: number;
  };
  typeId: string;
  rawAnswers: number[];
  checkedAdviceIds: string[];
}

interface ResultState {
  result: StoredResult | null;
  setResult: (result: StoredResult) => void;
  toggleAdvice: (id: string) => void;
}

export const useResultStore = create<ResultState>()(
  persist(
    (set) => ({
      result: null,
      setResult: (result: StoredResult) => set({ result }),
      toggleAdvice: (id: string) =>
        set((state) => {
          if (!state.result) return state;
          const checked = state.result.checkedAdviceIds;
          const newChecked = checked.includes(id)
            ? checked.filter((c) => c !== id)
            : [...checked, id];
          return {
            result: {
              ...state.result,
              checkedAdviceIds: newChecked,
            },
          };
        }),
    }),
    {
      name: 'dpl_result',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
