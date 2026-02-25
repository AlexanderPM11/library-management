import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, ArrowRight, Store, Library } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { branchService } from '../api/services/branchService';
import { useNavigate } from 'react-router-dom';

const BranchSetupPage: React.FC = () => {
    const { updateToken, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phoneNumber: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { data, error: apiError } = await branchService.setup(formData);

        if (data && data.token) {
            updateToken(data.token);
            navigate('/');
        } else {
            setError(apiError || 'Error al configurar la sucursal');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl relative z-10"
            >
                <div className="bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                            <Library className="w-8 h-8 text-primary-400" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-3 italic uppercase">Bienvenido Administrador</h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
                            Para configurar su tienda de libros y comenzar a operar, por favor complete los detalles de su sucursal inicial.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Nombre de la Sucursal</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                    <Store className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej. Librería Central"
                                    className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-primary-500/50 focus:bg-white/[0.08] transition-all outline-none"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Dirección Física</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                    <MapPin className="w-5 h-5" />
                                </span>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ciudad, Calle, Nº"
                                    className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-primary-500/50 focus:bg-white/[0.08] transition-all outline-none"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-2">Teléfono de Contacto</label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                    <Phone className="w-5 h-5" />
                                </span>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Número de contacto..."
                                    className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm focus:border-primary-500/50 focus:bg-white/[0.08] transition-all outline-none"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="button"
                                onClick={logout}
                                className="px-6 py-4 rounded-2xl border border-white/5 text-slate-400 text-sm font-bold hover:bg-white/5 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:bg-primary-800 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Crear y Acceder
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em]">Sistema SIGPRO Corporativo &copy; 2024</p>
                </div>
            </motion.div>
        </div>
    );
};

export default BranchSetupPage;
