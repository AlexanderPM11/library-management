import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { authorService } from '../api/services';
import { Author } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const AuthorsPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuthStore();

    const fetchAuthors = async () => {
        setIsLoading(true);
        try {
            const response = await authorService.getAll();
            if (!response.error && response.data) {
                setAuthors(response.data);
            }
        } catch (error) {
            console.error("Error fetching authors", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAuthors();
    }, []);

    const filteredAuthors = authors.filter(a =>
        a.firstName.toLowerCase().includes(search.toLowerCase()) ||
        a.lastName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Authors</h2>
                    <p className="text-slate-500">Manage all library authors and their biographies.</p>
                </div>
                {isAdmin && (
                    <Button className="md:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Author
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search authors..."
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-primary-500 outline-none transition-all text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Biography</th>
                                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">Loading authors...</td>
                                </tr>
                            ) : filteredAuthors.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No authors found.</td>
                                </tr>
                            ) : (
                                filteredAuthors.map((author) => (
                                    <tr key={author.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">{author.firstName} {author.lastName}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-500 text-sm line-clamp-1 truncate max-w-xs">{author.biography}</p>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button className="p-2 text-slate-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuthorsPage;
