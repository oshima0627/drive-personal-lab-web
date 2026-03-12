import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { typeId, scores, rawAnswers, takenAt } = await req.json();

  if (!typeId || !scores) {
    return NextResponse.json({ error: 'typeId and scores are required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from('diagnosis_results').insert({
    type_id: typeId,
    scores,
    raw_answers: rawAnswers ?? null,
    taken_at: takenAt ?? new Date().toISOString(),
  });

  if (error) {
    console.error('診断結果保存エラー:', error);
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
