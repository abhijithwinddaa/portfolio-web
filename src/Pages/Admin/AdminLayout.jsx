import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Award, 
  Code2, 
  Boxes, 
  User, 
  Link as LinkIcon, 
  LogOut,
  Menu,
  X,
  Briefcase,
  Settings as SettingsIcon
} from 'lucide-react';
import { supabase } from '../../supabase';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <Code2 size={20} />, label: 'Projects' },
    { path: '/admin/certificates', icon: <Award size={20} />, label: 'Certificates' },
    { path: '/admin/tech-stack', icon: <Boxes size={20} />, label: 'Tech Stack' },
    { path: '/admin/experience', icon: <Briefcase size={20} />, label: 'Experience' },
    { path: '/admin/profile', icon: <User size={20} />, label: 'Profile' },
    { path: '/admin/social-links', icon: <LinkIcon size={20} />, label: 'Social Links' },
    { path: '/admin/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#030014]">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out md:relative md:flex z-40 w-64 bg-gradient-to-b from-[#0a0a1a] to-[#030014] border-r border-white/10`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-white/10">
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
              Admin Portal
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-white border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`mr-3 ${
                  location.pathname === item.path
                    ? 'text-indigo-400'
                    : 'text-gray-500'
                }`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-400 rounded-lg hover:bg-red-500/10 transition-all"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-[#0a0a1a] border-b border-white/10 h-16 flex items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-white">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View Website
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#030014]">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;