import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SelectOption {
    label: string;
    value: string | number;
}

interface SearchableSelectProps {
    options: SelectOption[];
    value: (string | number) | (string | number)[];
    onChange: (value: any) => void;
    multiple?: boolean;
    placeholder?: string;
    label?: string;
    icon?: React.ElementType;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    multiple = false,
    placeholder = 'Seleccionar...',
    label,
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const isSelected = (val: string | number) => {
        if (multiple && Array.isArray(value)) {
            return value.includes(val);
        }
        return value === val;
    };

    const handleSelect = (val: string | number) => {
        if (multiple && Array.isArray(value)) {
            const newValue = value.includes(val)
                ? value.filter(v => v !== val)
                : [...value, val];
            onChange(newValue);
        } else {
            onChange(val);
            setIsOpen(false);
        }
    };

    const selectedLabels = options
        .filter(opt => isSelected(opt.value))
        .map(opt => opt.label);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            {label && (
                <label className="text-[10px] uppercase tracking-widest font-bold text-slate-500 ml-1 flex items-center gap-2">
                    {Icon && <Icon className="w-3 h-3" />} {label}
                </label>
            )}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-4 min-h-[3rem] py-2 bg-white/[0.03] border ${isOpen ? 'border-primary-500/50' : 'border-white/5'} rounded-xl cursor-pointer flex items-center justify-between group hover:bg-white/[0.05] transition-all`}
            >
                <div className="flex flex-wrap gap-1 items-center">
                    {selectedLabels.length > 0 ? (
                        multiple ? (
                            selectedLabels.map(lbl => (
                                <span key={lbl} className="bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded-lg text-[10px] font-bold border border-primary-500/20 flex items-center gap-1">
                                    {lbl}
                                    <X
                                        className="w-2.5 h-2.5 cursor-pointer hover:text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const valToRemove = options.find(o => o.label === lbl)?.value;
                                            if (valToRemove !== undefined) handleSelect(valToRemove);
                                        }}
                                    />
                                </span>
                            ))
                        ) : (
                            <span className="text-sm text-white">{selectedLabels[0]}</span>
                        )
                    ) : (
                        <span className="text-sm text-slate-600 italic">{placeholder}</span>
                    )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-white transition-all ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[60] w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-3 border-b border-white/5 bg-white/[0.02]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar..."
                                    className="w-full pl-9 pr-4 h-9 bg-white/[0.03] border border-white/5 rounded-lg outline-none focus:border-primary-500/30 text-xs text-white"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto custom-scrollbar py-2">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(opt => (
                                    <div
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        className={`px-4 py-2.5 text-sm flex items-center justify-between cursor-pointer transition-colors ${isSelected(opt.value) ? 'bg-primary-500/20 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected(opt.value) && <Check className="w-3.5 h-3.5 text-primary-400" />}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-6 text-center text-xs text-slate-600 italic">
                                    No se encontraron resultados
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
