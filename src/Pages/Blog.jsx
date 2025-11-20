import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';
import { FadeIn } from '../hooks/AnimatedComponents';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get all unique tags from posts
    const allTags = [...new Set(posts.flatMap(post => post.tags || []))];

    // Filter posts based on search and tag
    const filteredPosts = posts.filter(post => {
        const matchesSearch = searchTerm === '' ||
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));

        return matchesSearch && matchesTag;
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="min-h-screen bg-[#030014] py-20">
            <div className="container mx-auto px-[5%] max-w-6xl">
                {/* Header */}
                <FadeIn delay={200}>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">
                                Blog
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Thoughts, tutorials, and insights on web development and technology
                        </p>
                    </div>
                </FadeIn>

                {/* Search and Filter */}
                <FadeIn delay={400}>
                    <div className="mb-8 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition"
                            />
                        </div>

                        {/* Tag Filter */}
                        {allTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-4 py-2 rounded-full text-sm transition ${!selectedTag
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    All Posts
                                </button>
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-2 rounded-full text-sm transition flex items-center gap-1 ${selectedTag === tag
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                            }`}
                                    >
                                        <Tag className="w-3 h-3" />
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeIn>

                {/* Posts Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
                        <p className="text-gray-400 mt-4">Loading posts...</p>
                    </div>
                ) : filteredPosts.length === 0 ? (
                    <FadeIn delay={600}>
                        <div className="text-center py-20">
                            <p className="text-gray-400 text-lg">
                                {searchTerm || selectedTag ? 'No posts found matching your criteria.' : 'No blog posts yet. Check back soon!'}
                            </p>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="grid gap-6">
                        {filteredPosts.map((post, index) => (
                            <FadeIn key={post.id} delay={600 + index * 100}>
                                <Link to={`/blog/${post.slug}`}>
                                    <article className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            {/* Cover Image */}
                                            {post.cover_image && (
                                                <div className="md:w-64 h-48 flex-shrink-0 overflow-hidden rounded-lg">
                                                    <img
                                                        src={post.cover_image}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1">
                                                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-indigo-400 transition">
                                                    {post.title}
                                                </h2>

                                                {/* Meta Info */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(post.created_at)}
                                                    </div>
                                                    {post.views > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            {post.views} views
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Excerpt */}
                                                {post.excerpt && (
                                                    <p className="text-gray-300 mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                )}

                                                {/* Tags */}
                                                {post.tags && post.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {post.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="px-3 py-1 bg-indigo-500/10 text-indigo-300 rounded-full text-xs"
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Read More */}
                                                <div className="flex items-center gap-2 text-indigo-400 group-hover:gap-3 transition-all">
                                                    <span className="font-medium">Read More</span>
                                                    <ArrowRight className="w-4 h-4" />
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
