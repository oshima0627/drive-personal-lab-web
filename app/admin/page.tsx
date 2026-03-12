import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { pw?: string };
}) {
  const cookieStore = cookies();
  const authed = cookieStore.get('admin_authed')?.value === 'true';

  // パスワード認証
  if (!authed) {
    const pw = searchParams.pw;
    if (!pw || pw !== process.env.ADMIN_PASSWORD) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <form method="GET" action="/admin" className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
            <h1 className="text-lg font-bold text-gray-800 mb-6 text-center">管理者ログイン</h1>
            <input
              type="password"
              name="pw"
              placeholder="パスワードを入力"
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-blue-800 transition-colors"
            >
              ログイン
            </button>
          </form>
        </div>
      );
    }
    // 認証成功 → Cookie をセットしてリダイレクト
    cookieStore.set('admin_authed', 'true', { httpOnly: true, maxAge: 60 * 60 * 8 });
    redirect('/admin');
  }

  // データ取得
  const [{ data: contacts }, { data: diagnoses }] = await Promise.all([
    supabaseAdmin
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200),
    supabaseAdmin
      .from('diagnosis_results')
      .select('*')
      .order('taken_at', { ascending: false })
      .limit(200),
  ]);

  return <AdminClient contacts={contacts ?? []} diagnoses={diagnoses ?? []} />;
}
