'use client';

import { useState } from 'react';
import { AnxietyTypeDefinition } from '@/constants/anxietyTypes';
import AnswersSummary from '@/components/result/AnswersSummary';

interface Scores {
  knowledge: number;
  skill: number;
  experience: number;
  environment: number;
}

interface Props {
  anxietyType: AnxietyTypeDefinition;
  scores?: Scores;
  rawAnswers?: number[];
  onClose: () => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function OnlineDiagnosisModal({ anxietyType, scores, rawAnswers, onClose }: Props) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nickname,
          email,
          diagnosisType: anxietyType.name,
          diagnosisDescription: anxietyType.description,
          scores,
          rawAnswers,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMessage(data.error ?? '送信に失敗しました');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMessage('ネットワークエラーが発生しました');
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">✅</div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">お申し込みありがとうございます</h2>
            <p className="text-sm text-gray-500 mb-6">
              担当者よりご連絡いたします。しばらくお待ちください。
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-blue-800 transition-colors"
            >
              閉じる
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-gray-800">オンライン診断に申し込む</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                aria-label="閉じる"
              >
                ✕
              </button>
            </div>

            {/* 診断結果の表示 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-500 mb-1">診断結果</p>
              <p className="text-sm font-bold text-primary">{anxietyType.name}</p>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">{anxietyType.description}</p>
              {scores && (
                <div className="grid grid-cols-2 gap-1 mt-2">
                  {[
                    { label: '知識不安', value: scores.knowledge },
                    { label: '技術不安', value: scores.skill },
                    { label: '経験不安', value: scores.experience },
                    { label: '環境不安', value: scores.environment },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-xs text-gray-500">
                      <span>{label}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              )}
              {rawAnswers && rawAnswers.length > 0 && (
                <div className="mt-3">
                  <AnswersSummary rawAnswers={rawAnswers} />
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ニックネーム <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  required
                  placeholder="例: たろう"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="例: taro@example.com"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {status === 'error' && (
                <p className="text-sm text-red-500">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="bg-primary text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'sending' ? '送信中...' : '申し込みを送信する'}
              </button>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
