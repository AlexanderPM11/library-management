import React, { useEffect, useState } from 'react';
import { X, Book as BookIcon, Hash, Tag, Users, Package, Calendar, AlignLeft, Save } from 'lucide-react';
import { Book, BookCreateDto, Author, Category, Branch } from '../../api/types';
import { authorService, categoryService, branchService } from '../../api/services';
import { Button } from '../ui/Button';
import { SearchableSelect, SelectOption } from '../ui/SearchableSelect';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface BookModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (book: BookCreateDto) => Promise<void>;
    book?: Book | null;
}

const BookModal: React.FC<BookModalProps> = ({ isOpen, onClose, onSave, book }) => {
    const { isSuperAdmin } = useAuthStore();
    const [formData, setFormData] = useState<BookCreateDto>({
        title: '',
        isbn: '',
        description: '',
        publicationYear: new Date().getFullYear(),
        stock: 0,
        categoryId: 0,
        authorIds: [],
        branchId: null
    });

    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoadingFields, setIsLoadingFields] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadFields();
            if (book) {
                setFormData({
                    title: book.title,
                    isbn: book.isbn,
                    description: book.description,
                    publicationYear: book.publicationYear,
                    stock: book.stock,
                    categoryId: book.category.id,
                    authorIds: book.authors.map(a => a.id),
                    branchId: book.branchId
                });
            } else {
                setFormData({
                    title: '',
                    isbn: '',
                    description: '',
                    publicationYear: new Date().getFullYear(),
                    stock: 0,
                    categoryId: 0,
                    authorIds: [],
                    branchId: null
                });
            }
            setError(null);
            setValidationErrors([]);
        }
    }, [isOpen, book]);

    const loadFields = async () => {
        setIsLoadingFields(true);
        try {
            const [authorsRes, categoriesRes, branchesRes] = await Promise.all([
                authorService.getAll(),
                categoryService.getAll(),
                branchService.getAll()
            ]);
            if (authorsRes.data) setAuthors(authorsRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);
            if (branchesRes.data) setBranches(branchesRes.data);
        } catch (error) {
            console.error("Error loading form fields", error);
        } finally {
            setIsLoadingFields(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setValidationErrors([]);
        try {
            await onSave(formData);
            // If onSave doesn't throw or return error handled in BooksPage, we can close
            // However, we need a way to know if it failed. 
            // Better: update BooksPage handleSave to return the response.
        } catch (error: any) {
            console.error("Error saving book", error);
            setError(error.message || "Error al guardar el libro");
            if (error.errors) setValidationErrors(error.errors);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAuthorToggle = (authorId: number) => {
        setFormData(prev => ({
            ...prev,
            authorIds: prev.authorIds.includes(authorId)
                ? prev.authorIds.filter(id => id !== authorId)
                : [...prev.authorIds, authorId]
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                                    <BookIcon className="w-5 h-5 text-primary-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-white">
                                        {book ? 'Editar Libro' : 'Nuevo Libro'}
                                    </h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                                        Gestión de Catálogo
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form id="book-form" onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">

                            {/* Error Display */}
                            {(error || validationErrors.length > 0) && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-2"
                                >
                                    {error && <p className="text-sm text-red-400 font-bold">{error}</p>}
                                    {validationErrors.length > 0 && (
                                        <ul className="list-disc list-inside space-y-1">
                                            {validationErrors.map((err, i) => (
                                                <li key={i} className="text-xs text-red-400/80">{err}</li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                        <BookIcon className="w-3 h-3" /> Título del Libro
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Ej: El nombre del viento"
                                        className="w-full px-4 h-12 bg-white/[0.03] border border-white/5 rounded-xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                {/* ISBN */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                        <Hash className="w-3 h-3" /> ISBN
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ISBN-13"
                                        className="w-full px-4 h-12 bg-white/[0.03] border border-white/5 rounded-xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white"
                                        value={formData.isbn}
                                        onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                                    />
                                </div>

                                {/* Category */}
                                <SearchableSelect
                                    label="Categoría"
                                    icon={Tag}
                                    placeholder="Seleccionar Categoría"
                                    options={categories.map(c => ({ label: c.name, value: c.id }))}
                                    value={formData.categoryId}
                                    onChange={(val) => setFormData({ ...formData, categoryId: val })}
                                />

                                {/* Stock */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                        <Package className="w-3 h-3" /> Stock Disponible
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full px-4 h-12 bg-white/[0.03] border border-white/5 rounded-xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                                    />
                                </div>

                                {/* Year */}
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" /> Año Publicación
                                    </label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 h-12 bg-white/[0.03] border border-white/5 rounded-xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white"
                                        value={formData.publicationYear}
                                        onChange={e => setFormData({ ...formData, publicationYear: parseInt(e.target.value) })}
                                    />
                                </div>

                                {/* Authors */}
                                <div className="md:col-span-2">
                                    <SearchableSelect
                                        multiple
                                        label="Autor(es)"
                                        icon={Users}
                                        placeholder="Buscar y seleccionar autores..."
                                        options={authors.map(a => ({ label: `${a.firstName} ${a.lastName}`, value: a.id }))}
                                        value={formData.authorIds}
                                        onChange={(vals) => setFormData({ ...formData, authorIds: vals })}
                                    />
                                    {formData.authorIds.length === 0 && (
                                        <p className="text-[10px] text-red-400/70 ml-1 mt-2 italic">* Selecciona al menos un autor</p>
                                    )}
                                </div>

                                {/* Branch Selection (SuperAdmin Only) */}
                                {isSuperAdmin && (
                                    <div className="md:col-span-2">
                                        <SearchableSelect
                                            label="Asignar a Sucursal"
                                            icon={Building2}
                                            placeholder="Seleccionar Sucursal..."
                                            options={branches.map(b => ({ label: b.name, value: b.id }))}
                                            value={formData.branchId || 0}
                                            onChange={(val) => setFormData({ ...formData, branchId: val || null })}
                                        />
                                    </div>
                                )}

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                                        <AlignLeft className="w-3 h-3" /> Descripción / Sinopsis
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-4 bg-white/[0.03] border border-white/5 rounded-xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSaving || formData.authorIds.length === 0 || formData.categoryId === 0}
                                className="h-11 px-8 rounded-xl shadow-lg shadow-primary-500/20"
                            >
                                {isSaving ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        <span>{book ? 'Actualizar Libro' : 'Guardar Libro'}</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookModal;
