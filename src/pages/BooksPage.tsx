import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Book as BookIcon } from 'lucide-react';
import { bookService } from '../api/services';
import { Book } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuthStore();

    const fetchBooks = async () => {
        setIsLoading(true);
        try {
            const response = await bookService.getAll();
            if (!response.error && response.data) {
                setBooks(response.data);
            }
        } catch (error) {
            console.error("Error fetching books", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Books</h2>
                    <p className="text-slate-500">Manage your library collection and inventory.</p>
                </div>
                {isAdmin && (
                    <Button className="md:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Book
                    </Button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search books by title or ISBN..."
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
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Authors</th>
                                <th className="px-6 py-4">Stock</th>
                                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading books...</td>
                                </tr>
                            ) : filteredBooks.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No books found in the collection.</td>
                                </tr>
                            ) : (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center mr-3">
                                                    <BookIcon className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900">{book.title}</div>
                                                    <div className="text-slate-400 text-xs mt-0.5">ISBN: {book.isbn}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-primary-50 text-primary-700 px-2 py-1 rounded text-xs font-medium border border-primary-100">
                                                {book.category.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600 max-w-xs truncate">
                                                {book.authors.map(a => `${a.firstName} ${a.lastName}`).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm font-bold ${book.stock < 5 ? 'text-red-500' : 'text-slate-700'}`}>
                                                {book.stock} units
                                            </div>
                                        </td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
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

export default BooksPage;
