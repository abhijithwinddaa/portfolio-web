import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Code2, 
  Boxes, 
  User, 
  Link as LinkIcon,
  Briefcase,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';
import { supabase } from '../../supabase';

const StatCard = ({ icon, title, count, linkTo, color }) => {
  return (
    <Link 
      to={linkTo}
      className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex items-center hover:bg-white/10 transition-all hover:border-${color}-500/30 group`}
    >
      <div className={`p-4 rounded-lg bg-${color}-500/20 mr-4 group-hover:bg-${color}-500/30 transition-all`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-white mt-1">{count}</p>
      </div>
    </Link>
  );
};

const ToggleSection = ({ title, isActive, onToggle, icon }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
      <div className="flex items-center">
        <span className="p-2 rounded-md bg-indigo-500/20 mr-3">
          {icon}
        </span>
        <span className="font-medium text-white">{title}</span>
      </div>
      <button
        onClick={onToggle}
        className={`p-2 rounded-full ${
          isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
        } transition-all hover:scale-105`}
      >
        {isActive ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    certificates: 0,
    techStack: 0,
    experience: 0
  });

  const [sectionVisibility, setSectionVisibility] = useState({
    about: true,
    projects: true,
    certificates: true,
    techStack: true,
    experience: true,
    contact: true
  });

  useEffect(() => {
    // Fetch section visibility from Supabase
    const fetchSectionVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from('section_visibility')
          .select('*')
          .single();
        
        if (error) throw error;
        
        if (data) {
          setSectionVisibility(data);
        }
      } catch (error) {
        console.error('Error fetching section visibility:', error);
      }
    };

    // Fetch stats from Supabase
    const fetchStats = async () => {
      try {
        const [
          { count: projectCount }, 
          { count: certificateCount },
          { count: techStackCount },
          { count: experienceCount }
        ] = await Promise.all([
          supabase.from('projects').select('*', { count: 'exact', head: true }),
          supabase.from('certificates').select('*', { count: 'exact', head: true }),
          supabase.from('tech_stack').select('*', { count: 'exact', head: true }),
          supabase.from('experience').select('*', { count: 'exact', head: true })
        ]);

        setStats({
          projects: projectCount || 0,
          certificates: certificateCount || 0,
          techStack: techStackCount || 0,
          experience: experienceCount || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchSectionVisibility();
    fetchStats();
  }, []);

  const toggleSectionVisibility = async (section) => {
    try {
      const newVisibility = {
        ...sectionVisibility,
        [section]: !sectionVisibility[section]
      };

      setSectionVisibility(newVisibility);

      // Update in Supabase
      const { error } = await supabase
        .from('section_visibility')
        .update(newVisibility)
        .eq('id', 1); // Assuming there's only one row with id 1

      if (error) throw error;
    } catch (error) {
      console.error(`Error toggling ${section} visibility:`, error);
      // Revert state if update fails
      setSectionVisibility(prevState => ({
        ...prevState
      }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link 
          to="/admin/settings" 
          className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 transition-all"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Code2 size={24} className="text-blue-400" />} 
          title="Projects" 
          count={stats.projects} 
          linkTo="/admin/projects" 
          color="blue" 
        />
        <StatCard 
          icon={<Award size={24} className="text-purple-400" />} 
          title="Certificates" 
          count={stats.certificates} 
          linkTo="/admin/certificates" 
          color="purple" 
        />
        <StatCard 
          icon={<Boxes size={24} className="text-green-400" />} 
          title="Tech Stack" 
          count={stats.techStack} 
          linkTo="/admin/tech-stack" 
          color="green" 
        />
        <StatCard 
          icon={<Briefcase size={24} className="text-amber-400" />} 
          title="Experience" 
          count={stats.experience} 
          linkTo="/admin/experience" 
          color="amber" 
        />
      </div>

      {/* Section Visibility */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Section Visibility</h2>
        <p className="text-gray-400 mb-6">Toggle sections to show or hide them on your portfolio website.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ToggleSection 
            title="About Section" 
            isActive={sectionVisibility.about} 
            onToggle={() => toggleSectionVisibility('about')}
            icon={<User size={18} className="text-indigo-400" />}
          />
          <ToggleSection 
            title="Projects Section" 
            isActive={sectionVisibility.projects} 
            onToggle={() => toggleSectionVisibility('projects')}
            icon={<Code2 size={18} className="text-blue-400" />}
          />
          <ToggleSection 
            title="Certificates Section" 
            isActive={sectionVisibility.certificates} 
            onToggle={() => toggleSectionVisibility('certificates')}
            icon={<Award size={18} className="text-purple-400" />}
          />
          <ToggleSection 
            title="Tech Stack Section" 
            isActive={sectionVisibility.techStack} 
            onToggle={() => toggleSectionVisibility('techStack')}
            icon={<Boxes size={18} className="text-green-400" />}
          />
          <ToggleSection 
            title="Experience Section" 
            isActive={sectionVisibility.experience} 
            onToggle={() => toggleSectionVisibility('experience')}
            icon={<Briefcase size={18} className="text-amber-400" />}
          />
          <ToggleSection 
            title="Contact Section" 
            isActive={sectionVisibility.contact} 
            onToggle={() => toggleSectionVisibility('contact')}
            icon={<LinkIcon size={18} className="text-pink-400" />}
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/admin/projects/new" 
            className="flex items-center justify-center p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all"
          >
            Add New Project
          </Link>
          <Link 
            to="/admin/certificates/new" 
            className="flex items-center justify-center p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all"
          >
            Add New Certificate
          </Link>
          <Link 
            to="/admin/tech-stack/new" 
            className="flex items-center justify-center p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
          >
            Add New Tech Stack
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;