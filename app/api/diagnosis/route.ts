import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { takenAt, scores, typeId, rawAnswers } = await req.json();

  const { error } = await supabase.from('diagnosis_results').insert({
    taken_at: takenAt,
    type_id: typeId,
    scores,
    raw_answers: rawAnswers,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
