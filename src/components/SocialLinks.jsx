// ../components/SocialLinks.js
import React, { useState, useEffect } from 'react';
import { Linkedin, Github, FileText, Mail, Instagram, Twitter, Globe } from 'lucide-react';
import { supabase } from '../supabase';

// Icon and color mapping for social platforms
const PLATFORM_CONFIG = {
  linkedin: { icon: Linkedin, color: '#0A66C2', label: "Let's Connect", sublabel: 'on LinkedIn' },
  github: { icon: Github, color: '#ffffff', label: 'GitHub', sublabel: '' },
  mail: { icon: Mail, color: '#EA4335', label: 'Email', sublabel: '' },
  instagram: { icon: Instagram, color: '#E4405F', label: 'Instagram', sublabel: '' },
  twitter: { icon: Twitter, color: '#1DA1F2', label: 'Twitter', sublabel: '' },
  website: { icon: Globe, color: '#6366f1', label: 'Website', sublabel: '' },
};

const SocialLinks = () => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [socialLinks, setSocialLinks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch resume URL
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('resume_url')
          .single();
        if (!settingsError && settingsData) {
          setResumeUrl(settingsData.resume_url);
        }

        // Fetch social links
        const { data: linksData, error: linksError } = await supabase
          .from('social_links')
          .select('*');
        if (!linksError && linksData) {
          setSocialLinks(linksData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Render a social link dynamically based on platform
  const renderSocialLink = (link) => {
    const platform = link.platform?.toLowerCase() || 'website';
    const config = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.website;
    const Icon = config.icon;
    const displayName = link.display_name || config.label;

    return (
      <a
        key={link.id}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500"
        aria-label={displayName}
      >
        <div className="relative flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500 group-hover:scale-125 group-hover:opacity-30"
            style={{ backgroundColor: config.color }}
          />
          <div className="relative p-2 rounded-lg">
            <Icon
              className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
              style={{ color: config.color }}
            />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
            {displayName}
          </span>
          {config.sublabel && (
            <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
              {config.sublabel}
            </span>
          )}
        </div>
      </a>
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Dynamic Social Links */}
      {socialLinks.map(renderSocialLink)}

      {/* Resume */}
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:border-green-500/50 transition-all duration-500 hover:shadow-lg hover:shadow-green-500/20"
          aria-label="Resume"
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-30 rounded-lg transition-all duration-500 group-hover:scale-125 group-hover:opacity-50"
              style={{ backgroundColor: "#10B981" }} />
            <div className="relative p-2 rounded-lg bg-green-500/20">
              <FileText
                className="w-6 h-6 transition-all duration-500 group-hover:scale-110"
                style={{ color: "#10B981" }}
              />
            </div>
          </div>

          {/* Text Container */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-lg font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
              View My Resume
            </span>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              Download PDF
            </span>
          </div>

          {/* Arrow indicator */}
          <div className="ml-auto">
            <svg className="w-5 h-5 text-green-400 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      )}
    </div>
  );
};

export default SocialLinks;

