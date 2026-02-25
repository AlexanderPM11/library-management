import React, { useEffect, useState } from 'react';
import { Building2, Plus, Search, MapPin, Phone, Mail, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { branchService } from '../api/services';
import { Branch } from '../api/types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

export const BranchesPage: React.FC = () => {
    const { isSuperAdmin } = useAuthStore();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadBranches = async () => {
        setIsLoading(true);
        const { data } = await branchService.getAll();
        if (data) {
            setBranches(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadBranches();
    }, []);

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(search.toLowerCase()) ||
        branch.address.toLowerCase().includes(search.toLowerCase())
    );

    if (!isSuperAdmin) {
        return <div className="p-20 text-center text-white font-bold">Acceso Denegado. Solo para Super Administradores.</div>;
    }

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
                        <Building2 className="w-3.5 h-3.5" />
                        Infraestructura Global • Control de Nodos
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">
                        Gestión de <span className="text-slate-500">Sucursales</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                        Administra los puntos físicos de operación. Define nuevas terminales de servicio y supervisa la distribución geográfica del sistema.
                    </p>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Button
                        className="!px-8 !py-4 rounded-2xl shadow-xl shadow-primary-500/20 text-sm tracking-widest uppercase font-black"
                    >
                        <Plus className="w-5 h-5 mr-3" />
                        Nueva Sucursal
                    </Button>
                </motion.div>
            </div>

            {/* Main Content Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row relative"
            >
                {/* Structural background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                    style={{ backgroundImage: 'linear-gradient(to bottom, #3b82f6, transparent)' }} />

                {/* Left filtering sidebar */}
                <div className="w-full xl:w-80 shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 bg-black/40 xl:bg-black/20 p-8 lg:p-10 space-y-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Filtrar Sedes</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nombre o dirección..."
                                    className="w-full pl-12 pr-4 h-14 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600 font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-primary-500/5 rounded-[2rem] border border-primary-500/10 space-y-4">
                            <h4 className="text-white font-bold text-sm tracking-wide">Red Operativa</h4>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Total Nodos:</span>
                                <span className="font-mono text-primary-400 font-bold">{branches.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Lists */}
                <div className="flex-1 p-8 lg:p-12 min-h-[500px] relative z-10">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 gap-3">
                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-4">Escaneando red...</span>
                            </motion.div>
                        ) : filteredBranches.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
                                <Building className="w-16 h-16 text-slate-800 mb-6" strokeWidth={1} />
                                <h3 className="text-2xl text-slate-300 font-display font-bold mb-2 tracking-tight">Sin resultados</h3>
                                <p className="text-slate-500 text-sm max-w-sm">No existen sucursales registradas con esos criterios.</p>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredBranches.map((branch, idx) => (
                                    <motion.div
                                        key={branch.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-primary-500/20 transition-all group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-4">
                                            <span className="text-[10px] font-mono text-slate-600 group-hover:text-primary-500 transition-colors">#{branch.id}</span>
                                        </div>

                                        <div className="flex items-start gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20 shrink-0">
                                                <Building2 className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors">{branch.name}</h3>
                                                <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-medium">{branch.address}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <Phone className="w-4 h-4 text-slate-600" />
                                                <span className="font-medium">{branch.phoneNumber}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <Mail className="w-4 h-4 text-slate-600" />
                                                <span className="font-medium">sucursal_{branch.id}@library.app</span>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex justify-end">
                                            <button className="text-[10px] uppercase tracking-widest font-black text-primary-500 hover:text-primary-400 transition-colors py-2 px-4 rounded-lg bg-primary-500/5 border border-primary-500/10">
                                                Configurar Nodo
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default BranchesPage;
