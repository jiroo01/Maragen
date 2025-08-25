import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon } from './icons';
import SchedulePostModal from './SchedulePostModal';
import ScheduledPostItem from './ScheduledPostItem';
import PostDetailModal from './PostDetailModal';

const SchedulingCalendar = ({ posts = [], onSchedulePost, onDeletePost, onToggleStatus }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Hanya simpan ID postingan di state, bukan seluruh objek.
  // Ini adalah kunci untuk memperbaiki bug state yang usang.
  const [viewingPostId, setViewingPostId] = useState(null);

  // Ambil objek postingan terbaru dari props di setiap render.
  // Ini memastikan modal detail selalu memiliki data yang paling mutakhir.
  const viewingPost = viewingPostId ? posts.find(p => p.id === viewingPostId) : null;

  const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const firstDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), [currentDate]);
  const lastDayOfMonth = useMemo(() => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0), [currentDate]);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }
    return days;
  }, [startingDay, daysInMonth, currentDate]);
  
  const postsByDate = useMemo(() => {
    return posts.reduce((acc, post) => {
      const date = new Date(post.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(post);
      return acc;
    }, {});
  }, [posts]);

  const changeMonth = (offset) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    });
  };
  
  const isToday = (date) => {
      const today = new Date();
      return date.getDate() === today.getDate() &&
             date.getMonth() === today.getMonth() &&
             date.getFullYear() === today.getFullYear();
  }

  const handleScheduleAndClose = (newPost) => {
    onSchedulePost(newPost);
    setIsModalOpen(false);
  };
  
  const handleDeleteFromModal = () => {
    if (viewingPost) {
      onDeletePost(viewingPost.id);
      setViewingPostId(null);
    }
  };

  const handleToggleStatusFromModal = () => {
    if (viewingPost) {
      onToggleStatus(viewingPost.id);
      // Modal tetap terbuka untuk menunjukkan perubahan status secara langsung.
    }
  };

  return (
    <>
      <div className="p-8 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-4xl font-bold text-gray-800">Kalender Konten</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <span className="text-xl font-semibold text-gray-700 w-48 text-center">
              {currentDate.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
              <ChevronRightIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 transition-colors">
             <PlusIcon className="h-5 w-5" />
            <span>Buat Postingan</span>
          </button>
        </div>

        <div className="flex-1 grid grid-cols-7 grid-rows-[auto_repeat(5,minmax(0,1fr))] gap-1 bg-gray-200 p-1 rounded-lg shadow-md">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, index) => (
            <div key={index} className={`bg-white rounded-md p-2 flex flex-col ${!day ? 'bg-gray-50' : ''}`}>
              {day && (
                <>
                  <div className={`text-sm font-semibold text-gray-700 ${isToday(day) ? 'bg-teal-500 text-white rounded-full h-6 w-6 flex items-center justify-center' : ''}`}>
                    {day.getDate()}
                  </div>
                  <div className="mt-1 flex flex-col gap-1 overflow-y-auto flex-1">
                      {(postsByDate[day.toDateString()] || []).map(post => (
                         <ScheduledPostItem 
                            key={post.id}
                            post={post}
                            onPostClick={() => setViewingPostId(post.id)}
                         />
                      ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <SchedulePostModal 
          onClose={() => setIsModalOpen(false)} 
          onSchedule={handleScheduleAndClose} 
        />
      )}
      {viewingPost && (
        <PostDetailModal 
            post={viewingPost}
            onClose={() => setViewingPostId(null)}
            onDelete={handleDeleteFromModal}
            onToggleStatus={handleToggleStatusFromModal}
        />
      )}
    </>
  );
};

export default SchedulingCalendar;