import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, Tag, Filter, MoreHorizontal } from 'lucide-react';
import { categoryService } from '../api/services';
import { Category } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryModal } from '../components/categories/CategoryModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CategoryCreateDto } from '../api/types';

const CategoriesPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { isAdmin } = useAuthStore();

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    // Delete Confirmation State
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await categoryService.getAll();
            if (!response.error && response.data) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error("Error fetching categories", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSave = async (categoryDto: CategoryCreateDto) => {
        if (selectedCategory) {
            const response = await categoryService.update(selectedCategory.id, categoryDto);
            if (response.error) throw { message: response.error, errors: response.errors };
            await fetchCategories();
            setIsModalOpen(false);
        } else {
            const response = await categoryService.create(categoryDto);
            if (response.error) throw { message: response.error, errors: response.errors };
            await fetchCategories();
            setIsModalOpen(false);
        }
    };

    const handleEditClick = (category: Category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setCategoryToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (categoryToDelete) {
            try {
                const response = await categoryService.delete(categoryToDelete);
                if (!response.error) {
                    setCategories(prev => prev.filter(c => c.id !== categoryToDelete));
                }
            } catch (error) {
                console.error("Error deleting category", error);
            } finally {
                setIsDeleteConfirmOpen(false);
                setCategoryToDelete(null);
            }
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
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
                        <Tag className="w-3 h-3" />
                        Taxonomía del Sistema
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">Géneros y <span className="text-slate-500">Temáticas</span></h2>
                    <p className="text-slate-400 max-w-lg text-sm leading-relaxed">Organiza y clasifica tu catálogo de libros para una navegación intuitiva y estructurada.</p>
                </div>

                {isAdmin && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button onClick={handleAddClick} className="h-12 px-6 rounded-2xl shadow-xl shadow-primary-600/20" variant="primary">
                            <Plus className="w-5 h-5 mr-2" />
                            Nueva Categoría
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
                            placeholder="Buscar categorías por nombre..."
                            className="w-full pl-12 pr-4 h-12 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500">
                                <th className="px-8 py-5">Nombre Categoría</th>
                                <th className="px-8 py-5">Descripción</th>
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
                                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Organizando...</span>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ) : filteredCategories.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <td colSpan={isAdmin ? 3 : 2} className="px-8 py-20 text-center text-slate-500 font-medium italic">
                                            No se encontraron categorías.
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filteredCategories.map((category, idx) => (
                                        <motion.tr
                                            key={category.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-white/5 text-primary-500 group-hover:scale-110 transition-transform">
                                                        <Tag className="w-4 h-4" />
                                                    </div>
                                                    <div className="font-bold text-white text-base leading-tight uppercase tracking-wider">{category.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                                                    {category.description || 'Sin descripción detallada.'}
                                                </p>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEditClick(category)} className="p-2.5 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => handleDeleteClick(category.id)} className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all">
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

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                category={selectedCategory}
            />

            <ConfirmDialog
                isOpen={isDeleteConfirmOpen}
                title="¿Eliminar Categoría?"
                message="Esta acción no se puede deshacer. La categoría será removida permanentemente."
                confirmLabel="Sí, Eliminar"
                cancelLabel="No, Conservar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteConfirmOpen(false)}
                variant="danger"
            />
        </div>
    );
};

export default CategoriesPage;
