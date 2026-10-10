import React from 'react';
import { Check } from 'lucide-react';

export default function SessionComplete({ known, total }) {
  return (
    <div className="flex flex-1 animate-in fade-in zoom-in-95 flex-col items-center justify-center pb-16 text-center duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#007AFF]/10">
        <Check className="h-10 w-10 text-[#007AFF]" strokeWidth={2.5} />
      </div>
      <h2 className="mt-7 text-3xl font-semibold tracking-tight text-gray-900">
        All done for today!
      </h2>
      <p className="mt-3 text-base leading-relaxed text-gray-500">
        You reviewed {total} {total === 1 ? 'word' : 'words'} and knew {known} of them.
      </p>
      <p className="mt-10 text-sm text-gray-400">Come back tomorrow for your next 20.</p>
    </div>
  );
}