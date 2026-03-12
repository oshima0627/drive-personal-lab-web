'use client';

import { useState } from 'react';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';

interface DiagnosisResult {
  id: string;
  taken_at: string;
  type_id: string;
  scores: { knowledge: number; skill: number; experience: number; environment: number };
  raw_answers: number[];
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [results, setResults] = useState<DiagnosisResult[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/results', {
      headers: { Authorization: `Bearer ${password}` },
    });

    setLoading(false);

    if (res.status === 401) {
      setError('パスワードが正しくありません');
      return;
    }
    if (!res.ok) {
      setError('データの取得に失敗しました');
      return;
    }

    const { results: data } = await res.json();
    setResults(data);
  };

  if (results === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-sm">
          <h1 className="text-xl font-bold text-gray-800 mb-6">管理者ログイン</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-white py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? '確認中...' : 'ログイン'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-800">診断結果一覧</h1>
          <span className="text-sm text-gray-500">{results.length} 件</span>
        </div>

        {results.length === 0 ? (
          <p className="text-gray-500 text-center py-12">まだ診断結果がありません</p>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">日時</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-medium">タイプ</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">知識</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">技術</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">経験</th>
                    <th className="text-right px-4 py-3 text-gray-500 font-medium">環境</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((r) => {
                    const type = getAnxietyTypeById(r.type_id);
                    const date = new Date(r.taken_at);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {date.toLocaleDateString('ja-JP')}
                          <span className="text-gray-400 ml-2">
                            {date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-gray-800">
                            {type?.name ?? r.type_id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">{r.scores.knowledge}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{r.scores.skill}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{r.scores.experience}</td>
                        <td className="px-4 py-3 text-right text-gray-700">{r.scores.environment}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
