import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Calendar, ArrowLeft, Tag, Eye } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        fetchPost();
    }, [slug]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .eq('published', true)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    setNotFound(true);
                } else {
                    throw error;
                }
            } else {
                setPost(data);
                // Increment view count
                await incrementViews(data.id);
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            setNotFound(true);
        } finally {
            setLoading(false);
        }
    };

    const incrementViews = async (postId) => {
        try {
            const { error } = await supabase.rpc('increment_blog_views', {
                post_id: postId
            });

            // If function doesn't exist, fallback to manual update
            if (error && error.code === '42883') {
                const currentViews = post?.views || 0;
                await supabase
                    .from('blog_posts')
                    .update({ views: currentViews + 1 })
                    .eq('id', postId);
            }
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Simple markdown to HTML converter
    const parseMarkdown = (markdown) => {
        if (!markdown) return '';

        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-white mt-10 mb-4">$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-white mt-12 mb-6">$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Code blocks
        html = html.replace(/```([^`]+)```/g, '<pre class="bg-black/50 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm text-gray-300">$1</code></pre>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code class="bg-black/30 px-2 py-1 rounded text-indigo-300 text-sm">$1</code>');

        // Unordered lists
        html = html.replace(/^\- (.*$)/gim, '<li class="ml-6 text-gray-300">• $1</li>');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (!para.trim().startsWith('<') && para.trim()) {
                return `<p class="text-gray-300 leading-relaxed mb-4">${para}</p>`;
            }
            return para;
        }).join('\n');

        return html;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                    <p className="text-gray-400 mt-4">Loading post...</p>
                </div>
            </div>
        );
    }

    if (notFound || !post) {
        return (
            <div className="min-h-screen bg-[#030014] flex items-center justify-center px-[5%]">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                    <p className="text-gray-400 mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030014] py-20">
            <div className="container mx-auto px-[5%] max-w-4xl">
                {/* Back Button */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Blog
                </Link>

                {/* Cover Image */}
                {post.cover_image && (
                    <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Post Header */}
                <article>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {post.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6 pb-6 border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            {post.views || 0} views
                        </div>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    to={`/blog?tag=${tag}`}
                                    className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-sm hover:bg-indigo-500/20 transition flex items-center gap-1"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Content */}
                    <div
                        className="prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
                    />
                </article>

                {/* Navigation */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition border border-white/10"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to All Posts
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
