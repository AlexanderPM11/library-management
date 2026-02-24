import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Book as BookIcon, Filter, MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { bookService } from '../api/services';
import { Book, BookCreateDto } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import BookModal from '../components/books/BookModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const BooksPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuthStore();

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    // Confirm state
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<number | null>(null);

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

    const handleCreate = () => {
        setSelectedBook(null);
        setIsModalOpen(true);
    };

    const handleEdit = (book: Book) => {
        setSelectedBook(book);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setBookToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (bookToDelete) {
            try {
                const response = await bookService.delete(bookToDelete);
                if (!response.error) {
                    setBooks(prev => prev.filter(b => b.id !== bookToDelete));
                }
            } catch (error) {
                console.error("Error deleting book", error);
            } finally {
                setIsDeleteConfirmOpen(false);
                setBookToDelete(null);
            }
        }
    };

    const handleSave = async (bookDto: BookCreateDto) => {
        if (selectedBook) {
            // Update
            const response = await bookService.update(selectedBook.id, bookDto);
            if (response.error) {
                throw { message: response.error, errors: response.errors };
            }
            await fetchBooks();
            setIsModalOpen(false);
        } else {
            // Create
            const response = await bookService.create(bookDto);
            if (response.error) {
                throw { message: response.error, errors: response.errors };
            }
            await fetchBooks();
            setIsModalOpen(false);
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
        <div className="space-y-10 pb-10">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-[0.2em]"
                    >
                        <BookIcon className="w-3 h-3" />
                        Catálogo de Libros
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">Gestión de <span className="text-slate-500">Biblioteca</span></h2>
                    <p className="text-slate-400 max-w-lg text-sm leading-relaxed">Explora, filtra y administra toda la colección de libros disponibles en tu sistema.</p>
                </div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button
                            onClick={handleCreate}
                            className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-600/20"
                            variant="primary"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Nuevo Libro
                        </Button>
                    </motion.div>
                )}
            </div>

            {/* Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                {/* Filters / Toolbar */}
                <div className="p-6 lg:p-8 flex flex-col md:flex-row items-center gap-4 border-b border-white/5">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por título o ISBN..."
                            className="w-full pl-12 pr-4 h-12 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Button variant="secondary" className="h-12 rounded-2xl px-5 text-slate-400 border-white/5 bg-white/5 hover:bg-white/10">
                            <Filter className="w-4 h-4 mr-2" />
                            Filtros
                        </Button>
                        <Button variant="secondary" className="h-12 w-12 rounded-2xl px-0 border-white/5 bg-white/5 hover:bg-white/10">
                            <ArrowUpDown className="w-4 h-4 text-slate-400" />
                        </Button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">
                                <th className="px-8 py-5">Info. Libro</th>
                                <th className="px-8 py-5">Categoría</th>
                                <th className="px-8 py-5">Autores</th>
                                <th className="px-8 py-5">Disponibilidad</th>
                                {isAdmin && <th className="px-8 py-5 text-right">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Sincronizando...</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : filteredBooks.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-medium italic">
                                            No se encontraron resultados para tu búsqueda.
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredBooks.map((book, idx) => (
                                        <motion.tr
                                            key={book.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-16 bg-slate-800 rounded-xl flex items-center justify-center border border-white/5 shadow-inner group-hover:border-primary-500/20 transition-all">
                                                        <BookIcon className="w-6 h-6 text-slate-600 group-hover:text-primary-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-base leading-tight mb-1">{book.title}</div>
                                                        <div className="text-[10px] bg-slate-900 text-slate-500 px-2 py-0.5 rounded-md inline-block border border-white/5">ISBN: {book.isbn}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="bg-primary-500/10 text-primary-400 px-3 py-1.5 rounded-full text-[10px] font-bold ring-1 ring-primary-500/20 uppercase tracking-wider">
                                                    {book.category.name}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-wrap gap-1.5 max-w-xs">
                                                    {book.authors.map((a, i) => (
                                                        <span key={i} className="text-sm text-slate-300 font-medium">
                                                            {a.firstName} {a.lastName}{i < book.authors.length - 1 ? ',' : ''}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className={`text-sm font-bold ${book.stock < 5 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                        {book.stock} Unidades
                                                    </div>
                                                    <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${book.stock < 5 ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                            style={{ width: `${Math.min(book.stock * 10, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(book)}
                                                            className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(book.id)}
                                                            className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest">Página 1 de 1</span>
                    <div className="flex gap-2">
                        <Button variant="secondary" className="h-9 px-4 rounded-xl text-[10px] disabled:opacity-20 border-white/5 bg-white/5" disabled>Anterior</Button>
                        <Button variant="secondary" className="h-9 px-4 rounded-xl text-[10px] disabled:opacity-20 border-white/5 bg-white/5" disabled>Siguiente</Button>
                    </div>
                </div>
            </motion.div>

            <BookModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                book={selectedBook}
            />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="¿Eliminar Libro?"
                message="Esta acción no se puede deshacer. El libro será removido permanentemente de tu catálogo y base de datos."
                confirmLabel="Sí, Eliminar"
                cancelLabel="No, Conservar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
};

export default BooksPage;
