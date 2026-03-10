'use client';

interface CategoryDetail {
  key: string;
  label: string;
  color: string;
  score: number;
  comment: string;
  description: string;
}

interface DetailSectionProps {
  scores: {
    knowledge: number;
    skill: number;
    experience: number;
    environment: number;
  };
}

const CATEGORY_DETAILS: Omit<CategoryDetail, 'score'>[] = [
  {
    key: 'knowledge',
    label: '知識不安',
    color: '#1976D2',
    comment: '「どうすればいいか分からない」という感覚、とても自然です。',
    description:
      'ルールや標識の意味があいまいなまま運転するのは誰でも不安です。知識を整理するだけで気持ちがラクになることがあります。',
  },
  {
    key: 'skill',
    label: '技術不安',
    color: '#7B1FA2',
    comment: '「体がうまく動かせるか」という心配、よく聞くお悩みです。',
    description:
      '頭では分かっていても体が追いつかない感覚は、経験を重ねることで少しずつ変わっていきます。',
  },
  {
    key: 'experience',
    label: '経験不安',
    color: '#C62828',
    comment: '過去の体験が今も残っているのですね。それだけ真剣に向き合ってきた証です。',
    description:
      '怖い記憶は消えなくても、新しい安心できる経験が少しずつ上書きされていきます。',
  },
  {
    key: 'environment',
    label: '環境不安',
    color: '#2E7D32',
    comment: '「一人でいざとなったら」という不安、すごく共感できます。',
    description:
      '誰かがいる安心感はとても大切です。その感覚を大切にしながら、少しずつ慣れていける方法を一緒に考えましょう。',
  },
];

export default function DetailSection({ scores }: DetailSectionProps) {
  const categories: CategoryDetail[] = CATEGORY_DETAILS.map((cat) => ({
    ...cat,
    score: scores[cat.key as keyof typeof scores],
  }));

  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => {
        // 各分類12点満点のうち6点以上（= 50点以上）を不安ありと判定
        const isHigh = cat.score >= 50;
        return (
          <div
            key={cat.key}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="font-semibold text-gray-800">{cat.label}</span>
              </div>
              <span className="text-xl font-bold" style={{ color: cat.color }}>
                {cat.score}点
              </span>
            </div>

            {/* Score bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${cat.score}%`,
                  backgroundColor: cat.color,
                }}
              />
            </div>

            {/* Content */}
            {isHigh ? (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{cat.comment}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">
                今のところ、この分野はあまり気になっていないようです
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
