import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  Save,
  X,
  Upload
} from 'lucide-react';
import { supabase } from '../../supabase';

const TechStack = () => {
  const [techStacks, setTechStacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50
  });
  const [iconFile, setIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchTechStack();
  }, []);

  const fetchTechStack = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tech_stack')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setTechStacks(data || []);
    } catch (error) {
      console.error('Error fetching tech stack:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, iconUrl) => {
    if (!window.confirm('Are you sure you want to delete this tech stack item?')) return;
    
    try {
      setDeleteLoading(id);
      
      // Delete the icon from storage if it exists
      if (iconUrl) {
        const iconPath = iconUrl.split('/').pop();
        await supabase.storage
          .from('tech-icons')
          .remove([iconPath]);
      }
      
      // Delete from the database
      const { error } = await supabase
        .from('tech_stack')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI
      setTechStacks(techStacks.filter(tech => tech.id !== id));
    } catch (error) {
      console.error('Error deleting tech stack item:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (tech) => {
    setIsEditing(true);
    setCurrentId(tech.id);
    setFormData({
      name: tech.name || '',
      category: tech.category || '',
      proficiency: tech.proficiency || 50
    });
    setIconPreview(tech.icon_url || '');
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      category: '',
      proficiency: 50
    });
    setIconFile(null);
    setIconPreview('');
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    
    setIconFile(file);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setIconPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeIcon = () => {
    setIconFile(null);
    setIconPreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      let iconUrl = isEditing ? techStacks.find(tech => tech.id === currentId)?.icon_url || '' : '';
      
      // Upload icon if there's a new one
      if (iconFile) {
        const fileExt = iconFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `tech-icons/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('tech-icons')
          .upload(filePath, iconFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('tech-icons')
          .getPublicUrl(filePath);
          
        iconUrl = data.publicUrl;
      }
      
      const techData = {
        name: formData.name,
        category: formData.category,
        proficiency: parseInt(formData.proficiency),
        icon_url: iconUrl
      };
      
      let error;
      
      if (isEditing) {
        // Update existing tech stack item
        const { error: updateError } = await supabase
          .from('tech_stack')
          .update(techData)
          .eq('id', currentId);
          
        error = updateError;
      } else {
        // Create new tech stack item
        const { error: insertError } = await supabase
          .from('tech_stack')
          .insert([{ ...techData, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      // Refresh the list
      fetchTechStack();
      
      // Close the form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving tech stack item:', error);
      alert('Failed to save tech stack item. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredTechStack = techStacks.filter(tech => 
    tech.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tech.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tech stack by category
  const groupedTechStack = filteredTechStack.reduce((acc, tech) => {
    const category = tech.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tech);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Tech Stack</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
        >
          <Plus size={16} className="mr-2" />
          Add New Tech
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search tech stack..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tech Stack List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={30} className="animate-spin text-green-500" />
        </div>
      ) : Object.keys(groupedTechStack).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedTechStack).map(([category, techs]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-semibold text-white">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techs.map((tech) => (
                  <div 
                    key={tech.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-green-500/30 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 flex-shrink-0 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                        {tech.icon_url ? (
                          <img 
                            src={tech.icon_url} 
                            alt={tech.name} 
                            className="w-8 h-8 object-contain" 
                          />
                        ) : (
                          <span className="text-gray-500 text-xs">No Icon</span>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-white font-medium truncate">{tech.name}</h3>
                        <div className="mt-2 w-full bg-white/10 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full" 
                            style={{ width: `${tech.proficiency}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Proficiency</span>
                          <span>{tech.proficiency}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                      <button 
                        onClick={() => handleEdit(tech)}
                        className="p-1.5 bg-amber-500/20 rounded-md text-amber-400 hover:bg-amber-500/30 transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tech.id, tech.icon_url)}
                        disabled={deleteLoading === tech.id}
                        className="p-1.5 bg-red-500/20 rounded-md text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                      >
                        {deleteLoading === tech.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center">
          <p className="text-gray-400">
            {searchTerm ? 'No tech stack items match your search.' : 'No tech stack items found. Add your first tech!'}
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border border-white/10 rounded-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Tech Stack Item' : 'Add New Tech Stack Item'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-white/10 rounded-full text-gray-400 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tech Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Technology Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                  placeholder="e.g. React, Python, Tailwind CSS"
                />
              </div>
              
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30"
                  placeholder="e.g. Frontend, Backend, DevOps"
                />
              </div>
              
              {/* Proficiency */}
              <div>
                <label htmlFor="proficiency" className="block text-sm font-medium text-gray-300">
                  Proficiency (%)
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="range"
                    id="proficiency"
                    name="proficiency"
                    min="0"
                    max="100"
                    step="5"
                    value={formData.proficiency}
                    onChange={handleChange}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                  />
                  <span className="text-white font-medium w-10 text-center">
                    {formData.proficiency}%
                  </span>
                </div>
              </div>
              
              {/* Icon Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon
                </label>
                {iconPreview ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                      <img 
                        src={iconPreview} 
                        alt="Icon preview" 
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={removeIcon}
                      className="p-1.5 bg-red-500/20 rounded-md text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-white/10 rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="flex text-sm text-gray-400 mt-2">
                          <label
                            htmlFor="icon-upload"
                            className="relative cursor-pointer rounded-md font-medium text-green-400 hover:text-green-300 focus-within:outline-none"
                          >
                            <span>Upload an icon</span>
                            <input
                              id="icon-upload"
                              name="icon-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleIconChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          SVG, PNG, JPG up to 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg text-white font-medium hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default TechStack;