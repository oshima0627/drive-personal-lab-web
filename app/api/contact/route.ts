import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { nickname, email, diagnosisType, diagnosisDescription, scores } = await req.json();

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
${diagnosisDescription}${scoresText}
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('メール送信エラー:', error);
    return NextResponse.json({ error: 'メール送信に失敗しました' }, { status: 500 });
  }
}
