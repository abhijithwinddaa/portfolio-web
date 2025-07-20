import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Plus, 
  Trash2,
  Loader2,
  Save
} from 'lucide-react';
import { supabase } from '../../supabase';

const ProjectForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: [],
    features: [],
    live_url: '',
    github_url: '',
    image_url: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [newTech, setNewTech] = useState('');
  const [newFeature, setNewFeature] = useState('');
  
  useEffect(() => {
    if (isEditMode) {
      fetchProject();
    }
  }, [id]);
  
  const fetchProject = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          tech_stack: data.tech_stack || [],
          features: data.features || [],
          live_url: data.live_url || '',
          github_url: data.github_url || '',
          image_url: data.image_url || ''
        });
        
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setFetchLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setImageFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image_url: '' }));
  };
  
  const addTechStack = () => {
    if (!newTech.trim()) return;
    setFormData(prev => ({
      ...prev,
      tech_stack: [...prev.tech_stack, newTech.trim()]
    }));
    setNewTech('');
  };
  
  const removeTechStack = (index) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack.filter((_, i) => i !== index)
    }));
  };
  
  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };
  
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      let imageUrl = formData.image_url;
      
      // Upload image if there's a new one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = fileName; // Only use the file name, not 'project-images/' prefix
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);
          
        imageUrl = data.publicUrl;
      }
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        tech_stack: formData.tech_stack,
        features: formData.features,
        live_url: formData.live_url,
        github_url: formData.github_url,
        image_url: imageUrl
      };
      
      let error;
      
      if (isEditMode) {
        // Update existing project
        const { error: updateError } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', id);
          
        error = updateError;
      } else {
        // Create new project
        const { error: insertError } = await supabase
          .from('projects')
          .insert([{ ...projectData, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={30} className="animate-spin text-indigo-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/projects')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Projects
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? 'Edit Project' : 'Add New Project'}
        </h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          {/* Project Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/10 rounded-lg">
              {imagePreview ? (
                <div className="space-y-4 w-full">
                  <div className="relative mx-auto w-full max-w-md">
                    <img 
                      src={imagePreview} 
                      alt="Project preview" 
                      className="h-64 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="text-center text-sm text-gray-400">
                    Click the X to remove the image or upload a new one
                  </div>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <div className="flex flex-col items-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-400 mt-2">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-indigo-400 hover:text-indigo-300 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Project Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Enter project title"
            />
          </div>
          
          {/* Project Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Enter project description"
            />
          </div>
          
          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tech Stack
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.tech_stack.map((tech, index) => (
                <div 
                  key={index}
                  className="flex items-center bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full text-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechStack(index)}
                    className="ml-2 text-indigo-300 hover:text-indigo-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="Add technology"
              />
              <button
                type="button"
                onClick={addTechStack}
                className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-r-lg text-indigo-400 hover:bg-indigo-500/30 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Key Features
            </label>
            <div className="space-y-2 mb-3">
              {formData.features.map((feature, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-lg"
                >
                  <span className="text-gray-300">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="Add feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-r-lg text-indigo-400 hover:bg-indigo-500/30 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
          
          {/* Project URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="live_url" className="block text-sm font-medium text-gray-300">
                Live Demo URL
              </label>
              <input
                type="url"
                id="live_url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label htmlFor="github_url" className="block text-sm font-medium text-gray-300">
                GitHub URL
              </label>
              <input
                type="url"
                id="github_url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Project
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;