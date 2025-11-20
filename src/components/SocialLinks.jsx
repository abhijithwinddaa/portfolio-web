// ../components/SocialLinks.js
import React, { useState, useEffect } from 'react';
import { Linkedin, Github, FileText } from 'lucide-react';
import { supabase } from '../supabase';

const SocialLinks = () => {
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('resume_url')
          .single();
        if (error) throw error;
        if (data) setResumeUrl(data.resume_url);
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };
    fetchResume();
  }, []);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* LinkedIn */}
      <a
        href="https://www.linkedin.com/in/batturaj-abhijith" // Correct LinkedIn URL
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500"
        aria-label="LinkedIn"
      >
        <div className="relative flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 rounded-md transition-all duration-500 group-hover:scale-110 group-hover:opacity-30"
              style={{ backgroundColor: "#0A66C2" }} />
            <div className="relative p-2 rounded-md">
              <Linkedin className="w-6 h-6 transition-all duration-500 group-hover:scale-105" style={{ color: "#0A66C2" }} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold pt-[0.2rem] text-gray-200 tracking-tight leading-none group-hover:text-white transition-colors duration-300">
              Let's Connect
            </span>
            <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
              on LinkedIn
            </span>
          </div>
        </div>
      </a>

      {/* GitHub */}
      <a
        href="https://github.com/abhijithwinddaa" // Correct GitHub URL
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500"
        aria-label="GitHub"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 rounded-lg transition-all duration-500 group-hover:scale-125 group-hover:opacity-30"
            style={{ backgroundColor: "white" }} />
          <div className="relative p-2 rounded-lg">
            <Github
              className="w-5 h-5 transition-all duration-500 group-hover:scale-110"
              style={{ color: "white" }}
            />
          </div>
        </div>

        {/* Text Container */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
            Github
          </span>
          <span className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-300">
            @abhijithwinddaa
          </span>
        </div>
      </a>

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
