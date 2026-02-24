import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';
import { Bell, Search, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const MainLayout: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex h-screen bg-slate-950 text-slate-100 w-full overflow-hidden font-sans selection:bg-primary-500/30">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none"></div>

            <Sidebar />

            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                {/* Premium Header */}
                <header className="h-20 bg-slate-950/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 z-20">
                    <div className="flex items-center gap-4 flex-1">
                        <button className="lg:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>

                        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl w-96 group focus-within:bg-white/5 focus-within:border-primary-500/30 transition-all">
                            <Search className="w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar en el catálogo..."
                                className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-600 w-full"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-slate-950"></span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-white leading-none mb-1">{user?.email?.split('@')[0]}</p>
                                <p className="text-[10px] font-bold text-primary-500 uppercase tracking-widest">{user?.role}</p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg cursor-pointer"
                            >
                                <span className="text-sm font-bold text-white">{user?.email?.[0].toUpperCase()}</span>
                            </motion.div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <div className="max-w-[1600px] mx-auto p-8 lg:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Outlet />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
