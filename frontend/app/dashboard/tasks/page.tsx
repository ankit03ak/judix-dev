'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Search, Filter, Edit2, Trash2, Loader2, X, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    dueDate?: string;
    createdAt: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const { register, handleSubmit, reset, setValue } = useForm();

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, searchQuery, statusFilter, priorityFilter]);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks');
            setTasks(response.data.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        if (searchQuery) {
            filtered = filtered.filter(
                (task) =>
                    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    task.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter((task) => task.status === statusFilter);
        }

        if (priorityFilter !== 'all') {
            filtered = filtered.filter((task) => task.priority === priorityFilter);
        }

        setFilteredTasks(filtered);
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingTask) {
                await api.put(`/tasks/${editingTask._id}`, data);
                toast.success('Task updated successfully!');
            } else {
                await api.post('/tasks', data);
                toast.success('Task created successfully!');
            }
            fetchTasks();
            closeModal();
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error('Failed to save task. Please try again.');
        }
    };

    const deleteTask = async (id: string) => {
        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await api.delete(`/tasks/${id}`);
                toast.success('Task deleted successfully!');
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
                toast.error('Failed to delete task. Please try again.');
            }
        }
    };

    const openModal = (task?: Task) => {
        if (task) {
            setEditingTask(task);
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('status', task.status);
            setValue('priority', task.priority);
            setValue('dueDate', task.dueDate ? task.dueDate.split('T')[0] : '');
        } else {
            setEditingTask(null);
            reset();
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTask(null);
        reset();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'in-progress':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'medium':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tasks</h1>
                    <p className="text-slate-400">Manage your tasks and stay organized</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Task</span>
                </button>
            </div>


            <div className="glass p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>


            {filteredTasks.length === 0 ? (
                <div className="glass p-12 rounded-xl text-center">
                    <p className="text-slate-400">No tasks found. Create your first task to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTasks.map((task) => (
                        <div key={task._id} className="glass p-6 rounded-xl hover:scale-105 transition-transform group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition">
                                    {task.title}
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openModal(task)}
                                        className="text-slate-400 hover:text-blue-400 transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteTask(task._id)}
                                        className="text-slate-400 hover:text-red-400 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-4 line-clamp-2">{task.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className={`px-2 py-1 rounded-md text-xs border ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                            </div>
                            {task.dueDate && (
                                <div className="flex items-center text-xs text-slate-400">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}


            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="glass p-6 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingTask ? 'Edit Task' : 'New Task'}
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
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Task title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Task description"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                                    <select
                                        {...register('status')}
                                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
                                    <select
                                        {...register('priority')}
                                        className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Due Date</label>
                                <input
                                    {...register('dueDate')}
                                    type="date"
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition"
                                >
                                    {editingTask ? 'Update' : 'Create'}
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
