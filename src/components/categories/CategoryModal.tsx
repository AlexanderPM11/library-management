import React, { useEffect, useState } from 'react';
import { X, Tag, Type, FileText, Save } from 'lucide-react';
import { Category, CategoryCreateDto } from '../../api/types';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (category: CategoryCreateDto) => Promise<void>;
    category?: Category | null;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSave, category }) => {
    const [formData, setFormData] = useState<CategoryCreateDto>({
        name: '',
        description: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData({
                    name: category.name,
                    description: category.description || ''
                });
            } else {
                setFormData({
                    name: '',
                    description: ''
                });
            }
            setError(null);
            setValidationErrors([]);
        }
    }, [isOpen, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);
        setValidationErrors([]);

        try {
            await onSave(formData);
        } catch (error: any) {
            console.error("Error saving category", error);
            setError(error.message || "Error al guardar la categoría");
            if (error.errors) setValidationErrors(error.errors);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="px-8 flex items-center justify-between border-b border-white/5 bg-white/[0.02] shrink-0 h-24">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30 text-primary-400">
                                    <Tag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-bold text-white">
                                        {category ? 'Editar Categoría' : 'Nueva Categoría'}
                                    </h3>
                                    <p className="text-sm text-slate-400">
                                        {category ? 'Modifica los detalles de la categoría seleccionada.' : 'Añade una nueva categoría para organizar tus libros.'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form id="category-form" onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

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

                            <div className="grid grid-cols-1 gap-6">
                                {/* Name */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <Type className="w-3.5 h-3.5" /> Nombre
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 h-12 text-white text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all"
                                        placeholder="Ej. Ciencia Ficción"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={isSaving}
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-3.5 h-3.5" /> Descripción (Opcional)
                                    </label>
                                    <textarea
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 min-h-[120px] text-white text-sm focus:outline-none focus:border-primary-500/50 focus:bg-white/[0.05] transition-all resize-none"
                                        placeholder="Escribe una breve descripción de esta categoría..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        disabled={isSaving}
                                        maxLength={500}
                                    ></textarea>
                                </div>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="px-8 flex items-center justify-end gap-3 border-t border-white/5 bg-white/[0.02] shrink-0 h-24 mt-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSaving}
                                className="px-6 h-12 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <Button
                                type="submit"
                                form="category-form"
                                disabled={isSaving}
                                className="h-12 px-6 rounded-xl shadow-xl shadow-primary-500/20"
                                variant="primary"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {category ? 'Guardar Cambios' : 'Añadir Categoría'}
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
