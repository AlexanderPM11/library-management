import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
    variant = 'danger'
}) => {
    const variantConfig = {
        danger: {
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            button: 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
        },
        warning: {
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
        },
        info: {
            icon: AlertTriangle,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20',
            button: 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20'
        }
    };

    const config = variantConfig[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-slate-900/90 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Header/Icon */}
                        <div className="pt-10 pb-6 flex flex-col items-center">
                            <div className={`w-20 h-20 ${config.bg} rounded-3xl flex items-center justify-center border ${config.border} mb-6 shadow-inner`}>
                                <config.icon className={`w-10 h-10 ${config.color}`} />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white px-8 text-center">{title}</h3>
                        </div>

                        {/* Content */}
                        <div className="px-10 pb-10 text-center">
                            <p className="text-slate-400 text-sm leading-relaxed mb-10">
                                {message}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 px-6 h-14 rounded-2xl bg-white/5 border border-white/5 text-slate-400 font-bold hover:bg-white/10 hover:text-white transition-all order-2 sm:order-1"
                                >
                                    {cancelLabel}
                                </button>
                                <Button
                                    onClick={onConfirm}
                                    className={`flex-1 h-14 rounded-2xl font-bold shadow-xl border-none ${config.button} order-1 sm:order-2`}
                                >
                                    {confirmLabel}
                                </Button>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={onCancel}
                            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
