'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useResultStore } from '@/stores/resultStore';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';
import { ADVICE_CONTENT } from '@/constants/adviceContent';
import RadarChart from '@/components/result/RadarChart';
import AnxietyTypeCard from '@/components/result/AnxietyTypeCard';

export default function HistoryPage() {
  const result = useResultStore((s) => s.result);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <p className="text-gray-500 text-sm">まだ診断結果がありません</p>
        <Link
          href="/diagnosis/1"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors text-sm"
        >
          診断を始める
        </Link>
      </div>
    );
  }

  const anxietyType = getAnxietyTypeById(result.typeId);
  const takenDate = new Date(result.takenAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const checkedItems = result.checkedAdviceIds
    .map((id) => ADVICE_CONTENT.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← ホーム
          </Link>
          <h1 className="text-lg font-bold text-gray-700">前回の診断結果</h1>
          <div className="w-16" />
        </div>

        {/* Date */}
        <p className="text-center text-xs text-gray-400 mb-5">
          診断日時：{takenDate}
        </p>

        {/* Type card */}
        {anxietyType && (
          <div className="mb-5">
            <AnxietyTypeCard type={anxietyType} />
          </div>
        )}

        {/* Radar chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-3 text-center">
            4分類スコア
          </h2>
          <RadarChart scores={result.scores} />
          <div className="grid grid-cols-2 gap-2 mt-3">
            {Object.entries(result.scores).map(([key, score]) => {
              const LABELS: Record<string, string> = {
                knowledge: '知識',
                skill: '技術',
                experience: '経験',
                environment: '環境',
              };
              const COLORS: Record<string, string> = {
                knowledge: '#1976D2',
                skill: '#7B1FA2',
                experience: '#C62828',
                environment: '#2E7D32',
              };
              return (
                <div
                  key={key}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="text-xs font-medium text-gray-600">
                    {LABELS[key]}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: COLORS[key] }}
                  >
                    {score}点
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checked advice */}
        {checkedItems.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">選んだ一歩</h2>
            <ul className="flex flex-col gap-3">
              {checkedItems.map((item) => item && (
                <li key={item.id} className="flex items-start gap-2">
                  <span
                    className="mt-0.5 flex-shrink-0 text-lg"
                    style={{ color: anxietyType?.color || '#1565C0' }}
                  >
                    ✓
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Re-diagnose button */}
        <div className="text-center mb-8">
          <Link
            href="/diagnosis/1"
            className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    </div>
  );
}
