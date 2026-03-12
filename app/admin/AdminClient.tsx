'use client';

import { useState } from 'react';

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

export default function AdminClient({ contacts, diagnoses }: Props) {
  const [tab, setTab] = useState<'contacts' | 'diagnoses'>('contacts');

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
                    {Object.entries(c.scores).map(([k, v]) => (
                      <div key={k} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                        <p className="text-xs text-gray-500">{SCORE_LABELS[k] ?? k}</p>
                        <p className="text-sm font-bold text-gray-800">{v}</p>
                      </div>
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
                {diagnoses.map((d, i) => (
                  <tr key={d.id} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(d.taken_at)}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{d.type_id}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{d.scores?.knowledge ?? '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{d.scores?.skill ?? '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{d.scores?.experience ?? '-'}</td>
                    <td className="px-3 py-3 text-center text-gray-700">{d.scores?.environment ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
