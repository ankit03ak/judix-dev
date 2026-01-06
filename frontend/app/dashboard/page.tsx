'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, type User } from '@/lib/auth';
import api from '@/lib/api';
import { CheckSquare, StickyNote, FileText, TrendingUp, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    tasks: number;
    notes: number;
    posts: number;
}

export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<Stats>({ tasks: 0, notes: 0, posts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [tasksRes, notesRes, postsRes] = await Promise.all([
                api.get('/tasks'),
                api.get('/notes'),
                api.get('/posts'),
            ]);

            setStats({
                tasks: tasksRes.data.count || 0,
                notes: notesRes.data.count || 0,
                posts: postsRes.data.count || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        { name: 'Tasks', icon: CheckSquare, count: stats.tasks, color: 'from-purple-500 to-blue-500', href: '/dashboard/tasks' },
        { name: 'Notes', icon: StickyNote, count: stats.notes, color: 'from-yellow-500 to-orange-500', href: '/dashboard/notes' },
        { name: 'Posts', icon: FileText, count: stats.posts, color: 'from-green-500 to-emerald-500', href: '/dashboard/posts' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            
            <div className="glass p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                </h1>
                <p className="text-slate-300">
                    Here's what's happening with your work today.
                </p>
            </div>

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statsData.map((stat) => (
                    <Link
                        key={stat.name}
                        href={stat.href}
                        className="glass p-6 rounded-xl hover:scale-105 transition-transform cursor-pointer group"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        {loading ? (
                            <div className="flex items-center">
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            </div>
                        ) : (
                            <h3 className="text-2xl font-bold text-white mb-1">{stat.count}</h3>
                        )}
                        <p className="text-slate-400">{stat.name}</p>
                    </Link>
                ))}
            </div>

            
            <div className="glass p-8 rounded-2xl">
                <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        href="/dashboard/tasks"
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500 transition group"
                    >
                        <CheckSquare className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-medium mb-1">Create Task</h3>
                        <p className="text-sm text-slate-400">Add a new task to your list</p>
                    </Link>
                    <Link
                        href="/dashboard/notes"
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-yellow-500 transition group"
                    >
                        <StickyNote className="w-8 h-8 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-medium mb-1">New Note</h3>
                        <p className="text-sm text-slate-400">Jot down your thoughts</p>
                    </Link>
                    <Link
                        href="/dashboard/posts"
                        className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-green-500 transition group"
                    >
                        <FileText className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-white font-medium mb-1">Write Post</h3>
                        <p className="text-sm text-slate-400">Share your ideas</p>
                    </Link>
                </div>
            </div>

            
            <div className="glass p-8 rounded-2xl border-l-4 border-blue-500">
                <h2 className="text-xl font-semibold text-white mb-4">🚀 Getting Started</h2>
                <ul className="space-y-3 text-slate-300">
                    <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Create your first task to organize your work</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Take notes to capture important information</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        <span>Write posts to share your thoughts and ideas</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

