import React from 'react';
import { NavLink } from 'react-router-dom';
import { Book, Users, Tag, LayoutDashboard, LogOut, Library, ChevronRight, ShieldAlert, UserCircle, Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const { logout, user, isAdmin } = useAuthStore();

    const menuItems = [
        { name: 'Overview', path: '/', icon: LayoutDashboard },
        { name: 'Bookshelf', path: '/books', icon: Book },
        { name: 'Authors', path: '/authors', icon: Users },
        { name: 'Categories', path: '/categories', icon: Tag },
        { name: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert },
        { name: 'My Profile', path: '/profile', icon: UserCircle },
    ];

    if (isAdmin) {
        menuItems.splice(4, 0, { name: 'Users (Admin)', path: '/users', icon: ShieldAlert });
    }

    if (useAuthStore.getState().isSuperAdmin) {
        menuItems.splice(5, 0, { name: 'Branches', path: '/branches', icon: Building2 });
    }

    return (
        <aside className="hidden lg:flex flex-col h-screen w-72 bg-slate-950/50 backdrop-blur-3xl border-r border-white/5 relative z-20">
            {/* Top Branding */}
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-white/10">
                        <Library className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold text-white tracking-tight">LibraryApp</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">LMS Management</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4">
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-600">Main Menu</span>
                </div>

                {menuItems.map((item, index) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-white/5 text-white ring-1 ring-white/10 shadow-lg shadow-black/20"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary-400" : "group-hover:text-primary-400")} />
                                <span className="flex-1 font-medium text-sm tracking-wide">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 w-1 h-5 bg-primary-500 rounded-r-full"
                                    />
                                )}
                                <ChevronRight className={cn("w-4 h-4 opacity-0 transition-opacity group-hover:opacity-100", isActive && "opacity-0")} />
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Profile / Logout Section */}
            <div className="p-4 mt-auto">
                <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                            <span className="text-xs font-bold text-primary-400">{user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                            <p className="text-[10px] text-primary-500 font-bold uppercase tracking-wider">{user?.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300 text-xs font-bold"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>

                <p className="text-[10px] text-center text-slate-600 font-medium">© 2026 - {new Date().getFullYear()} LibraryApp v1.0</p>
            </div>
        </aside>
    );
};

export default Sidebar;
