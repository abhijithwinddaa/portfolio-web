import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Save, Upload, Layout, Type, Palette, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    primary_color: '#6366f1',
    secondary_color: '#a855f7',
    resume_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || '',
          primary_color: data.primary_color || '#6366f1',
          secondary_color: data.secondary_color || '#a855f7',
          resume_url: data.resume_url || ''
        });
        // Apply colors immediately on load
        document.documentElement.style.setProperty('--primary', data.primary_color);
        document.documentElement.style.setProperty('--secondary', data.secondary_color);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live preview for colors
    if (name === 'primary_color') {
      document.documentElement.style.setProperty('--primary', value);
    }
    if (name === 'secondary_color') {
      document.documentElement.style.setProperty('--secondary', value);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Please upload a PDF file', 'error');
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `resume-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, resume_url: publicUrl }));
      Swal.fire('Success', 'Resume uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading resume:', error);
      Swal.fire('Error', 'Failed to upload resume', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('site_settings')
        .update(formData)
        .eq('id', 1); // Assuming single row with ID 1

      if (error) throw error;
      Swal.fire('Saved!', 'Settings have been updated.', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      Swal.fire('Error', 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SEO Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Type className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">SEO Configuration</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Site Title</label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                placeholder="e.g. John Doe - Full Stack Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                placeholder="Brief description for search engines..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Keywords</label>
              <input
                type="text"
                name="seo_keywords"
                value={formData.seo_keywords}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                placeholder="react, developer, portfolio..."
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Palette className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Theme Customization</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Primary Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded cursor-pointer bg-transparent"
                />
                <span className="text-gray-400 font-mono">{formData.primary_color}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Secondary Color</label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  name="secondary_color"
                  value={formData.secondary_color}
                  onChange={handleChange}
                  className="h-10 w-20 rounded cursor-pointer bg-transparent"
                />
                <span className="text-gray-400 font-mono">{formData.secondary_color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
            <Layout className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Resume Management</h2>
          </div>

          <div className="flex items-start gap-8">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Upload New Resume (PDF)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="resume-upload"
                  className={`flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/5 transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-center">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 mx-auto mb-2 text-indigo-500 animate-spin" />
                    ) : (
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    )}
                    <span className="text-sm text-gray-400">
                      {uploading ? 'Uploading...' : 'Click to upload PDF'}
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Resume URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.resume_url}
                  readOnly
                  className="w-full px-4 py-2 bg-black/20 border border-white/10 rounded-lg text-gray-400 text-sm"
                  placeholder="No resume uploaded yet"
                />
                {formData.resume_url && (
                  <a
                    href={formData.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    View
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
