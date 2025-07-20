import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Upload, 
  X,
  User
} from 'lucide-react';
import { supabase } from '../../supabase';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    title: '',
    bio: '',
    about_me: '',
    email: '',
    phone: '',
    location: '',
    resume_url: '',
    profile_image: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setProfileData(data);
        if (data.profile_image) {
          setImagePreview(data.profile_image);
        }
        if (data.resume_url) {
          const fileName = data.resume_url.split('/').pop();
          setResumeFileName(fileName);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
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
  
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    setResumeFile(file);
    setResumeFileName(file.name);
  };
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setProfileData(prev => ({ ...prev, profile_image: '' }));
  };
  
  const removeResume = () => {
    setResumeFile(null);
    setResumeFileName('');
    setProfileData(prev => ({ ...prev, resume_url: '' }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      let profileImageUrl = profileData.profile_image;
      let resumeUrl = profileData.resume_url;
      
      // Upload profile image if there's a new one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `profile_${Date.now()}.${fileExt}`;
        const filePath = `profile/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('profile-images')
          .getPublicUrl(filePath);
          
        profileImageUrl = data.publicUrl;
      }
      
      // Upload resume if there's a new one
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `resume_${Date.now()}.${fileExt}`;
        const filePath = `resumes/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, resumeFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
          
        resumeUrl = data.publicUrl;
      }
      
      const updatedProfile = {
        ...profileData,
        profile_image: profileImageUrl,
        resume_url: resumeUrl,
        updated_at: new Date().toISOString()
      };
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profile')
        .select('id')
        .single();
      
      let error;
      
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profile')
          .update(updatedProfile)
          .eq('id', existingProfile.id);
          
        error = updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profile')
          .insert([{ ...updatedProfile, created_at: new Date().toISOString() }]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 size={30} className="animate-spin text-indigo-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Profile Image</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              {imagePreview ? (
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                  >
                    <X size={16} className="mr-2" />
                    Remove Image
                  </button>
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer"
                  >
                    <Upload size={16} className="mr-2" />
                    Change Image
                    <input
                      id="profile-upload"
                      name="profile-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="profile-upload"
                    className="flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer inline-block"
                  >
                    <Upload size={16} className="mr-2" />
                    Upload Profile Image
                    <input
                      id="profile-upload"
                      name="profile-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
              <p className="text-sm text-gray-400">
                Recommended size: 500x500 pixels. Maximum file size: 5MB.
              </p>
            </div>
          </div>
        </div>
        
        {/* Basic Information */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="Your full name"
              />
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Professional Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={profileData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="e.g. Frontend Developer"
              />
            </div>
          </div>
          
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300">
              Short Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleChange}
              required
              rows={2}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="A brief introduction (1-2 sentences)"
            />
          </div>
          
          {/* About Me */}
          <div>
            <label htmlFor="about_me" className="block text-sm font-medium text-gray-300">
              About Me
            </label>
            <textarea
              id="about_me"
              name="about_me"
              value={profileData.about_me}
              onChange={handleChange}
              rows={6}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="Detailed information about yourself, your background, skills, and interests"
            />
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="your.email@example.com"
              />
            </div>
            
            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                placeholder="+1 (123) 456-7890"
              />
            </div>
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
              value={profileData.location}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              placeholder="City, Country"
            />
          </div>
        </div>
        
        {/* Resume */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Resume / CV</h2>
          
          {resumeFileName ? (
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white">
                {resumeFileName}
              </div>
              <button
                type="button"
                onClick={removeResume}
                className="flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
              >
                <X size={16} className="mr-2" />
                Remove
              </button>
              <label
                htmlFor="resume-upload"
                className="flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer"
              >
                <Upload size={16} className="mr-2" />
                Change
                <input
                  id="resume-upload"
                  name="resume-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </label>
            </div>
          ) : (
            <div>
              <label
                htmlFor="resume-upload"
                className="flex items-center px-4 py-2 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-indigo-400 hover:bg-indigo-500/30 transition-all cursor-pointer inline-block"
              >
                <Upload size={16} className="mr-2" />
                Upload Resume / CV
                <input
                  id="resume-upload"
                  name="resume-upload"
                  type="file"
                  className="sr-only"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />
              </label>
              <p className="text-sm text-gray-400 mt-2">
                Accepted formats: PDF, DOC, DOCX. Maximum file size: 10MB.
              </p>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white font-medium hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;