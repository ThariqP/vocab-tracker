import React from 'react';

export default function SessionProgress({ done, total, known }) {
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="flex items-baseline justify-between text-sm text-gray-500">
        <span className="font-medium text-gray-900">
          {done} of {total} today
        </span>
        <span>{known} knew it</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-[#007AFF] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}