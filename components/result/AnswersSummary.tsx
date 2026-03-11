'use client';

import { useState } from 'react';
import { QUESTIONS, ANSWER_OPTIONS, ANXIETY_TYPE_LABELS } from '@/constants/questions';

interface Props {
  rawAnswers: number[];
}

export default function AnswersSummary({ rawAnswers }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
      >
        <span className="text-sm font-medium text-gray-700">16問の回答を確認する</span>
        <span className="text-gray-400 text-sm">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="divide-y divide-gray-100">
          {QUESTIONS.map((q) => {
            const answerScore = rawAnswers[q.orderIndex - 1] ?? 0;
            const answerLabel = ANSWER_OPTIONS.find((o) => o.score === answerScore)?.label ?? '—';
            return (
              <div key={q.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs text-gray-400 mr-1">Q{q.id}</span>
                    <span className="text-xs text-gray-700 leading-relaxed">{q.questionText}</span>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                      answerScore === 0
                        ? 'bg-gray-100 text-gray-500'
                        : answerScore === 1
                        ? 'bg-blue-50 text-blue-600'
                        : answerScore === 2
                        ? 'bg-orange-50 text-orange-600'
                        : 'bg-red-50 text-red-600'
                    }`}
                  >
                    {answerLabel}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-5">
                  {ANXIETY_TYPE_LABELS[q.anxietyType]}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
