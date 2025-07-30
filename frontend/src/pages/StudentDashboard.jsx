import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Monitor,
  LogOut,
  BarChart2,
} from 'lucide-react';
import avatar from '../assets/avatar.png'; // Use cartoon-style avatar

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);

  const user = {
    name: 'Johnny Bravo',
    role: 'Student',
    avatar: avatar,
  };

  const renderContent = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Interests */}
        <div className="bg-gradient-to-br from-[#1f1c2c] to-[#928DAB] text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-xl font-bold mb-4">🎯 Your Interests</h2>
          <ul className="space-y-2 text-sm font-light">
            <li className="bg-white bg-opacity-10 px-3 py-2 rounded">Game Development</li>
            <li className="bg-white bg-opacity-10 px-3 py-2 rounded">Motion Graphics</li>
            <li className="bg-white bg-opacity-10 px-3 py-2 rounded">Ethical Hacking</li>
          </ul>
        </div>

        {/* Todos */}
        <div className="bg-gradient-to-br from-[#232526] to-[#414345] text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-xl font-bold mb-4">✅ Today’s Todos</h2>
          <ul className="space-y-2 text-sm font-light">
            <li className="flex items-center">🛠️ <span className="ml-2">Fix UI Bugs</span></li>
            <li className="flex items-center">📖 <span className="ml-2">Read Next.js Docs</span></li>
            <li className="flex items-center">📩 <span className="ml-2">Send report to mentor</span></li>
          </ul>
        </div>

        {/* Tracking */}
        <div className="bg-gradient-to-br from-[#000428] to-[#004e92] text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-xl font-bold mb-4">📊 Task Progress</h2>
          <div className="bg-white bg-opacity-30 w-full h-4 rounded-full">
            <div className="bg-white h-4 rounded-full w-[65%] animate-pulse"></div>
          </div>
          <p className="text-sm mt-2">65% completed</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex font-sans bg-[#0e0e10] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#3e2723] to-[#4e342e] p-6 flex flex-col justify-between text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-10">CartoonDash</h2>
          <nav className="space-y-3">
            {[
              { label: 'Dashboard', icon: BarChart2, id: 'dashboard' },
              { label: 'Interests', icon: BookOpen, id: 'interests' },
              { label: 'Todos', icon: CheckCircle, id: 'todos' },
              { label: 'Tracking', icon: Monitor, id: 'tracking' },
            ].map(({ label, icon: Icon, id }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center w-full px-3 py-2 rounded-md transition ${
                  activeTab === id
                    ? 'bg-[#5d4037] font-semibold'
                    : 'hover:bg-[#6d4c41]'
                }`}
              >
                <Icon className="mr-3" size={18} /> {label}
              </button>
            ))}
          </nav>
        </div>

        <button className="flex items-center mt-6 px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 transition">
          <LogOut className="mr-2" size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between bg-[#1c1c1e] px-8 py-4 shadow-md">
          <h1 className="text-2xl font-semibold">Welcome, {user.name}!</h1>
          <div className="relative">
            <img
              src={user.avatar}
              alt="avatar"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-10 h-10 rounded-full cursor-pointer ring-2 ring-amber-400 hover:scale-105 transition-transform"
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-[#2c2c2e] text-white shadow-lg rounded-lg z-50">
                <div className="px-4 py-3 border-b border-gray-600 text-sm">
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-gray-400 text-xs">{user.role}</div>
                </div>
                <button className="w-full px-4 py-2 text-left hover:bg-[#3a3a3c] text-sm text-red-400">
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default StudentDashboard;
