import React, { useEffect, useState } from 'react';
import { Book, Users, Tag, ArrowUpRight, TrendingUp, Sparkles, Clock, LayoutGrid, Building2, BarChart3, ShieldCheck, Activity } from 'lucide-react';
import { statisticsService } from '../api/services';
import { DashboardStats, RecentActivity, SuperAdminStats } from '../api/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    Cell,
    PieChart,
    Pie
} from 'recharts';

const CHART_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'];

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const { isSuperAdmin } = useAuthStore();
    const [statsData, setStatsData] = useState<DashboardStats | null>(null);
    const [superStats, setSuperStats] = useState<SuperAdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (isSuperAdmin) {
                const response = await statisticsService.getSuperAdminStats();
                if (response.data) setSuperStats(response.data);
            } else {
                const response = await statisticsService.getDashboardStats();
                if (response.data) setStatsData(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [isSuperAdmin]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                    <p className="text-white font-bold text-xs uppercase tracking-wider mb-1">{payload[0].payload.categoryName || payload[0].payload.branchName}</p>
                    <p className="text-primary-400 font-display text-lg">{payload[0].value} <span className="text-[10px] text-slate-400 font-sans">libros</span></p>
                </div>
            );
        }
        return null;
    };

    const renderSuperAdminChart = () => {
        if (!superStats) return null;

        if (superStats.topBranchesByBooks.length === 0) {
            return (
                <div className="h-[300px] flex flex-col items-center justify-center gap-4 text-slate-500 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                    <BarChart3 className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium">No hay libros registrados en las sucursales</p>
                </div>
            );
        }
        
        return (
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={superStats.topBranchesByBooks} layout="vertical" margin={{ left: -10, right: 30, top: 10, bottom: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis 
                            dataKey="branchName" 
                            type="category" 
                            width={120} 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: '600' }}
                        />
                        <Tooltip 
                            content={<CustomTooltip />} 
                            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 10 }} 
                        />
                        <Bar 
                            dataKey="bookCount" 
                            radius={[0, 10, 10, 0]} 
                            barSize={24}
                            animationDuration={2000}
                        >
                            {superStats.topBranchesByBooks.map((_, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                                    fillOpacity={0.8}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderAdminChart = () => {
        if (!statsData?.booksByCategory || statsData.booksByCategory.length === 0) return (
            <div className="h-64 flex items-center justify-center text-slate-500 italic text-sm">
                No hay datos de distribución disponibles.
            </div>
        );

        return (
            <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={statsData.booksByCategory}
                            nameKey="categoryName"
                            dataKey="bookCount"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            animationBegin={200}
                            animationDuration={1800}
                            stroke="none"
                        >
                            {statsData.booksByCategory.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                
                {/* Visual Center Decoration */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-tight">Total<br/>Categorías</p>
                        <p className="text-2xl font-display font-bold text-white">{statsData.booksByCategory.length}</p>
                    </div>
                </div>
            </div>
        );
    };

    if (isSuperAdmin) {
        return (
            <div className="space-y-12 pb-20">
                {/* SuperAdmin Hero */}
                <div className="relative">
                    <div className="relative z-10">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="w-4 h-4 text-primary-400" />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500">Administración Global del Sistema</span>
                        </motion.div>
                        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                            Visión General de la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-500">Red</span>
                        </motion.h2>
                        <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">Monitoreo completo de todas las sucursales, usuarios y activos digitales en tu infraestructura.</p>
                    </div>
                </div>

                {/* SuperAdmin Grid */}
                <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-white/[0.03] animate-pulse rounded-[2rem] border border-white/5" />)
                    ) : (
                        <>
                            <StatCard 
                                name="Librerías Activas" 
                                value={`${superStats?.activeBranchesCount}/${superStats?.totalBranches}`} 
                                icon={Building2} 
                                color="text-blue-400" 
                                bg="bg-blue-500/10" 
                                border="border-blue-500/20" 
                            />
                            <StatCard 
                                name="Usuarios Activos" 
                                value={superStats?.totalActiveUsers.toString() || "0"} 
                                icon={Users} 
                                color="text-emerald-400" 
                                bg="bg-emerald-500/10" 
                                border="border-emerald-500/20" 
                            />
                            <StatCard 
                                name="Acervo Global" 
                                value={superStats?.totalSystemBooks.toString() || "0"} 
                                icon={Book} 
                                color="text-fuchsia-400" 
                                bg="bg-fuchsia-500/10" 
                                border="border-fuchsia-500/20" 
                            />
                            <StatCard 
                                name="Salud del Sistema" 
                                value="99.9%" 
                                icon={Activity} 
                                color="text-primary-400" 
                                bg="bg-primary-500/10" 
                                border="border-primary-500/20" 
                            />
                        </>
                    )}
                </motion.div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Feed */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                <Clock className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-white">Actividad Global</h3>
                        </div>
                        <div className="space-y-4">
                            {superStats?.globalActivities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                                        <TrendingUp className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">{activity.message}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{activity.title} • {activity.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Chart Card */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-gradient-to-br from-slate-900 to-slate-950 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden relative flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl" />
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                                    <BarChart3 className="w-6 h-6 text-primary-400" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-white">Distribución por Sucursal</h3>
                            </div>
                            <div className="flex-1 flex items-center">
                                {renderSuperAdminChart()}
                            </div>
                            <button onClick={() => navigate('/branches')} className="mt-8 w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all uppercase tracking-[0.2em]">Gestionar Sucursales</button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Default Branch Dashboard
    const statsCards = statsData ? [
        { name: 'Libros Totales', value: statsData.totalBooks.toString(), icon: Book, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { name: 'Autores', value: statsData.totalAuthors.toString(), icon: Users, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
        { name: 'Categorías', value: statsData.totalCategories.toString(), icon: Tag, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    ] : [];

    return (
        <div className="space-y-12 pb-20">
            <div className="relative">
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-primary-400" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-500">Panel de Control Real</span>
                    </motion.div>
                    <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl font-display font-bold text-white mb-4 tracking-tight">
                        Estado del <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-500">Catálogo</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                        Administra tu biblioteca con datos en tiempo real sincronizados directamente desde el núcleo del sistema.
                    </motion.p>
                </div>
            </div>

            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => <div key={i} className="h-64 bg-white/[0.03] animate-pulse rounded-[2rem] border border-white/5" />)
                ) : (
                    statsCards.map(stat => (
                        <StatCard key={stat.name} {...stat} onClick={() => navigate(stat.name === 'Libros Totales' ? '/books' : stat.name === 'Autores' ? '/authors' : '/categories')} />
                    ))
                )}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Activity Feed */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-white/[0.04] to-transparent backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                                <Clock className="w-6 h-6 text-primary-400" />
                            </div>
                            <h3 className="text-xl font-display font-bold text-white">Actividad Reciente</h3>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {statsData?.recentActivities && statsData.recentActivities.length > 0 ? (
                            statsData.recentActivities.map((activity, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary-500/30 transition-all">
                                        <Book className="w-5 h-5 text-slate-400 group-hover:text-primary-400 transition-colors" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white mb-1">{activity.message}</p>
                                        <p className="text-xs text-slate-500">{activity.title} • {activity.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 italic">No hay actividad reciente.</div>
                        )}
                    </div>
                </motion.div>
                
                {/* Visual Chart for Admin */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                            <BarChart3 className="w-6 h-6 text-primary-400" />
                        </div>
                        <h3 className="text-xl font-display font-bold text-white">Libros por Categoría</h3>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        {isLoading ? (
                            <div className="h-64 bg-white/5 animate-pulse rounded-2xl" />
                        ) : (
                            <>
                                <div className="flex-1">
                                    {renderAdminChart()}
                                </div>
                                {statsData?.booksByCategory && statsData.booksByCategory.length > 0 && (
                                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
                                        {statsData.booksByCategory.map((category, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{category.categoryName}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard: React.FC<{ name: string; value: string; icon: any; color: string; bg: string; border: string; onClick?: () => void }> = ({ name, value, icon: Icon, color, bg, border, onClick }) => (
    <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        className="group relative bg-white/[0.03] backdrop-blur-md p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all duration-300 shadow-2xl overflow-hidden cursor-pointer"
        onClick={onClick}
    >
        <div className={`absolute -right-8 -top-8 w-32 h-32 ${bg} rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500`} />
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
                <div className={`${bg} ${color} p-4 rounded-2xl ring-1 ${border} shadow-inner`}>
                    <Icon className="w-7 h-7" />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold ring-1 ring-emerald-500/20">
                    <TrendingUp className="w-3 h-3" /> Sincronizado
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-4xl lg:text-5xl font-display font-bold text-white tracking-tighter">{value}</div>
                <div className="text-slate-500 text-sm font-bold uppercase tracking-[0.1em]">{name}</div>
            </div>
            {onClick && (
                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-medium">Fuente: Datos del Sistema</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
            )}
        </div>
    </motion.div>
);

export default DashboardPage;

