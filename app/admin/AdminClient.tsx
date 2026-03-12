'use client';

import { useState } from 'react';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';
import { QUESTIONS, ANSWER_OPTIONS, ANXIETY_TYPE_LABELS } from '@/constants/questions';

interface ContactSubmission {
  id: string;
  nickname: string;
  email: string;
  diagnosis_type: string;
  diagnosis_description: string;
  scores: Record<string, number> | null;
  raw_answers: number[] | null;
  created_at: string;
}

interface DiagnosisResult {
  id: string;
  type_id: string;
  scores: Record<string, number>;
  raw_answers: number[] | null;
  taken_at: string;
}

interface Props {
  contacts: ContactSubmission[];
  diagnoses: DiagnosisResult[];
}

const SCORE_KEYS = ['knowledge', 'skill', 'experience', 'environment'] as const;
const SCORE_LABELS: Record<string, string> = {
  knowledge: '知識',
  skill: '技術',
  experience: '経験',
  environment: '環境',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function ScoreBadge({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="bg-gray-50 rounded-lg px-3 py-2 text-center">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-800">{value ?? '-'}</p>
    </div>
  );
}

function DiagnosisDetailModal({ d, onClose }: { d: DiagnosisResult; onClose: () => void }) {
  const anxietyType = getAnxietyTypeById(d.type_id);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">診断結果 詳細</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* 日時 */}
          <p className="text-xs text-gray-400">{formatDate(d.taken_at)}</p>

          {/* タイプ */}
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">診断タイプ</p>
            <p className="font-bold text-blue-700 text-base">{anxietyType?.name ?? d.type_id}</p>
            {anxietyType && (
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{anxietyType.description}</p>
            )}
          </div>

          {/* スコア */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">不安度スコア</p>
            <div className="grid grid-cols-4 gap-2">
              {SCORE_KEYS.map((k) => (
                <ScoreBadge key={k} label={SCORE_LABELS[k]} value={d.scores?.[k]} />
              ))}
            </div>
          </div>

          {/* 16問の回答 */}
          {d.raw_answers && d.raw_answers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3">16問の回答</p>
              <div className="flex flex-col gap-2">
                {QUESTIONS.map((q) => {
                  const score = d.raw_answers![q.orderIndex - 1] ?? 0;
                  const label = ANSWER_OPTIONS.find((o) => o.score === score)?.label ?? '—';
                  const intensity =
                    score === 0 ? 'text-gray-400' :
                    score === 1 ? 'text-yellow-600' :
                    score === 2 ? 'text-orange-500' : 'text-red-600';
                  return (
                    <div key={q.id} className="flex items-start gap-3 bg-gray-50 rounded-xl px-4 py-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold mt-0.5">
                        {q.id}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 mb-0.5">{ANXIETY_TYPE_LABELS[q.anxietyType]}</p>
                        <p className="text-sm text-gray-700">{q.questionText}</p>
                      </div>
                      <span className={`text-xs font-semibold whitespace-nowrap mt-1 ${intensity}`}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminClient({ contacts, diagnoses }: Props) {
  const [tab, setTab] = useState<'contacts' | 'diagnoses'>('contacts');
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<DiagnosisResult | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">管理画面</h1>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← サイトへ戻る</a>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('contacts')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'contacts'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            申し込み一覧 ({contacts.length})
          </button>
          <button
            onClick={() => setTab('diagnoses')}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === 'diagnoses'
                ? 'bg-blue-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            診断結果一覧 ({diagnoses.length})
          </button>
        </div>

        {/* Contacts tab */}
        {tab === 'contacts' && (
          <div className="flex flex-col gap-4">
            {contacts.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-10">申し込みはまだありません</p>
            )}
            {contacts.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-800">{c.nickname}</p>
                    <p className="text-sm text-gray-500">{c.email}</p>
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(c.created_at)}</p>
                </div>
                <div className="bg-blue-50 rounded-xl px-4 py-3 mb-3">
                  <p className="text-xs text-gray-500 mb-0.5">診断タイプ</p>
                  <p className="text-sm font-semibold text-blue-700">{c.diagnosis_type}</p>
                  <p className="text-xs text-gray-600 mt-1">{c.diagnosis_description}</p>
                </div>
                {c.scores && (
                  <div className="grid grid-cols-4 gap-2">
                    {SCORE_KEYS.map((k) => (
                      <ScoreBadge key={k} label={SCORE_LABELS[k]} value={c.scores![k]} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Diagnoses tab */}
        {tab === 'diagnoses' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {diagnoses.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-10">診断結果はまだありません</p>
            )}
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">日時</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">タイプ</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-600">知識</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-600">技術</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-600">経験</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-600">環境</th>
                </tr>
              </thead>
              <tbody>
                {diagnoses.map((d, i) => {
                  const typeName = getAnxietyTypeById(d.type_id)?.name ?? d.type_id;
                  return (
                    <tr
                      key={d.id}
                      onClick={() => setSelectedDiagnosis(d)}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50'}`}
                    >
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(d.taken_at)}</td>
                      <td className="px-4 py-3 text-gray-800 font-medium">{typeName}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{d.scores?.knowledge ?? '-'}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{d.scores?.skill ?? '-'}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{d.scores?.experience ?? '-'}</td>
                      <td className="px-3 py-3 text-center text-gray-700">{d.scores?.environment ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedDiagnosis && (
        <DiagnosisDetailModal
          d={selectedDiagnosis}
          onClose={() => setSelectedDiagnosis(null)}
        />
      )}
    </div>
  );
}
