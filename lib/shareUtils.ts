const BASE_URL = 'https://drive-personal-lab-web.vercel.app';

// X（旧Twitter）シェア
export function buildXShareUrl(typeId: string, typeName: string): string {
  const text = encodeURIComponent(
    `私の運転不安タイプは「${typeName}」でした。\n` +
      `あなたはどのタイプ？運転不安を4分類で診断してみよう。\n` +
      `#運転パーソナルラボ #ペーパードライバー\n`
  );
  const url = encodeURIComponent(`${BASE_URL}/result?type=${typeId}`);
  return `https://x.com/intent/tweet?text=${text}&url=${url}`;
}

// LINEシェア
export function buildLineShareUrl(typeId: string, typeName: string): string {
  const message = encodeURIComponent(
    `私の運転不安タイプは「${typeName}」でした。\n` +
      `${BASE_URL}/result?type=${typeId}`
  );
  return `https://line.me/R/msg/text/?${message}`;
}

// 結果ページのシェアURL
export function buildShareUrl(typeId: string): string {
  return `${BASE_URL}/result?type=${typeId}`;
}

// 選んだアドバイスのシェアURL（LINE）
export function buildAdviceLineShareUrl(adviceTexts: string[]): string {
  const adviceList = adviceTexts.map((t) => `・${t}`).join('\n');
  const message = encodeURIComponent(
    `私が実践する運転不安への一歩：\n${adviceList}\n#運転パーソナルラボ`
  );
  return `https://line.me/R/msg/text/?${message}`;
}
