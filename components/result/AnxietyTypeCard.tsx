'use client';

import { AnxietyTypeDefinition } from '@/constants/anxietyTypes';

interface AnxietyTypeCardProps {
  type: AnxietyTypeDefinition;
}

export default function AnxietyTypeCard({ type }: AnxietyTypeCardProps) {
  return (
    <div
      className="rounded-2xl border-2 p-6 bg-white shadow-sm"
      style={{ borderColor: type.color }}
    >
      {/* Type label */}
      <div
        className="inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
        style={{ backgroundColor: type.color }}
      >
        あなたのタイプ
      </div>

      {/* Type name */}
      <h2
        className="text-2xl font-bold mb-3"
        style={{ color: type.color }}
      >
        {type.name}
      </h2>

      {/* Comment */}
      <p className="text-base text-gray-700 leading-relaxed mb-3 font-medium">
        {type.comment}
      </p>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {type.description}
      </p>
    </div>
  );
}
