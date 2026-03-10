import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

export const alt = '運転パーソナルラボ｜運転不安タイプ診断';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#EFF6FF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
          gap: '0px',
        }}
      >
        {/* サービス名 */}
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: '#1D4ED8',
            letterSpacing: 4,
            marginBottom: 24,
          }}
        >
          運転パーソナルラボ
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: '#1E3A5F',
            textAlign: 'center',
            lineHeight: 1.3,
            marginBottom: 32,
          }}
        >
          運転不安は、4つのタイプに分けられる。
        </div>

        {/* 4タイプバッジ */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginBottom: 40,
          }}
        >
          {['知識', '技術', '経験', '環境'].map((label) => (
            <div
              key={label}
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #BFDBFE',
                borderRadius: 12,
                padding: '10px 24px',
                fontSize: 26,
                fontWeight: 700,
                color: '#1D4ED8',
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 28,
            color: '#374151',
            backgroundColor: '#FFFFFF',
            padding: '16px 48px',
            borderRadius: 16,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          あなたも1分で診断してみる →
        </div>

        {/* ハッシュタグ */}
        <div
          style={{
            fontSize: 20,
            color: '#9CA3AF',
            marginTop: 28,
          }}
        >
          #運転パーソナルラボ #ペーパードライバー
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
