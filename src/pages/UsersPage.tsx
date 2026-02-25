import React, { useEffect, useState } from 'react';
import { User, Shield, ShieldAlert, Plus, Search, PencilLine, Mail, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../api/services';
import { UserDto, CreateUserDto, UpdateUserDto } from '../api/types';
import { Button } from '../components/ui/Button';
import { UserModal } from '../components/users/UserModal';
import { useAuthStore } from '../store/authStore';

export const UsersPage: React.FC = () => {
    const { user: currentUser } = useAuthStore();
    const [users, setUsers] = useState<UserDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserDto | undefined>();

    const loadUsers = async () => {
        setIsLoading(true);
        const { data } = await userService.getAll();
        if (data) {
            setUsers(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateEdit = async (data: CreateUserDto | UpdateUserDto) => {
        let response;
        if (editingUser) {
            response = await userService.update(editingUser.id, data as UpdateUserDto);
        } else {
            response = await userService.create(data as CreateUserDto);
        }

        if (response.error) {
            const errorMessage = response.errors && response.errors.length > 0
                ? `${response.error} - ${response.errors.join(', ')}`
                : response.error;
            throw new Error(errorMessage);
        }

        if (response.data?.isSuccess) {
            await loadUsers();
            return;
        }

        throw new Error(response.data?.message || "Ocurrió un error al procesar la solicitud.");
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.roles.some(r => r.toLowerCase().includes(search.toLowerCase()))
    );

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
                        <ShieldAlert className="w-3 h-3" />
                        Acceso Restringido • Rol Administrativo
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">
                        Gestión de <span className="text-slate-500">Usuarios</span>
                    </h2>
                    <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                        Control total sobre nodos y terminales del sistema. Agrega o suspende miembros operativos y asigna protocolos criptográficos de acceso.
                    </p>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Button
                        onClick={() => { setEditingUser(undefined); setIsModalOpen(true); }}
                        className="!px-8 !py-4 rounded-2xl shadow-xl shadow-primary-500/20 text-sm tracking-widest uppercase font-black"
                    >
                        <Plus className="w-5 h-5 mr-3" />
                        Nuevo Operador
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
                    style={{ backgroundImage: 'linear-gradient(wrap.red, transparent)' }} />

                {/* Left filtering sidebar */}
                <div className="w-full xl:w-80 shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 bg-black/40 xl:bg-black/20 p-8 lg:p-10 space-y-8 relative overflow-hidden">
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Localizar Nodo</label>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Nombre, email, id..."
                                    className="w-full pl-12 pr-4 h-14 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600 font-medium"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-primary-500/5 rounded-[2rem] border border-primary-500/10 space-y-4">
                            <h4 className="text-white font-bold text-sm tracking-wide">Métricas</h4>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Total Identidades:</span>
                                <span className="font-mono text-primary-400 font-bold">{users.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>Administradores:</span>
                                <span className="font-mono text-amber-400 font-bold">{users.filter(u => u.roles.includes("Admin")).length}</span>
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
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-4">Analizando red...</span>
                            </motion.div>
                        ) : filteredUsers.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
                                <User className="w-16 h-16 text-slate-800 mb-6" strokeWidth={1} />
                                <h3 className="text-2xl text-slate-300 font-display font-bold mb-2 tracking-tight">Vacio detectado</h3>
                                <p className="text-slate-500 text-sm max-w-sm">No existen terminales con los parámetros de búsqueda indicados.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/5">
                                            <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 whitespace-nowrap bg-black/20">Operador</th>
                                            <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 whitespace-nowrap bg-black/20">Contacto & Estado</th>
                                            <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 whitespace-nowrap bg-black/20">Privilegios</th>
                                            <th className="px-6 py-5 text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 whitespace-nowrap bg-black/20 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredUsers.map((user, idx) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                                className="group hover:bg-white/[0.02] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-[1rem] bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                                                            <span className="text-sm font-display font-bold text-primary-400">
                                                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-white tracking-wide">{user.fullName}</p>
                                                            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">ID: {user.id.split('-')[0]}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-2.5">
                                                        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium tracking-wide">
                                                            <Mail className="w-4 h-4 text-slate-500" />
                                                            {user.email}
                                                        </div>
                                                        <div>
                                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border inline-block
                                                                ${user.isActive
                                                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                                                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]'}
                                                            `}>
                                                                {user.isActive ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {user.roles.map(role => (
                                                            <span key={role} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl border flex items-center gap-1.5 whitespace-nowrap
                                                                ${role === 'Admin' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-primary-500/10 border-primary-500/20 text-primary-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}
                                                            `}>
                                                                <Shield className="w-3.5 h-3.5" />
                                                                {role === 'Admin' ? 'Administrador' : 'Usuario Obj.'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {currentUser?.email !== user.email ? (
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
                                                                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-primary-500/20 text-slate-400 hover:text-primary-400 flex items-center justify-center transition-all border border-white/5 shadow-sm"
                                                                title="Editar Operador"
                                                            >
                                                                <PencilLine className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl bg-white/5 text-slate-500 border border-white/5 shadow-inner">
                                                                Tú
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleCreateEdit}
                userToEdit={editingUser}
            />
        </div>
    );
};

export default UsersPage;
