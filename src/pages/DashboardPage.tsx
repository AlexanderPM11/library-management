import React, { useEffect, useState } from 'react';
import { Book, Users, Tag, ArrowUpRight, TrendingUp, Sparkles, Clock, LayoutGrid } from 'lucide-react';
import { statisticsService } from '../api/services';
import { DashboardStats, RecentActivity } from '../api/types';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await statisticsService.getDashboardStats();
            if (response.data) {
                setStatsData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const statsCards = statsData ? [
        { name: 'Libros Totales', value: statsData.totalBooks.toString(), icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', trend: '+5%' },
        { name: 'Autores', value: statsData.totalAuthors.toString(), icon: Users, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20', trend: '+2%' },
        { name: 'Categorías', value: statsData.totalCategories.toString(), icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', trend: 'N/A' },
    ] : [];

    return (
        <div className="space-y-12 pb-20">
            {/* Hero Section */}
            <div className="relative">
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500">Panel de Control Real</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl font-display font-bold text-white mb-4 tracking-tight"
                    >
                        Estado del <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-500">Catálogo</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl text-lg leading-relaxed"
                    >
                        Administra tu biblioteca con datos en tiempo real sincronizados directamente desde el núcleo del sistema.
                    </motion.p>
                </div>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-white/[0.03] animate-pulse rounded-[2rem] border border-white/5"></div>
                    ))
                ) : (
                    statsCards.map((stat) => (
                        <motion.div
                            key={stat.name}
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative bg-white/[0.03] backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 shadow-2xl overflow-hidden"
                        >
                            <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`}></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl ring-1 ${stat.border} shadow-inner`}>
                                        <stat.icon className="w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold ring-1 ring-emerald-500/20">
                                        <TrendingUp className="w-3 h-3" />
                                        Sincronizado
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="text-5xl font-display font-bold text-white tracking-tighter">{stat.value}</div>
                                    <div className="text-slate-500 text-sm font-bold uppercase tracking-[0.1em]">{stat.name}</div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 font-medium">Fuente: Base de Datos Principal</span>
                                    <button
                                        onClick={() => navigate(stat.name === 'Libros Totales' ? '/books' : stat.name === 'Autores' ? '/authors' : '/categories')}
                                        className="p-2 text-slate-400 hover:text-white transition-colors"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {/* Bottom Section: Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl"
                >
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                <Clock className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-white">Actividad Reciente Real</h3>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence>
                            {statsData?.recentActivities && statsData.recentActivities.length > 0 ? (
                                statsData.recentActivities.map((activity, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary-500/30 transition-all">
                                            <Book className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-white mb-1">{activity.message}</p>
                                            <p className="text-xs text-slate-500">{activity.title} • {new Date(activity.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-slate-500 italic">No hay actividad reciente registrada.</div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Quick Shortcuts */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-primary-600/10 backdrop-blur-md p-8 rounded-[2.5rem] border border-primary-500/20 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 h-full flex flex-col">
                        <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/40 mb-8">
                            <LayoutGrid className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-4 leading-tight">Accesos Directos</h3>
                        <p className="text-sm text-primary-200/60 mb-8 leading-relaxed">Navega rápidamente a las secciones principales para gestionar recursos.</p>

                        <div className="mt-auto space-y-3">
                            <button
                                onClick={() => navigate('/books')}
                                className="w-full py-4 rounded-2xl bg-white text-slate-950 font-bold text-sm hover:bg-primary-50 transition-all shadow-xl"
                            >
                                Ver Todos los Libros
                            </button>
                            <button
                                onClick={() => navigate('/authors')}
                                className="w-full py-4 rounded-2xl bg-white/10 text-white font-bold text-sm border border-white/10 hover:bg-white/20 transition-all"
                            >
                                Gestionar Autores
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default DashboardPage;
