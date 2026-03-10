export type AnxietyKey = 'knowledge' | 'skill' | 'experience' | 'environment';
export type Scores = Record<AnxietyKey, number>; // 各 0〜100

export function calcScores(answers: number[]): Scores {
  // Q1〜4  → knowledge  合計(0〜12) → Math.round(合計/12*100)
  // Q5〜8  → skill
  // Q9〜12 → experience
  // Q13〜16→ environment
  const knowledge = answers.slice(0, 4).reduce((sum, v) => sum + v, 0);
  const skill = answers.slice(4, 8).reduce((sum, v) => sum + v, 0);
  const experience = answers.slice(8, 12).reduce((sum, v) => sum + v, 0);
  const environment = answers.slice(12, 16).reduce((sum, v) => sum + v, 0);

  return {
    knowledge: Math.round((knowledge / 12) * 100),
    skill: Math.round((skill / 12) * 100),
    experience: Math.round((experience / 12) * 100),
    environment: Math.round((environment / 12) * 100),
  };
}

export function resolveTypeId(scores: Scores): string {
  const HIGH = 60;
  const LOW_MAX = 40;

  // 低不安タイプ判定：全分類の最高スコアが40点未満
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore < LOW_MAX) {
    return scores.experience >= 17 ? 'low_confident' : 'low_unsure';
  }

  const high: AnxietyKey[] = (Object.keys(scores) as AnxietyKey[]).filter(
    (k) => scores[k] >= HIGH
  );

  if (high.length === 4) return 'all';

  if (high.length === 3) {
    const s = new Set(high);
    if (!s.has('environment')) return 'kn_sk_ex';
    if (!s.has('experience')) return 'kn_sk_en';
    if (!s.has('skill')) return 'kn_ex_en';
    return 'sk_ex_en';
  }

  if (high.length === 2) {
    const map: Record<string, string> = {
      'knowledge,skill': 'kn_sk',
      'knowledge,experience': 'kn_ex',
      'knowledge,environment': 'kn_en',
      'skill,experience': 'sk_ex',
      'skill,environment': 'sk_en',
      'experience,environment': 'ex_en',
    };
    return map[high.sort().join(',')];
  }

  if (high.length === 1) return high[0];

  // 0分類：最高スコアの単独タイプ
  return (Object.keys(scores) as AnxietyKey[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b
  );
}
