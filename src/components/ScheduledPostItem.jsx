import React from 'react';
import { ClockIcon } from './icons';

const ScheduledPostItem = ({ post, onPostClick }) => {
  const isCancelled = post.status === 'cancelled';

  return (
    <div 
      onClick={() => onPostClick(post)}
      className={`relative bg-teal-100 p-1.5 rounded-md border-l-4 border-teal-500 text-xs text-gray-800 transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 ${isCancelled ? 'border-gray-400 opacity-60' : ''}`}
    >
      <img src={post.images[0].url} alt="Scheduled post" className="w-full h-12 object-cover rounded-sm mb-1" />
      <div className="flex items-center gap-1">
        <ClockIcon className="h-3 w-3 text-gray-600" />
        <span>{post.time}</span>
      </div>
      <p className="truncate font-medium">{post.caption || 'Tanpa caption'}</p>

      {isCancelled && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md">
            <span className="bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">DIBATALKAN</span>
        </div>
      )}
    </div>
  );
};

export default ScheduledPostItem;