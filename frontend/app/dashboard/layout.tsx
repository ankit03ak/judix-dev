'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser, logout, type User } from '@/lib/auth';
import {
    LayoutDashboard,
    CheckSquare,
    StickyNote,
    FileText,
    LogOut,
    Menu,
    X,
    User as UserIcon
} from 'lucide-react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const currentUser = getCurrentUser();
        setUser(currentUser);
    }, []);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
        { name: 'Notes', href: '/dashboard/notes', icon: StickyNote },
        { name: 'Posts', href: '/dashboard/posts', icon: FileText },
    ];

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 glass transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full p-6">
                    
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Judix
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden text-slate-400 hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    
                    {user && (
                        <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    
                    <nav className="flex-1 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                                            : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                                        }`}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            
            <div className="lg:ml-64">
                
                <header className="glass sticky top-0 z-30 px-4 py-4 lg:px-8">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-300 hover:text-white"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1 lg:flex-none">
                            <h2 className="text-xl font-semibold text-white">
                                {navigation.find((item) => item.href === pathname)?.name || 'Dashboard'}
                            </h2>
                        </div>
                    </div>
                </header>

                
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
