'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useResultStore } from '@/stores/resultStore';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';

const CATEGORY_CARDS = [
  {
    key: 'knowledge',
    label: '知識不安',
    color: '#1976D2',
    bgClass: 'bg-blue-50',
    description: 'ルールや標識の意味があいまい…という不安',
  },
  {
    key: 'skill',
    label: '技術不安',
    color: '#7B1FA2',
    bgClass: 'bg-purple-50',
    description: '体がうまく動かせるか・操作が怖い…という不安',
  },
  {
    key: 'experience',
    label: '経験不安',
    color: '#C62828',
    bgClass: 'bg-red-50',
    description: '過去の怖い経験が頭から離れない…という不安',
  },
  {
    key: 'environment',
    label: '環境不安',
    color: '#2E7D32',
    bgClass: 'bg-green-50',
    description: '一人で運転できるか・緊急時が心配…という不安',
  },
];

export default function HomePage() {
  const result = useResultStore((s) => s.result);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prevType = mounted && result ? getAnxietyTypeById(result.typeId) : null;
  const prevDate = mounted && result
    ? new Date(result.takenAt).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <section className="px-4 pt-16 pb-12 max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
          運転パーソナルラボ
        </h1>
        <p className="text-lg font-semibold text-primary mb-2">
          1分で簡単診断
        </p>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          知識・技術・経験・環境の4分類で<br />
          あなたの運転不安タイプを診断します
        </p>

        {/* Previous result banner */}
        {mounted && result && prevType && (
          <div className="mb-6 bg-white border border-gray-200 rounded-2xl px-5 py-4 text-left shadow-sm">
            <p className="text-xs text-gray-400 mb-1">前回の診断結果</p>
            <p className="text-base font-bold" style={{ color: prevType.color }}>
              {prevType.name}
            </p>
            <p className="text-xs text-gray-400 mt-1">{prevDate}</p>
            <Link
              href="/history"
              className="mt-2 inline-block text-sm text-primary font-medium hover:underline"
            >
              前回の結果を見る →
            </Link>
          </div>
        )}

        <Link
          href="/diagnosis/1"
          className="block w-full bg-primary text-white text-lg font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-800 transition-colors text-center"
        >
          診断を始める
        </Link>

        <p className="mt-4 text-xs text-gray-400">16問・約1分</p>
      </section>

      {/* 4 category cards */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <h2 className="text-center text-base font-semibold text-gray-600 mb-5">
          4つの分類で不安を見える化
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORY_CARDS.map((cat) => (
            <div
              key={cat.key}
              className={`rounded-2xl p-4 ${cat.bgClass} border border-gray-100 shadow-sm`}
            >
              <div
                className="w-8 h-8 rounded-full mb-2"
                style={{ backgroundColor: cat.color, opacity: 0.9 }}
              />
              <p className="font-bold text-sm mb-1" style={{ color: cat.color }}>
                {cat.label}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
