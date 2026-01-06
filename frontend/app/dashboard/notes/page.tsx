'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Search, Edit2, Trash2, Loader2, X, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    color: string;
    createdAt: string;
}

const colorOptions = [
    { value: '#fbbf24', label: 'Yellow' },
    { value: '#f87171', label: 'Red' },
    { value: '#60a5fa', label: 'Blue' },
    { value: '#34d399', label: 'Green' },
    { value: '#a78bfa', label: 'Purple' },
    { value: '#fb923c', label: 'Orange' },
];

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const selectedColor = watch('color', '#fbbf24');

    useEffect(() => {
        fetchNotes();
    }, []);

    useEffect(() => {
        filterNotes();
    }, [notes, searchQuery, categoryFilter]);

    const fetchNotes = async () => {
        try {
            const response = await api.get('/notes');
            setNotes(response.data.data);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterNotes = () => {
        let filtered = [...notes];

        if (searchQuery) {
            filtered = filtered.filter(
                (note) =>
                    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    note.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter((note) => note.category === categoryFilter);
        }

        setFilteredNotes(filtered);
    };

    const onSubmit = async (data: any) => {
        try {
            const noteData = {
                ...data,
                tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : [],
            };

            if (editingNote) {
                await api.put(`/notes/${editingNote._id}`, noteData);
            } else {
                await api.post('/notes', noteData);
                toast.success('Note created successfully!');
            }
            fetchNotes();
            closeModal();
        } catch (error) {
            console.error('Error saving note:', error);
            toast.error('Failed to save note. Please try again.');
        }
    };

    const deleteNote = async (id: string) => {
        if (confirm('Are you sure you want to delete this note?')) {
            try {
                await api.delete(`/notes/${id}`);
                fetchNotes();
                toast.success('Note deleted successfully!');
            } catch (error) {
                console.error('Error deleting note:', error);
                toast.error('Failed to delete note. Please try again.');
            }
        }
    };

    const openModal = (note?: Note) => {
        if (note) {
            setEditingNote(note);
            setValue('title', note.title);
            setValue('content', note.content);
            setValue('category', note.category);
            setValue('tags', note.tags.join(', '));
            setValue('color', note.color);
        } else {
            setEditingNote(null);
            reset({ color: '#fbbf24' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingNote(null);
        reset();
    };

    const categories = ['general', 'work', 'personal', 'ideas', 'important'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 text-yellow-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Notes</h1>
                    <p className="text-slate-400">Capture your thoughts and ideas</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition"
                >
                    <Plus className="w-5 h-5" />
                    <span>New Note</span>
                </button>
            </div>

            
            <div className="glass p-4 rounded-xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="all">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            
            {filteredNotes.length === 0 ? (
                <div className="glass p-12 rounded-xl text-center">
                    <p className="text-slate-400">No notes found. Create your first note!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredNotes.map((note) => (
                        <div
                            key={note._id}
                            className="p-6 rounded-xl hover:scale-105 transition-transform group border-2"
                            style={{
                                backgroundColor: `${note.color}20`,
                                borderColor: `${note.color}50`,
                            }}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition">
                                    {note.title}
                                </h3>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => openModal(note)}
                                        className="text-slate-400 hover:text-blue-400 transition"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteNote(note._id)}
                                        className="text-slate-400 hover:text-red-400 transition"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-slate-300 text-sm mb-3 line-clamp-3">{note.content}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                                <span className="px-2 py-1 bg-slate-800/50 rounded-md text-xs text-slate-300">
                                    {note.category}
                                </span>
                            </div>
                            {note.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {note.tags.map((tag, idx) => (
                                        <span key={idx} className="flex items-center text-xs text-slate-400">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
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
                                {editingNote ? 'Edit Note' : 'New Note'}
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
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Note title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
                                <textarea
                                    {...register('content')}
                                    rows={4}
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Note content"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                                <select
                                    {...register('category')}
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Tags (comma-separated)</label>
                                <input
                                    {...register('tags')}
                                    type="text"
                                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="tag1, tag2, tag3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                                <div className="grid grid-cols-6 gap-2">
                                    {colorOptions.map((color) => (
                                        <button
                                            key={color.value}
                                            type="button"
                                            onClick={() => setValue('color', color.value)}
                                            className={`w-10 h-10 rounded-lg border-2 transition ${selectedColor === color.value ? 'border-white scale-110' : 'border-transparent'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.label}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition"
                                >
                                    {editingNote ? 'Update' : 'Create'}
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
