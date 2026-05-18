/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AgeRatingBadgeProps {
  rating: number;
}

export default function AgeRatingBadge({ rating }: AgeRatingBadgeProps) {
  if (rating === 0) return (
    <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center font-black text-white text-xs">L</div>
  );
  
  const config = {
    14: { bg: 'bg-yellow-500', text: '14' },
    16: { bg: 'bg-red-600', text: '16' },
    18: { bg: 'bg-black border border-white/20', text: '18' }
  }[rating as 14 | 16 | 18] || { bg: 'bg-black', text: rating.toString() };

  return (
    <div className={`w-8 h-8 ${config.bg} rounded flex items-center justify-center font-black text-white text-xs flex-shrink-0 shadow-lg`}>
      {config.text}
    </div>
  );
}
