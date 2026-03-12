'use client';

import { getAdviceByTypeId } from '@/constants/adviceContent';

interface AdviceChecklistProps {
  typeId: string;
}

export default function AdviceChecklist({ typeId }: AdviceChecklistProps) {
  const items = getAdviceByTypeId(typeId);

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <span className="mt-1 text-primary flex-shrink-0">•</span>
          <span className="text-sm leading-relaxed text-gray-700">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
