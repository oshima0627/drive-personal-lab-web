import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: '1分で簡単診断 | 運転パーソナルラボ',
  description:
    'ペーパードライバー・運転初心者向け。知識・技術・経験・環境の4分類で運転不安をセルフ診断。あなたのタイプを無料で診断。',
  openGraph: {
    title: '1分で簡単診断 | 運転パーソナルラボ',
    description:
      'ペーパードライバー・運転初心者向け。知識・技術・経験・環境の4分類で運転不安をセルフ診断。',
    url: 'https://drive-personal-lab-web.vercel.app',
    siteName: '運転パーソナルラボ',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '1分で簡単診断 | 運転パーソナルラボ',
    description: 'ペーパードライバー・運転初心者向け運転不安セルフ診断アプリ。',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: '運転パーソナルラボ',
              description: '運転不安セルフ診断アプリ',
              applicationCategory: 'HealthApplication',
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
