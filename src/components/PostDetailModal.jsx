import React, { useState } from 'react';
import { CloseIcon, ClockIcon, TrashIcon, XCircleIcon, InstagramIcon, FacebookIcon, TikTokIcon } from './icons';
import SocialPreview from './SocialPreview';

const PostDetailModal = ({ post, onClose, onDelete, onToggleStatus }) => {
  const [activePreview, setActivePreview] = useState('instagram');
  if (!post) return null;

  const scheduledDateTime = new Date(`${post.date}T${post.time}`);
  const isPast = scheduledDateTime < new Date();
  const isCancelled = post.status === 'cancelled';

  const statusInfo = {
    scheduled: { text: 'Terjadwal', className: 'bg-blue-100 text-blue-800' },
    cancelled: { text: 'Dibatalkan', className: 'bg-gray-100 text-gray-800' },
    past: { text: 'Telah Diposting', className: 'bg-green-100 text-green-800' }
  };
  
  const currentStatus = isPast ? statusInfo.past : (isCancelled ? statusInfo.cancelled : statusInfo.scheduled);

  const platformIcons = [
    { name: 'instagram', icon: InstagramIcon },
    { name: 'facebook', icon: FacebookIcon },
    { name: 'tiktok', icon: TikTokIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-full max-h-[95vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Detail Postingan</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <CloseIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-grow flex flex-col md:flex-row min-h-0">
            {/* Left Side: Details */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto">
                <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentStatus.className}`}>
                    {currentStatus.text}
                    </span>
                </div>

                <div className="mb-4 flex items-center text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2" />
                    <span>
                    {scheduledDateTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} pukul {post.time}
                    </span>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Caption:</h3>
                    <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-md">{post.caption || "Tidak ada caption."}</p>
                </div>
            </div>

            {/* Right Side: Preview */}
            <div className="w-full md:w-1/2 bg-slate-100 p-6 flex flex-col justify-center items-center overflow-y-auto">
              <div className="w-full max-w-sm mx-auto">
                <div className="flex justify-center items-center gap-2 mb-4 p-1 bg-gray-200 rounded-full">
                  {platformIcons.map(p => (
                    <button 
                      key={p.name}
                      onClick={() => setActivePreview(p.name)}
                      className={`p-2 rounded-full transition-colors duration-200 ${activePreview === p.name ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:bg-gray-300'}`}
                      aria-label={`Preview on ${p.name}`}
                    >
                      <p.icon className="h-6 w-6" />
                    </button>
                  ))}
                </div>
                <SocialPreview 
                  platform={activePreview} 
                  imageUrl={post.images[0]?.url} 
                  caption={post.caption}
                />
              </div>
            </div>
        </div>


        <div className="p-4 border-t bg-gray-50 rounded-b-lg shrink-0">
          {isPast ? (
            <p className="text-center text-sm text-gray-600">Postingan ini sudah melewati waktu jadwalnya dan tidak dapat diubah.</p>
          ) : (
            <div className="flex justify-end gap-3">
              <button
                onClick={onDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Hapus</span>
              </button>
              <button
                onClick={onToggleStatus}
                className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg shadow-sm ${isCancelled ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-500 hover:bg-amber-600'}`}
              >
                <XCircleIcon className="h-5 w-5" />
                <span>{isCancelled ? "Jadwalkan Ulang" : "Batalkan"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;