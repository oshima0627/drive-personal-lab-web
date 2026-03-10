export type AnxietyType = 'knowledge' | 'skill' | 'experience' | 'environment';

export interface Question {
  id: number;
  anxietyType: AnxietyType;
  questionText: string;
  orderIndex: number;
  guideText?: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    anxietyType: 'knowledge',
    questionText: '交差点での優先順位が分からなくなることがありますか？',
    orderIndex: 1,
  },
  {
    id: 2,
    anxietyType: 'knowledge',
    questionText: '道路標識の意味が分からず困ることがありますか？',
    orderIndex: 2,
  },
  {
    id: 3,
    anxietyType: 'knowledge',
    questionText: '高速道路の合流・車線変更のルールが不安になることがありますか？',
    orderIndex: 3,
  },
  {
    id: 4,
    anxietyType: 'knowledge',
    questionText: '駐車・停車のルールがあいまいだと感じることがありますか？',
    orderIndex: 4,
  },
  {
    id: 5,
    anxietyType: 'skill',
    questionText: 'ハンドル操作がうまくできるか不安になることがありますか？',
    orderIndex: 5,
  },
  {
    id: 6,
    anxietyType: 'skill',
    questionText: '縦列駐車・車庫入れに強い苦手意識がありますか？',
    orderIndex: 6,
  },
  {
    id: 7,
    anxietyType: 'skill',
    questionText: '車線変更やカーブで体が硬くなる感覚がありますか？',
    orderIndex: 7,
  },
  {
    id: 8,
    anxietyType: 'skill',
    questionText: 'ブレーキやアクセルの踏み加減が難しいと感じますか？',
    orderIndex: 8,
  },
  {
    id: 9,
    anxietyType: 'experience',
    questionText: '運転中に怖いと感じた・感じそうな場面を思い浮かべることがありますか？',
    orderIndex: 9,
    guideText: '※ まだ運転経験が少ない方は、想像や予感として感じるかどうかで答えてください',
  },
  {
    id: 10,
    anxietyType: 'experience',
    questionText: 'ぶつけたり・こすったりするかもという不安が、運転への自信に影響していますか？',
    orderIndex: 10,
  },
  {
    id: 11,
    anxietyType: 'experience',
    questionText: '運転中のヒヤリとした場面（実際・想像問わず）が頭に浮かぶことがありますか？',
    orderIndex: 11,
  },
  {
    id: 12,
    anxietyType: 'experience',
    questionText: '「同じ失敗をするかも」「怖い場面になるかも」と想像して不安になることがありますか？',
    orderIndex: 12,
  },
  {
    id: 13,
    anxietyType: 'environment',
    questionText: '助手席に誰かいないと運転できないと感じますか？',
    orderIndex: 13,
  },
  {
    id: 14,
    anxietyType: 'environment',
    questionText: '一人で知らない道を走ることを想像するとためらいますか？',
    orderIndex: 14,
  },
  {
    id: 15,
    anxietyType: 'environment',
    questionText: '緊急時（パンク・事故）に一人で対応できるか不安ですか？',
    orderIndex: 15,
  },
  {
    id: 16,
    anxietyType: 'environment',
    questionText: '「何かあったとき誰もいない」という状況が怖いですか？',
    orderIndex: 16,
  },
];

export const ANSWER_OPTIONS = [
  { label: '全く感じない', score: 0 },
  { label: '少し感じる', score: 1 },
  { label: 'かなり感じる', score: 2 },
  { label: '非常に感じる', score: 3 },
];

export const ANXIETY_TYPE_LABELS: Record<AnxietyType, string> = {
  knowledge: '知識について',
  skill: '技術について',
  experience: '経験について',
  environment: '環境について',
};
