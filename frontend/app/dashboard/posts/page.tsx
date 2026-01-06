'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Search, Edit2, Trash2, Loader2, X, Calendar, Eye } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Post {
    _id: string;
    title: string;
    content: string;
    author: string;
    status: 'draft' | 'published';
    publishedDate?: string;
    createdAt: string;
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        filterPosts();
    }, [posts, searchQuery, statusFilter]);

    const fetchPosts = async () => {
        try {
            const response = await api.get('/posts');
            setPosts(response.data.data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterPosts = () => {
        let filtered = [...posts];

        if (searchQuery) {
            filtered = filtered.filter(
                (post) =>
                    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    post.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((post) => post.status === statusFilter);
        }

        setFilteredPosts(filtered);
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingPost) {
                await api.put(`/posts/${editingPost._id}`, data);
            } else {
                await api.post('/posts', data);
                toast.success('Post created successfully!');
            }
            fetchPosts();
            closeModal();
        } catch (error) {
            console.error('Error saving post:', error);
            toast.error('Failed to save post. Please try again.');
        }
    };

    const deletePost = async (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            try {
                await api.delete(`/posts/${id}`);
                fetchPosts();
                toast.success('Post deleted successfully!');
            } catch (error) {
                console.error('Error deleting post:', error);
                toast.error('Failed to delete post. Please try again.');
            }
        }
    };

    const openModal = (post?: Post) => {
        if (post) {
            setEditingPost(post);
            setValue('title', post.title);
            setValue('content', post.content);
            setValue('author', post.author);
            setValue('status', post.status);
            setValue('publishedDate', post.publishedDate ? post.publishedDate.split('T')[0] : '');
        } else {
            setEditingPost(null);
            reset({ status: 'draft' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingPost(null);
        reset();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Posts</h1>
                    <p className="text-slate-400">Share your thoughts and ideas</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Post</span>
                </button>
            </div>

            
            <div className="glass p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            
            {filteredPosts.length === 0 ? (
                <div className="glass p-12 rounded-xl text-center">
                    <p className="text-slate-400">No posts found. Write your first post!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredPosts.map((post) => (
                        <div key={post._id} className="glass p-6 rounded-xl hover:scale-[1.02] transition-transform group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition">
                                            {post.title}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${post.status === 'published'
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                                                    : 'bg-slate-500/20 text-slate-400 border border-slate-500/50'
                                                }`}
                                        >
                                            {post.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 mb-1">By {post.author}</p>
                                    {post.publishedDate && (
                                        <div className="flex items-center text-xs text-slate-500">
                                            <Calendar className="w-3 h-3 mr-1" />
                                            Published: {new Date(post.publishedDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openModal(post)}
                                        className="text-slate-400 hover:text-blue-400 transition"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => deletePost(post._id)}
                                        className="text-slate-400 hover:text-red-400 transition"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-300 line-clamp-3">{post.content}</p>
                        </div>
                    ))}
                </div>
            )}

            
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingPost ? 'Edit Post' : 'New Post'}
                            </h2>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                                <input
                                    {...register('title', { required: true })}
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Post title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                                <textarea
                                    {...register('content', { required: true })}
                                    rows={6}
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Write your post content..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Author</label>
                                    <input
                                        {...register('author', { required: true })}
                                        type="text"
                                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Author name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Published Date (optional)</label>
                                <input
                                    {...register('publishedDate')}
                                    type="date"
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition"
                                >
                                    {editingPost ? 'Update' : 'Create'}
                                </button>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
