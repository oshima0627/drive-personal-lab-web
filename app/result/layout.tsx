import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運転不安タイプ診断 | 運転パーソナルラボ',
  description:
    'ペーパードライバー・運転初心者向け。知識・技術・経験・環境の4分類で運転不安をセルフ診断。あなたのタイプを無料で診断しよう。',
  openGraph: {
    title: '運転不安タイプ診断 | 運転パーソナルラボ',
    description:
      'ペーパードライバー・運転初心者向け。知識・技術・経験・環境の4分類で運転不安をセルフ診断。',
    url: 'https://drive-personal-lab-web.vercel.app/result',
    siteName: '運転パーソナルラボ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '運転不安タイプ診断 | 運転パーソナルラボ',
    description: 'ペーパードライバー・運転初心者向け。運転不安を4分類で無料診断。',
  },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
