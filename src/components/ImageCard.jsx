import React from 'react';

const ImageCard = ({ image, onStatusChange }) => {
  const statusClasses = {
    pending: 'border-transparent',
    approved: 'border-green-500 ring-4 ring-green-500/30',
    rejected: 'border-red-500 ring-4 ring-red-500/30',
  };

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg bg-white">
      <img
        src={image.url}
        alt={`Generated image ${image.id}`}
        className={`w-full h-56 bg-slate-100 object-contain transition-transform duration-300 group-hover:scale-105 border-4 ${statusClasses[image.status]}`}
      />
      {image.status === 'rejected' && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-xl font-bold">DITOLAK</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => onStatusChange(image.id, 'approved')}
          className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
        >
          Setuju
        </button>
        <button
          onClick={() => onStatusChange(image.id, 'rejected')}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
        >
          Tolak
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
