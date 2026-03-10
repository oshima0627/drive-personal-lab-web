'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDiagnosisStore } from '@/stores/diagnosisStore';
import { useResultStore } from '@/stores/resultStore';
import { QUESTIONS, ANXIETY_TYPE_LABELS } from '@/constants/questions';
import { calcScores, resolveTypeId } from '@/lib/scoreCalculator';
import ProgressBar from '@/components/diagnosis/ProgressBar';
import QuestionCard from '@/components/diagnosis/QuestionCard';
import Link from 'next/link';

interface DiagnosisStepPageProps {
  params: { step: string };
}

export default function DiagnosisStepPage({ params }: DiagnosisStepPageProps) {
  const router = useRouter();
  const stepNum = parseInt(params.step, 10);
  const { answers, setAnswer } = useDiagnosisStore();
  const setResult = useResultStore((s) => s.setResult);

  // Validate step
  const isValidStep = stepNum >= 1 && stepNum <= 16 && !isNaN(stepNum);
  const question = isValidStep ? QUESTIONS[stepNum - 1] : null;

  // Warn before leaving
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAnswer = useCallback(
    (score: number) => {
      setAnswer(stepNum, score);

      if (stepNum === 16) {
        // Calculate final scores
        const rawAnswers = [...answers];
        rawAnswers[15] = score; // ensure the last answer is included
        const validAnswers = rawAnswers.map((a) => (a === null ? 0 : a));
        const scores = calcScores(validAnswers);
        const typeId = resolveTypeId(scores);

        setResult({
          takenAt: new Date().toISOString(),
          scores,
          typeId,
          rawAnswers: validAnswers,
          checkedAdviceIds: [],
        });

        router.push('/result');
      } else {
        router.push(`/diagnosis/${stepNum + 1}`);
      }
    },
    [stepNum, answers, setAnswer, setResult, router]
  );

  if (!isValidStep || !question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">無効なステップです</p>
        <Link href="/diagnosis/1" className="text-primary font-medium hover:underline">
          最初から始める
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4 inline-block"
          >
            ← ホームに戻る
          </Link>
          <ProgressBar current={stepNum} total={16} />
        </div>

        {/* Question card */}
        <QuestionCard
          key={stepNum}
          questionText={question.questionText}
          guideText={question.guideText}
          categoryLabel={ANXIETY_TYPE_LABELS[question.anxietyType]}
          selectedAnswer={answers[stepNum - 1]}
          onAnswer={handleAnswer}
        />

        {/* Navigation hint */}
        {stepNum > 1 && (
          <div className="mt-4 text-center">
            <button
              onClick={() => router.back()}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← 前の質問に戻る
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
