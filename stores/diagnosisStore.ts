import { create } from 'zustand';

interface DiagnosisState {
  answers: (number | null)[];
  currentStep: number;
  isCompleted: boolean;
  setAnswer: (step: number, score: number) => void;
  reset: () => void;
}

const initialState = {
  answers: Array(16).fill(null) as (number | null)[],
  currentStep: 1,
  isCompleted: false,
};

export const useDiagnosisStore = create<DiagnosisState>((set) => ({
  ...initialState,
  setAnswer: (step: number, score: number) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[step - 1] = score;
      const nextStep = step + 1;
      const isCompleted = step === 16;
      return {
        answers: newAnswers,
        currentStep: isCompleted ? 16 : nextStep,
        isCompleted,
      };
    }),
  reset: () => set(initialState),
}));
