import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { QUESTIONS, ANSWER_OPTIONS } from '@/constants/questions';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
  const { nickname, email, diagnosisType, diagnosisDescription, scores, rawAnswers } = await req.json();

  if (!nickname || !email) {
    return NextResponse.json({ error: 'ニックネームとメールアドレスは必須です' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const scoresText = scores
    ? `\n【不安度スコア】\n知識不安: ${scores.knowledge}\n技術不安: ${scores.skill}\n経験不安: ${scores.experience}\n環境不安: ${scores.environment}`
    : '';

  const answersText =
    Array.isArray(rawAnswers) && rawAnswers.length > 0
      ? '\n【16問の回答】\n' +
        QUESTIONS.map((q) => {
          const score = rawAnswers[q.orderIndex - 1] ?? 0;
          const label = ANSWER_OPTIONS.find((o) => o.score === score)?.label ?? '—';
          return `Q${q.id}. ${q.questionText}\n  → ${label}`;
        }).join('\n')
      : '';

  const mailOptions = {
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
    replyTo: email,
    subject: `【オンライン診断申し込み】${nickname} さんからのお申し込み`,
    text: `オンライン診断のお申し込みがありました。

【ニックネーム】
${nickname}

【メールアドレス】
${email}

【診断結果タイプ】
${diagnosisType}

【タイプの説明】
${diagnosisDescription}${scoresText}${answersText}
`,
  };

  try {
    await transporter.sendMail(mailOptions);

    // Supabase に申し込み内容を保存
    await supabaseAdmin.from('contact_submissions').insert({
      nickname,
      email,
      diagnosis_type: diagnosisType,
      diagnosis_description: diagnosisDescription,
      scores: scores ?? null,
      raw_answers: rawAnswers ?? null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
  }
}
