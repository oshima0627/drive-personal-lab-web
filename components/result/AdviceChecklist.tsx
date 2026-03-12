'use client';

import { getAdviceByTypeId } from '@/constants/adviceContent';
import { useResultStore } from '@/stores/resultStore';
import { buildAdviceXShareUrl } from '@/lib/shareUtils';
import { ADVICE_CONTENT } from '@/constants/adviceContent';

interface AdviceChecklistProps {
  typeId: string;
  checkedIds: string[];
}

export default function AdviceChecklist({ typeId, checkedIds }: AdviceChecklistProps) {
  const toggleAdvice = useResultStore((s) => s.toggleAdvice);
  const items = getAdviceByTypeId(typeId);

  const handleShareChecked = () => {
    const checkedTexts = checkedIds
      .map((id) => ADVICE_CONTENT.find((a) => a.id === id)?.text)
      .filter(Boolean) as string[];
    if (checkedTexts.length === 0) return;
    const url = buildAdviceXShareUrl(checkedTexts);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <ul className="flex flex-col gap-3 mb-5">
        {items.map((item) => {
          const checked = checkedIds.includes(item.id);
          return (
            <li key={item.id}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleAdvice(item.id)}
                  className="mt-1 w-5 h-5 rounded border-2 border-primary accent-primary cursor-pointer flex-shrink-0"
                  aria-label={item.text}
                />
                <span
                  className={`text-sm leading-relaxed transition-colors ${
                    checked ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}
                >
                  {item.text}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {checkedIds.length > 0 && (
        <button
          onClick={handleShareChecked}
          className="w-full py-3 px-4 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
        >
          <span>実践する一歩をXでシェア</span>
        </button>
      )}
    </div>
  );
}
