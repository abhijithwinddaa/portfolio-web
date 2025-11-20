import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Save,
  Calendar
} from 'lucide-react';
import { supabase } from '../../supabase';

const CertificateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_url: '',
    image_url: '',
    display_order: 999
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetchCertificate();
    }
  }, [id]);

  const fetchCertificate = async () => {
    try {
      setFetchLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || '',
          issuer: data.issuer || '',
          issue_date: data.issue_date ? data.issue_date.split('T')[0] : '',
          expiry_date: data.expiry_date ? data.expiry_date.split('T')[0] : '',
          credential_url: data.credential_url || '',
          image_url: data.image_url || '',
          display_order: data.display_order || 999
        });

        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error('Error fetching certificate:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = formData.image_url;

      // Upload image if there's a new one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `certificate-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('certificate-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from('certificate-images')
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      const certificateData = {
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date || null,
        expiry_date: formData.expiry_date || null,
        credential_url: formData.credential_url,
        image_url: imageUrl,
        display_order: parseInt(formData.display_order) || 999
      };

      let error;

      if (isEditMode) {
        // Update existing certificate
        const { error: updateError } = await supabase
          .from('certificates')
          .update(certificateData)
          .eq('id', id);

        error = updateError;
      } else {
        // Create new certificate
        const { error: insertError } = await supabase
          .from('certificates')
          .insert([{ ...certificateData, created_at: new Date().toISOString() }]);

        error = insertError;
      }

      if (error) throw error;

      navigate('/admin/certificates');
    } catch (error) {
      console.error('Error saving certificate:', error);
      alert('Failed to save certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={30} className="animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/certificates')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Certificates
        </button>
        <h1 className="text-2xl font-bold text-white">
          {isEditMode ? 'Edit Certificate' : 'Add New Certificate'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          {/* Certificate Image */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Certificate Image <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-white/10 rounded-lg">
              {imagePreview ? (
                <div className="space-y-4 w-full">
                  <div className="relative mx-auto w-full max-w-md">
                    <img
                      src={imagePreview}
                      alt="Certificate preview"
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
                        className="relative cursor-pointer rounded-md font-medium text-purple-400 hover:text-purple-300 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                          required={!isEditMode && !formData.image_url}
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

          {/* Certificate Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Certificate Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              placeholder="Enter certificate title"
            />
          </div>

          {/* Issuer */}
          <div>
            <label htmlFor="issuer" className="block text-sm font-medium text-gray-300">
              Issuer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="issuer"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              placeholder="Enter issuing organization"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-300">
                Issue Date
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <input
                  type="date"
                  id="issue_date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
            </div>
            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-300">
                Expiry Date (if applicable)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-500" />
                </div>
                <input
                  type="date"
                  id="expiry_date"
                  name="expiry_date"
                  value={formData.expiry_date}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
                />
              </div>
            </div>
          </div>

          {/* Credential URL */}
          <div>
            <label htmlFor="credential_url" className="block text-sm font-medium text-gray-300">
              Credential URL
            </label>
            <input
              type="url"
              id="credential_url"
              name="credential_url"
              value={formData.credential_url}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
              placeholder="https://example.com/credential"
            />
          </div>

          {/* Display Order */}
          <div>
            <label htmlFor="display_order" className="block text-sm font-medium text-red-400">
              Display Order
            </label>
            <input
              type="number"
              id="display_order"
              name="display_order"
              value={formData.display_order}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-white placeholder-red-300 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/50"
              placeholder="999"
            />
            <p className="mt-1 text-xs text-gray-400">Lower number = shows first (1, 2, 3...)</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Certificate
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CertificateForm;