import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  Save,
  X,
  Calendar,
  Briefcase,
  MapPin
} from 'lucide-react';
import { supabase } from '../../supabase';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    responsibilities: []
  });
  const [newResponsibility, setNewResponsibility] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });

      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) return;
    
    try {
      setDeleteLoading(id);
      
      // Delete from the database
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error('Error deleting experience:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (experience) => {
    setIsEditing(true);
    setCurrentId(experience.id);
    setFormData({
      title: experience.title || '',
      company: experience.company || '',
      location: experience.location || '',
      start_date: experience.start_date ? experience.start_date.split('T')[0] : '',
      end_date: experience.end_date ? experience.end_date.split('T')[0] : '',
      is_current: experience.is_current || false,
      description: experience.description || '',
      responsibilities: experience.responsibilities || []
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      responsibilities: []
    });
    setNewResponsibility('');
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // If "is current" is checked, clear the end date
    if (name === 'is_current' && checked) {
      setFormData(prev => ({ ...prev, end_date: '' }));
    }
  };

  const addResponsibility = () => {
    if (!newResponsibility.trim()) return;
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, newResponsibility.trim()]
    }));
    setNewResponsibility('');
  };

  const removeResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      const experienceData = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date,
        is_current: formData.is_current,
        description: formData.description,
        responsibilities: formData.responsibilities
      };
      
      let error;
      
      if (isEditing) {
        // Update existing experience
        const { error: updateError } = await supabase
          .from('experience')
          .update(experienceData)
          .eq('id', currentId);
          
        error = updateError;
      } else {
        // Create new experience
        const { error: insertError } = await supabase
          .from('experience')
          .insert([{ ...experienceData, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      // Refresh the list
      fetchExperiences();
      
      // Close the form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const filteredExperiences = experiences.filter(exp => 
    exp.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Experience</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-all"
        >
          <Plus size={16} className="mr-2" />
          Add New Experience
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search experiences..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Experience Timeline */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={30} className="animate-spin text-amber-500" />
        </div>
      ) : filteredExperiences.length > 0 ? (
        <div className="relative pl-8 border-l border-white/10 space-y-10">
          {filteredExperiences.map((experience) => (
            <div 
              key={experience.id}
              className="relative"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[41px] w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-amber-500/30 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{experience.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Briefcase size={14} className="mr-1.5 text-amber-400" />
                        {experience.company}
                      </div>
                      {experience.location && (
                        <div className="flex items-center text-gray-400">
                          <MapPin size={14} className="mr-1.5 text-amber-400/70" />
                          {experience.location}
                        </div>
                      )}
                      <div className="flex items-center text-gray-400">
                        <Calendar size={14} className="mr-1.5 text-amber-400/70" />
                        {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(experience)}
                      className="p-1.5 bg-amber-500/20 rounded-md text-amber-400 hover:bg-amber-500/30 transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(experience.id)}
                      disabled={deleteLoading === experience.id}
                      className="p-1.5 bg-red-500/20 rounded-md text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === experience.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
                
                {experience.description && (
                  <p className="text-gray-300 mb-4">{experience.description}</p>
                )}
                
                {experience.responsibilities && experience.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-2">Key Responsibilities:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {experience.responsibilities.map((responsibility, index) => (
                        <li key={index} className="text-gray-300 text-sm">{responsibility}</li>
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
          <p className="text-gray-400">
            {searchTerm ? 'No experiences match your search.' : 'No experiences found. Add your first work experience!'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border border-white/10 rounded-xl w-full max-w-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-white/10 rounded-full text-gray-400 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Job Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Job Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
              
              {/* Company */}
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300">
                  Company <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="e.g. Acme Inc."
                />
              </div>
              
              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="e.g. New York, NY (Remote)"
                />
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-300">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-300">
                    End Date {!formData.is_current && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    disabled={formData.is_current}
                    required={!formData.is_current}
                    className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 disabled:bg-white/5 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              
              {/* Current Position */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_current"
                  name="is_current"
                  checked={formData.is_current}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-500 bg-white/5 border-white/10 rounded focus:ring-amber-500/30"
                />
                <label htmlFor="is_current" className="ml-2 text-sm text-gray-300">
                  I currently work here
                </label>
              </div>
              
              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                  placeholder="Brief description of your role"
                />
              </div>
              
              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Responsibilities
                </label>
                <div className="space-y-2 mb-3">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg"
                    >
                      <span className="text-gray-300 text-sm">{responsibility}</span>
                      <button
                        type="button"
                        onClick={() => removeResponsibility(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                    placeholder="Add a responsibility"
                  />
                  <button
                    type="button"
                    onClick={addResponsibility}
                    className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-r-lg text-amber-400 hover:bg-amber-500/30 transition-all"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-medium hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} className="mr-2" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Experience;