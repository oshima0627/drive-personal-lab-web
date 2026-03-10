'use client';

import { useState } from 'react';
import { ANSWER_OPTIONS } from '@/constants/questions';

interface QuestionCardProps {
  questionText: string;
  guideText?: string;
  categoryLabel: string;
  selectedAnswer: number | null;
  onAnswer: (score: number) => void;
}

export default function QuestionCard({
  questionText,
  guideText,
  categoryLabel,
  selectedAnswer,
  onAnswer,
}: QuestionCardProps) {
  const [pendingAnswer, setPendingAnswer] = useState<number | null>(null);

  const handleSelect = (score: number) => {
    if (pendingAnswer !== null) return; // prevent double-tap
    setPendingAnswer(score);
    setTimeout(() => {
      setPendingAnswer(null);
      onAnswer(score);
    }, 300);
  };

  const activeAnswer = pendingAnswer !== null ? pendingAnswer : selectedAnswer;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full">
      {/* Category label */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
        {categoryLabel}
      </p>

      {/* Question text */}
      <p className="text-[22px] font-semibold text-gray-800 leading-relaxed mb-4">
        {questionText}
      </p>

      {/* Guide text */}
      {guideText && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-3 mb-5">
          <p className="text-sm italic text-amber-800">{guideText}</p>
        </div>
      )}

      {/* Answer options */}
      <div className="flex flex-col gap-3 mt-2">
        {ANSWER_OPTIONS.map((option) => {
          const isSelected = activeAnswer === option.score;
          return (
            <button
              key={option.score}
              onClick={() => handleSelect(option.score)}
              disabled={pendingAnswer !== null}
              aria-pressed={isSelected}
              className={`w-full text-left px-5 py-4 rounded-xl border-2 text-base font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary hover:bg-blue-50'
                }
                ${pendingAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
