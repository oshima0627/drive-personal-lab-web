'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useResultStore } from '@/stores/resultStore';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';
import { getAdviceByTypeId } from '@/constants/adviceContent';
import RadarChart from '@/components/result/RadarChart';
import AnxietyTypeCard from '@/components/result/AnxietyTypeCard';
import AdviceChecklist from '@/components/result/AdviceChecklist';
import DetailSection from '@/components/result/DetailSection';
import ShareButtons from '@/components/result/ShareButtons';

const SCORE_LABELS: Record<string, string> = {
  knowledge: '知識',
  skill: '技術',
  experience: '経験',
  environment: '環境',
};

const SCORE_COLORS: Record<string, string> = {
  knowledge: '#1976D2',
  skill: '#7B1FA2',
  experience: '#C62828',
  environment: '#2E7D32',
};

export default function ResultContent() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  const result = useResultStore((s) => s.result);
  const [mounted, setMounted] = useState(false);

  const adviceSectionRef = useRef<HTMLDivElement>(null);
  const detailSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Shared URL mode: show type info without scores
  const isSharedMode = !!typeParam;

  // Determine typeId
  const typeId = isSharedMode ? typeParam : result?.typeId;
  const anxietyType = typeId ? getAnxietyTypeById(typeId) : null;

  const scrollToAdvice = () => {
    adviceSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToDetail = () => {
    detailSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">読み込み中...</div>
      </div>
    );
  }

  if (!typeId || !anxietyType) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-4">
        <p className="text-gray-500">診断結果が見つかりませんでした</p>
        <Link
          href="/diagnosis/1"
          className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-800 transition-colors"
        >
          診断を始める
        </Link>
      </div>
    );
  }

  const checkedAdviceIds = result?.checkedAdviceIds ?? [];
  const sharedAdviceItems = isSharedMode ? getAdviceByTypeId(anxietyType.id) : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← ホーム
          </Link>
          <h1 className="text-lg font-bold text-gray-700">診断結果</h1>
          <div className="w-16" />
        </div>

        {/* Shared URL mode banner */}
        {isSharedMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-center">
            <p className="text-sm text-blue-700 mb-3 font-medium">
              シェアされた診断結果を表示しています
            </p>
            <Link
              href="/diagnosis/1"
              className="inline-block bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
            >
              あなたも診断してみる →
            </Link>
          </div>
        )}

        {/* Radar chart (only in normal mode) */}
        {!isSharedMode && result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
            <h2 className="text-sm font-semibold text-gray-500 mb-3 text-center">
              4分類スコア
            </h2>
            <RadarChart scores={result.scores} />
            {/* Score badges */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              {Object.entries(result.scores).map(([key, score]) => (
                <div
                  key={key}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="text-xs font-medium text-gray-600">
                    {SCORE_LABELS[key]}
                  </span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: SCORE_COLORS[key] }}
                  >
                    {score}点
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Type card */}
        <div className="mb-5">
          <AnxietyTypeCard type={anxietyType} />
        </div>

        {/* Action buttons (normal mode) */}
        {!isSharedMode && (
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={scrollToAdvice}
              className="py-3 px-4 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors"
            >
              次の一歩を考える
            </button>
            <button
              onClick={scrollToDetail}
              className="py-3 px-4 bg-white border-2 border-primary text-primary rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
            >
              詳細を見る
            </button>
          </div>
        )}

        {/* Share buttons */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">結果をシェア</h2>
          <ShareButtons typeId={anxietyType.id} typeName={anxietyType.name} />
        </div>

        {/* Advice section (normal mode only) */}
        {!isSharedMode && (
          <div
            ref={adviceSectionRef}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5"
          >
            <h2 className="text-base font-bold text-gray-800 mb-1">次の一歩を考える</h2>
            <p className="text-xs text-gray-400 mb-4">
              気になるアドバイスにチェックを入れてみましょう
            </p>
            <AdviceChecklist typeId={anxietyType.id} checkedIds={checkedAdviceIds} />
          </div>
        )}

        {/* Advice section (shared mode) */}
        {isSharedMode && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-1">次の一歩のヒント</h2>
            <p className="text-xs text-gray-400 mb-4">
              自分で診断してからチェックしてみましょう
            </p>
            <div className="flex flex-col gap-3">
              {sharedAdviceItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detail section (normal mode only) */}
        {!isSharedMode && result && (
          <div ref={detailSectionRef} className="mb-5">
            <h2 className="text-base font-bold text-gray-800 mb-3">分類別の詳細</h2>
            <DetailSection scores={result.scores} />
          </div>
        )}

        {/* Retry button */}
        <div className="text-center mb-8">
          <Link
            href="/diagnosis/1"
            className="inline-block text-sm text-gray-400 hover:text-primary transition-colors font-medium"
          >
            もう一度診断する
          </Link>
        </div>
      </div>
    </div>
  );
}
