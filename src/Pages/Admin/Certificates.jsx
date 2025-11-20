import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { supabase } from '../../supabase';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      setDeleteLoading(id);

      // Delete the image from storage if it exists
      if (imageUrl) {
        const imagePath = imageUrl.split('/').pop();
        await supabase.storage
          .from('certificate-images')
          .remove([imagePath]);
      }

      // Delete the certificate from the database
      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the UI
      setCertificates(certificates.filter(cert => cert.id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Certificates</h1>
        <Link
          to="/admin/certificates/new"
          className="flex items-center px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all"
        >
          <Plus size={16} className="mr-2" />
          Add New Certificate
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search certificates..."
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Certificates Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 size={30} className="animate-spin text-purple-500" />
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all group"
            >
              <div className="relative">
                {certificate.image_url ? (
                  <img
                    src={certificate.image_url}
                    alt={certificate.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-white/10 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                  <div>
                    {certificate.credential_url && (
                      <a
                        href={certificate.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-3 py-1.5 bg-purple-500/80 rounded-md text-white text-sm hover:bg-purple-600 transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        View Credential
                      </a>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/certificates/edit/${certificate.id}`}
                      className="p-1.5 bg-amber-500/80 rounded-md text-white hover:bg-amber-600 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(certificate.id, certificate.image_url)}
                      disabled={deleteLoading === certificate.id}
                      className="p-1.5 bg-red-500/80 rounded-md text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleteLoading === certificate.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-white font-medium truncate">{certificate.title}</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {certificate.issuer || 'Unknown issuer'}
                </p>
                {certificate.issue_date && (
                  <p className="text-gray-500 text-xs mt-2">
                    Issued: {new Date(certificate.issue_date).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/30">
                    Order: {certificate.display_order || 999}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-10 text-center">
          <p className="text-gray-400">
            {searchTerm ? 'No certificates match your search.' : 'No certificates found. Add your first certificate!'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-4 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;