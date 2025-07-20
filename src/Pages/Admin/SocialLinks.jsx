import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Loader2,
  Save,
  X,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Dribbble,
  Codepen,
  Globe
} from 'lucide-react';
import { supabase } from '../../supabase';

const SocialLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  
  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    display_name: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Platform options with icons
  const platformOptions = [
    { value: 'github', label: 'GitHub', icon: <Github size={16} /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin size={16} /> },
    { value: 'twitter', label: 'Twitter', icon: <Twitter size={16} /> },
    { value: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
    { value: 'facebook', label: 'Facebook', icon: <Facebook size={16} /> },
    { value: 'youtube', label: 'YouTube', icon: <Youtube size={16} /> },
    { value: 'dribbble', label: 'Dribbble', icon: <Dribbble size={16} /> },
    { value: 'codepen', label: 'CodePen', icon: <Codepen size={16} /> },
    { value: 'website', label: 'Website', icon: <Globe size={16} /> },
    { value: 'other', label: 'Other', icon: <LinkIcon size={16} /> }
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching social links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this social link?')) return;
    
    try {
      setDeleteLoading(id);
      
      // Delete from the database
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI
      setLinks(links.filter(link => link.id !== id));
    } catch (error) {
      console.error('Error deleting social link:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (link) => {
    setIsEditing(true);
    setCurrentId(link.id);
    setFormData({
      platform: link.platform || '',
      url: link.url || '',
      display_name: link.display_name || ''
    });
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      platform: '',
      url: '',
      display_name: ''
    });
    setIsFormOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setFormLoading(true);
      
      const linkData = {
        platform: formData.platform,
        url: formData.url,
        display_name: formData.display_name
      };
      
      let error;
      
      if (isEditing) {
        // Update existing link
        const { error: updateError } = await supabase
          .from('social_links')
          .update(linkData)
          .eq('id', currentId);
          
        error = updateError;
      } else {
        // Create new link
        const { error: insertError } = await supabase
          .from('social_links')
          .insert([{ ...linkData, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      // Refresh the list
      fetchLinks();
      
      // Close the form
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving social link:', error);
      alert('Failed to save social link. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    const option = platformOptions.find(opt => opt.value === platform);
    return option ? option.icon : <LinkIcon size={20} />;
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'github':
        return 'text-white bg-gray-800';
      case 'linkedin':
        return 'text-white bg-blue-600';
      case 'twitter':
        return 'text-white bg-blue-400';
      case 'instagram':
        return 'text-white bg-pink-600';
      case 'facebook':
        return 'text-white bg-blue-700';
      case 'youtube':
        return 'text-white bg-red-600';
      case 'dribbble':
        return 'text-white bg-pink-500';
      case 'codepen':
        return 'text-white bg-gray-900';
      case 'website':
        return 'text-white bg-purple-600';
      default:
        return 'text-white bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Social Links</h1>
        <button 
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition-all"
        >
          <Plus size={16} className="mr-2" />
          Add New Link
        </button>
      </div>

      {/* Social Links List */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={30} className="animate-spin text-indigo-500" />
        </div>
      ) : links.length > 0 ? (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Platform</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Display Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${getPlatformColor(link.platform)} mr-3`}>
                          {getPlatformIcon(link.platform)}
                        </div>
                        <span className="text-white capitalize">
                          {link.platform === 'other' ? 'Custom Link' : link.platform}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{link.display_name || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors truncate block max-w-xs"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(link)}
                          className="p-1.5 bg-amber-500/20 rounded-md text-amber-400 hover:bg-amber-500/30 transition-colors"
                        >
                          <LinkIcon size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(link.id)}
                          disabled={deleteLoading === link.id}
                          className="p-1.5 bg-red-500/20 rounded-md text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          {deleteLoading === link.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center">
          <p className="text-gray-400">
            No social links found. Add your first social link!
          </p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a1a] border border-white/10 rounded-xl w-full max-w-md p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">
                {isEditing ? 'Edit Social Link' : 'Add New Social Link'}
              </h2>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 bg-white/10 rounded-full text-gray-400 hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Platform */}
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-300">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                >
                  <option value="" disabled>Select a platform</option>
                  {platformOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Display Name */}
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-300">
                  Display Name
                </label>
                <input
                  type="text"
                  id="display_name"
                  name="display_name"
                  value={formData.display_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="e.g. @username or Your Name"
                />
              </div>
              
              {/* URL */}
              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                  placeholder="https://example.com/username"
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SocialLinks;