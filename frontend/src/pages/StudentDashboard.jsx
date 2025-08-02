import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Monitor,
  LogOut,
  BarChart2,
} from 'lucide-react';
import avatar from '../assets/avatar.png';
import InterestManager from '../components/InterestManager'; // 🔥 Adjust path as needed
import TodoSection from '../components/TodoSection';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showDropdown, setShowDropdown] = useState(false);

  const user = {
    name: 'Johnny Bravo',
    role: 'Student',
    avatar: avatar,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'interests':
        return <InterestManager />;

      case 'todos':
        return (
          <div className="p-4 text-lg text-gray-300">
            <h2 className="text-2xl font-semibold mb-4">Your Todos</h2>
            return <TodoSection/>
          </div>
        );

      case 'tracking':
        return (
          <div className="p-4 text-lg text-gray-300">
            <h2 className="text-2xl font-semibold mb-4">Task Tracking</h2>
            <p>Progress tracking will be shown here.</p>
          </div>
        );

      default:
        return (
          <div className="p-4 text-gray-300 space-y-6">
            <h2 className="text-2xl font-semibold">Dashboard Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#1c1c2e] p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Game Development</h3>
                <p className="text-sm text-gray-400">Learning Unity and Unreal Engine basics.</p>
              </div>

              <div className="bg-[#1c1c2e] p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Motion Graphics</h3>
                <p className="text-sm text-gray-400">Exploring After Effects and animation principles.</p>
              </div>

              <div className="bg-[#1c1c2e] p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Ethical Hacking</h3>
                <p className="text-sm text-gray-400">Hands-on with Kali Linux and web pentesting.</p>
              </div>
            </div>
          </div>
        );
    }
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
          <div>
            <p className="text-sm text-gray-400">Logged in as</p>
            <h1 className="text-xl font-bold text-white">{user.name}</h1>
          </div>
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

        {/* Dynamic Content */}
        <div className="p-8">{renderContent()}</div>
      </main>
    </div>
  );
};

export default StudentDashboard;
