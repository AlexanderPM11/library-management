import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Users, Filter, MoreHorizontal } from 'lucide-react';
import { authorService } from '../api/services';
import { Author, AuthorCreateDto } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthorModal } from '../components/authors/AuthorModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

const AuthorsPage: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuthStore();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

    // Delete Confirmation State
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<number | null>(null);

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

    const handleSave = async (authorDto: AuthorCreateDto) => {
        if (selectedAuthor) {
            const response = await authorService.update(selectedAuthor.id, authorDto);
            if (response.error) throw { message: response.error, errors: response.errors };
            await fetchAuthors();
            setIsModalOpen(false);
        } else {
            const response = await authorService.create(authorDto);
            if (response.error) throw { message: response.error, errors: response.errors };
            await fetchAuthors();
            setIsModalOpen(false);
        }
    };

    const handleEditClick = (author: Author) => {
        setSelectedAuthor(author);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedAuthor(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setAuthorToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (authorToDelete) {
            try {
                const response = await authorService.delete(authorToDelete);
                if (!response.error) {
                    setAuthors(prev => prev.filter(a => a.id !== authorToDelete));
                }
            } catch (error) {
                console.error("Error deleting author", error);
            } finally {
                setIsDeleteConfirmOpen(false);
                setAuthorToDelete(null);
            }
        }
    };

    const filteredAuthors = authors.filter(a =>
        a.firstName.toLowerCase().includes(search.toLowerCase()) ||
        a.lastName.toLowerCase().includes(search.toLowerCase())
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
                        <Users className="w-3 h-3" />
                        Directorio de Autores
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">Mentes <span className="text-slate-500">Creativas</span></h2>
                    <p className="text-slate-400 max-w-lg text-sm leading-relaxed">Gestiona la información biográfica y perfil de los autores que dan vida a tu colección.</p>
                </div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button onClick={handleAddClick} className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-600/20" variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Añadir Autor
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
                            placeholder="Buscar por nombre o apellido..."
                            className="w-full pl-12 pr-4 h-12 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="secondary" className="h-12 rounded-2xl px-5 text-slate-400 border-white/5 bg-white/5 hover:bg-white/10 w-full md:w-auto">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar
                    </Button>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">
                                <th className="px-8 py-5">Autor</th>
                                <th className="px-8 py-5">Biografía</th>
                                {isAdmin && <th className="px-8 py-5 text-right">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            <AnimatePresence mode="popLayout">
                                {isLoading ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={isAdmin ? 3 : 2} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Cargando...</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : filteredAuthors.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={isAdmin ? 3 : 2} className="px-8 py-20 text-center text-slate-500 font-medium italic">
                                            No se encontraron autores.
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredAuthors.map((author, idx) => (
                                        <motion.tr
                                            key={author.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner group-hover:border-primary-500/20 transition-all font-display font-bold text-primary-400">
                                                        {author.firstName[0]}{author.lastName[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-white text-base leading-tight">{author.firstName} {author.lastName}</div>
                                                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Escritor</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-slate-400 max-w-xl line-clamp-2 leading-relaxed italic">
                                                    "{author.biography || 'Sin biografía disponible.'}"
                                                </p>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEditClick(author)} className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(author.id)} className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
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
            </motion.div>

            <AuthorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                author={selectedAuthor}
            />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="¿Eliminar Autor?"
                message="Esta acción no se puede deshacer. El autor será removido permanentemente de tu directorio."
                confirmLabel="Sí, Eliminar"
                cancelLabel="No, Conservar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
};

export default AuthorsPage;
