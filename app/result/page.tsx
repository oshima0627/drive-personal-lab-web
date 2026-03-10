'use client';

import { Suspense } from 'react';
import ResultContent from './ResultContent';

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-400 text-sm">読み込み中...</div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
