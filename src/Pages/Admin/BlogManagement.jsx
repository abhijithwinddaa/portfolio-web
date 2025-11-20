import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import Swal from 'sweetalert2';

const BlogManagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPost, setCurrentPost] = useState(null);

    const emptyPost = {
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        cover_image: '',
        tags: [],
        published: false
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
            Swal.fire('Error', 'Failed to fetch blog posts', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Generate slug from title if empty
        if (!currentPost.slug && currentPost.title) {
            currentPost.slug = currentPost.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }

        try {
            if (currentPost.id) {
                // Update existing post
                const { error } = await supabase
                    .from('blog_posts')
                    .update(currentPost)
                    .eq('id', currentPost.id);

                if (error) throw error;
                Swal.fire('Success', 'Blog post updated successfully!', 'success');
            } else {
                // Create new post
                const { error } = await supabase
                    .from('blog_posts')
                    .insert([currentPost]);

                if (error) throw error;
                Swal.fire('Success', 'Blog post created successfully!', 'success');
            }

            setIsEditing(false);
            setCurrentPost(null);
            fetchPosts();
        } catch (error) {
            console.error('Error saving post:', error);
            Swal.fire('Error', error.message || 'Failed to save blog post', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const { error } = await supabase
                    .from('blog_posts')
                    .delete()
                    .eq('id', id);

                if (error) throw error;

                Swal.fire('Deleted!', 'Blog post has been deleted.', 'success');
                fetchPosts();
            } catch (error) {
                console.error('Error deleting post:', error);
                Swal.fire('Error', 'Failed to delete blog post', 'error');
            }
        }
    };

    const togglePublished = async (post) => {
        try {
            const { error } = await supabase
                .from('blog_posts')
                .update({ published: !post.published })
                .eq('id', post.id);

            if (error) throw error;

            fetchPosts();
            Swal.fire('Success', `Post ${!post.published ? 'published' : 'unpublished'}!`, 'success');
        } catch (error) {
            console.error('Error toggling publish status:', error);
            Swal.fire('Error', 'Failed to update publish status', 'error');
        }
    };

    const handleNewPost = () => {
        setCurrentPost(emptyPost);
        setIsEditing(true);
    };

    const handleEdit = (post) => {
        setCurrentPost({ ...post });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setCurrentPost(null);
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (!currentPost.tags.includes(newTag)) {
                setCurrentPost({
                    ...currentPost,
                    tags: [...currentPost.tags, newTag]
                });
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setCurrentPost({
            ...currentPost,
            tags: currentPost.tags.filter(tag => tag !== tagToRemove)
        });
    };

    if (isEditing) {
        return (
            <div className="p-6 bg-[#030014] min-h-screen">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-white">
                            {currentPost?.id ? 'Edit Blog Post' : 'New Blog Post'}
                        </h1>
                        <button
                            onClick={handleCancel}
                            className="p-2 text-gray-400 hover:text-white transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Enter post title"
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Slug (auto-generated if empty)
                            </label>
                            <input
                                type="text"
                                value={currentPost.slug}
                                onChange={(e) => setCurrentPost({ ...currentPost, slug: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                placeholder="url-friendly-slug"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Excerpt
                            </label>
                            <textarea
                                value={currentPost.excerpt}
                                onChange={(e) => setCurrentPost({ ...currentPost, excerpt: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 resize-none"
                                placeholder="Brief summary of the post"
                            />
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Content (Markdown) *
                            </label>
                            <textarea
                                required
                                value={currentPost.content}
                                onChange={(e) => setCurrentPost({ ...currentPost, content: e.target.value })}
                                rows={15}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono text-sm resize-none"
                                placeholder="Write your post content in markdown..."
                            />
                            <p className="mt-2 text-xs text-gray-400">
                                Supports Markdown: **bold**, *italic*, # headings, - lists, [links](url), etc.
                            </p>
                        </div>

                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Cover Image URL
                            </label>
                            <input
                                type="url"
                                value={currentPost.cover_image}
                                onChange={(e) => setCurrentPost({ ...currentPost, cover_image: e.target.value })}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                onKeyDown={handleTagInput}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Type a tag and press Enter"
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {currentPost.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Published Toggle */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="published"
                                checked={currentPost.published}
                                onChange={(e) => setCurrentPost({ ...currentPost, published: e.target.checked })}
                                className="w-5 h-5 text-indigo-500 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="published" className="text-sm font-medium text-gray-300">
                                Publish immediately
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
                            >
                                <Save className="w-5 h-5" />
                                Save Post
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#030014] min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
                    <button
                        onClick={handleNewPost}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
                    >
                        <Plus className="w-5 h-5" />
                        New Post
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p>No blog posts yet. Create your first post!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 hover:border-white/20 transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                                            {post.published ? (
                                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-400 text-sm mb-3">{post.excerpt || 'No excerpt'}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>Slug: {post.slug}</span>
                                            <span>Views: {post.views || 0}</span>
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-3">
                                                {post.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded"
                                                    >
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => togglePublished(post)}
                                            className="p-2 text-gray-400 hover:text-green-400 transition"
                                            title={post.published ? 'Unpublish' : 'Publish'}
                                        >
                                            {post.published ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="p-2 text-gray-400 hover:text-blue-400 transition"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 transition"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BlogManagement;
