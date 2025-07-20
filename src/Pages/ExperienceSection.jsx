import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Briefcase, Calendar, MapPin } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

const ExperienceSection = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });
      if (!error) setExperiences(data || []);
      setLoading(false);
    };
    fetchExperiences();
  }, []);

  return (
    <section id="Experience" className="w-full px-[5%] lg:px-[10%] py-12 text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 bg-gradient-to-r from-[#fbbf24] to-[#f59e42] bg-clip-text text-transparent">
        Experience
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : experiences.length > 0 ? (
        <div className="relative pl-8 border-l border-white/10 space-y-10">
          {experiences.map((exp) => (
            <div key={exp.id} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                    <div className="flex items-center text-gray-300">
                      <Briefcase size={14} className="mr-1.5 text-amber-400" />
                      {exp.company}
                    </div>
                    {exp.location && (
                      <div className="flex items-center text-gray-400">
                        <MapPin size={14} className="mr-1.5 text-amber-400/70" />
                        {exp.location}
                      </div>
                    )}
                    <div className="flex items-center text-gray-400">
                      <Calendar size={14} className="mr-1.5 text-amber-400/70" />
                      {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : formatDate(exp.end_date)}
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-300 mt-4 mb-2">{exp.description}</p>
                )}
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-amber-400 mb-2">Key Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i} className="text-gray-300 text-sm">{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center">
          <p className="text-gray-400">No experiences found.</p>
        </div>
      )}
    </section>
  );
};

export default ExperienceSection; 