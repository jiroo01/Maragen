import React from 'react';
import { ChatIcon, ImageIcon, CalendarIcon, MonitorIcon, LogoutIcon } from './icons';

const Sidebar = ({ activeSection, setActiveSection, onLogout }) => {
  const navItems = [
    { id: 'chatbot', label: 'Chatbot', icon: ChatIcon },
    { id: 'imageGen', label: 'Buat Gambar', icon: ImageIcon },
    { id: 'scheduling', label: 'Penjadwalan', icon: CalendarIcon },
    { id: 'monitoring', label: 'Pemantauan', icon: MonitorIcon },
  ];

  return (
    <aside className="bg-[#0f343a] text-white w-64 min-h-screen p-6 flex flex-col shadow-lg">
      <h1 className="text-3xl font-bold text-green-200 mb-12">Dashboard</h1>
      <nav className="flex-grow">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 hover:bg-teal-800 ${
                  activeSection === item.id ? 'bg-green-200 text-[#0f343a] font-semibold' : ''
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-lg border border-teal-600 transition-colors duration-200 hover:bg-teal-800">
          <LogoutIcon className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
