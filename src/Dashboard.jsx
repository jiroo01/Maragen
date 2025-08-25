import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageGenerator from './components/ImageGenerator';
import Chatbot from './components/Chatbot';
import SchedulingCalendar from './components/SchedulingCalendar';

// This is the old App component, renamed to Dashboard
const Dashboard = ({ onLogout }) => {
  const [activeSection, setActiveSection] = useState('imageGen');
  const [scheduledPosts, setScheduledPosts] = useState([]);

  const handleSchedulePost = (newPost) => {
    setScheduledPosts(prevPosts => [...prevPosts, { ...newPost, id: Date.now(), status: 'scheduled' }]);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus postingan ini secara permanen?")) {
      setScheduledPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    }
  };

  const handleTogglePostStatus = (postId) => {
    setScheduledPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, status: post.status === 'scheduled' ? 'cancelled' : 'scheduled' }
          : post
      )
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'imageGen':
        return <ImageGenerator onSchedulePost={handleSchedulePost} />;
      case 'chatbot':
        return <Chatbot />;
      case 'scheduling':
        return (
            <SchedulingCalendar
                posts={scheduledPosts}
                onSchedulePost={handleSchedulePost}
                onDeletePost={handleDeletePost}
                onToggleStatus={handleTogglePostStatus}
            />
        );
      case 'monitoring':
        return <div className="p-8"><h2 className="text-4xl font-bold text-gray-800">Pemantauan</h2><p className="mt-2 text-gray-600">Fitur ini sedang dalam pengembangan.</p></div>;
      default:
        return <ImageGenerator onSchedulePost={handleSchedulePost} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
