import { ImageResponse } from '@vercel/og';
import { getAnxietyTypeById } from '@/constants/anxietyTypes';

export const runtime = 'edge';

export const alt = 'Drive Personal Lab 診断結果';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params?: { type?: string } }) {
  const typeId = params?.type ?? 'knowledge';
  const anxietyType = getAnxietyTypeById(typeId);
  const typeName = anxietyType?.name ?? '診断結果';
  const typeColor = anxietyType?.color ?? '#1565C0';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          backgroundColor: '#F0F4FF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        {/* App name */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#1565C0',
            marginBottom: 20,
            letterSpacing: 2,
          }}
        >
          Drive Personal Lab
        </div>

        {/* Label */}
        <div
          style={{
            fontSize: 28,
            color: '#6B7280',
            marginBottom: 24,
          }}
        >
          あなたの運転不安タイプは
        </div>

        {/* Type name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: typeColor,
            marginBottom: 40,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {typeName}
        </div>

        {/* CTA */}
        <div
          style={{
            fontSize: 28,
            color: '#374151',
            backgroundColor: '#FFFFFF',
            padding: '16px 40px',
            borderRadius: 16,
            fontWeight: 600,
          }}
        >
          あなたも診断してみる →
        </div>

        {/* Hashtag */}
        <div
          style={{
            fontSize: 20,
            color: '#9CA3AF',
            marginTop: 32,
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
