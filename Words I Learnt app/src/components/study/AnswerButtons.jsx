import React from 'react';

export default function AnswerButtons({ onAnswer }) {
  return (
    <div className="flex animate-in fade-in slide-in-from-bottom-2 flex-col gap-3 duration-300">
      <button
        type="button"
        onClick={() => onAnswer(false)}
        className="h-14 w-full rounded-full bg-gray-200 text-[17px] font-semibold text-gray-700 transition-transform duration-150 active:scale-[0.98]"
      >
        Didn&apos;t Know
      </button>
      <button
        type="button"
        onClick={() => onAnswer(true)}
        className="h-14 w-full rounded-full bg-[#007AFF] text-[17px] font-semibold text-white shadow-sm transition-transform duration-150 active:scale-[0.98]"
      >
        Knew It
      </button>
    </div>
  );
}