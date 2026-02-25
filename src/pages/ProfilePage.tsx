import React, { useEffect, useState } from 'react';
import { User, Mail, Shield, Key, Save, AlertCircle, Activity, CheckCircle2, Hexagon, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../api/services';
import { useAuthStore } from '../store/authStore';
import { UserProfileDto } from '../api/types';
import { Button } from '../components/ui/Button';

export const ProfilePage: React.FC = () => {
    const { logout } = useAuthStore();
    const [profile, setProfile] = useState<UserProfileDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    // Status state
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            const { data, error } = await authService.getProfile();
            if (data) {
                setProfile(data);
                setFirstName(data.firstName);
                setLastName(data.lastName);
            } else if (error) {
                setMessage({ type: 'error', text: 'Error al cargar perfil.' });
            }
            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSaving(true);

        const { data, error } = await authService.updateProfile({
            firstName,
            lastName,
            currentPassword: currentPassword || undefined,
            newPassword: newPassword || undefined
        });

        if (data?.isSuccess) {
            setMessage({ type: 'success', text: 'Credenciales de identidad actualizadas satisfactoriamente.' });
            setCurrentPassword('');
            setNewPassword('');
            if (profile) {
                setProfile({ ...profile, firstName, lastName, fullName: `${firstName} ${lastName}`.trim() });
            }
        } else {
            setMessage({ type: 'error', text: error || data?.message || 'Error de sistema al actualizar.' });
        }
        setIsSaving(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Page Header (Matches AuditLogs / Other pages) */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-primary-500 font-bold text-[10px] uppercase tracking-[0.2em]"
                    >
                        <Fingerprint className="w-3 h-3" />
                        Configuración de Cuenta
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">
                        Tu <span className="text-slate-500">Identidad</span>
                    </h2>
                    <p className="text-slate-400 max-w-lg text-sm leading-relaxed">
                        Administra tus credenciales operativas, actualiza tu información personal y revisa los protocolos de acceso de tu nodo.
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-32 gap-3"
                    >
                        <div className="relative flex items-center justify-center">
                            <Hexagon className="w-12 h-12 text-primary-500/20 animate-spin-slow absolute" strokeWidth={1} />
                            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-4">Sincronizando Identidad...</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row relative"
                    >
                        {/* Background structural lines */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                            style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '4rem 4rem' }}
                        />

                        {/* Left Sidebar embedded filter / Identity Card */}
                        <div className="w-full xl:w-96 shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 bg-black/40 xl:bg-black/20 p-8 lg:p-10 space-y-10 relative overflow-hidden flex flex-col justify-between">
                            {/* Decorative glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                            <div className="relative z-10 space-y-8">
                                {/* Avatar & Primary Info */}
                                <div className="flex flex-col items-center text-center space-y-5">
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-500 to-fuchsia-600 rounded-[2.5rem] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                                        <div className="w-36 h-36 rounded-[2.5rem] bg-slate-950 border border-white/10 flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
                                            {profile?.fullName ? (
                                                <span className="text-5xl font-display font-light text-primary-400 group-hover:text-primary-300 transition-colors">
                                                    {profile.fullName.charAt(0)}{profile.lastName ? profile.lastName.charAt(0) : ''}
                                                </span>
                                            ) : (
                                                <User className="w-16 h-16 text-primary-500/50 group-hover:text-primary-400 transition-colors" strokeWidth={1} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-3xl font-display font-bold text-white tracking-tight">{profile?.fullName || profile?.email.split('@')[0]}</h3>
                                        <div className="inline-flex items-center justify-center gap-2 text-primary-400/80 text-sm font-mono bg-primary-500/10 px-3 py-1 rounded-full border border-primary-500/20">
                                            <Mail className="w-3.5 h-3.5" />
                                            {profile?.email}
                                        </div>
                                    </div>
                                </div>

                                {/* Roles Layout */}
                                <div className="space-y-3">
                                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 text-center">Protocolos de Acceso</h4>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {profile?.roles.map(role => (
                                            <div key={role} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs font-bold text-slate-300 uppercase tracking-widest shadow-inner relative overflow-hidden">
                                                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary-500 to-fuchsia-500" />
                                                <Shield className="w-3.5 h-3.5 text-slate-400" />
                                                {role}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-6 relative overflow-hidden mt-8">
                                <Activity className="absolute -right-4 -bottom-4 w-32 h-32 text-emerald-500/5" strokeWidth={1} />
                                <div className="relative z-10 space-y-2">
                                    <h4 className="text-emerald-400 font-bold text-sm tracking-widest uppercase">Sesión Encriptada</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        Sus credenciales están operando bajo cifrado de grado militar. Las modificaciones se trazan en los esquemas de auditoría globales.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Log List Area (Forms) */}
                        <div className="flex-1 p-8 lg:p-12 min-h-[500px] relative z-10">
                            <form onSubmit={handleSave} className="max-w-3xl mx-auto space-y-12">

                                {/* Status Message */}
                                <AnimatePresence mode="wait">
                                    {message && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, y: -10 }}
                                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={`overflow-hidden rounded-2xl border flex items-center gap-4 px-5 py-4 text-sm font-medium shadow-2xl
                                            ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/10' : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/10'}`}
                                        >
                                            {message.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
                                            <span className="tracking-wide">{message.text}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-12">

                                    {/* Personal Info Section */}
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-primary-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-display font-bold text-white tracking-tight">Datos del Operador</h4>
                                                <p className="text-slate-500 text-sm">Información visible para otros nodos en los logs.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/20 p-6 md:p-8 rounded-[2rem] border border-white/5">
                                            <div className="space-y-3">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Nombres</label>
                                                <input
                                                    type="text"
                                                    value={firstName}
                                                    onChange={e => setFirstName(e.target.value)}
                                                    placeholder="Ej. Juan Carlos"
                                                    className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Apellidos</label>
                                                <input
                                                    type="text"
                                                    value={lastName}
                                                    onChange={e => setLastName(e.target.value)}
                                                    placeholder="Ej. Pérez Gómez"
                                                    className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Security Section */}
                                    <motion.div variants={itemVariants} className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Key className="w-5 h-5 text-primary-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-display font-bold text-white tracking-tight">Credenciales de Acceso</h4>
                                                <p className="text-slate-500 text-sm">Modifica tu llave criptográfica. Déjalo en blanco si no deseas cambiarla.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-black/20 p-6 md:p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                                            {/* decorative lock bg */}
                                            <Key className="absolute -right-8 -bottom-8 w-40 h-40 text-black/40 rotate-12 pointer-events-none" strokeWidth={0.5} />

                                            <div className="space-y-3 relative z-10 w-full md:w-3/4">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Contraseña Actual</label>
                                                <input
                                                    type="password"
                                                    value={currentPassword}
                                                    onChange={e => setCurrentPassword(e.target.value)}
                                                    placeholder="Requerido para autorizar un cambio"
                                                    className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium font-mono"
                                                />
                                            </div>
                                            <div className="space-y-3 relative z-10 w-full md:w-3/4">
                                                <label className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Nueva Contraseña</label>
                                                <input
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={e => setNewPassword(e.target.value)}
                                                    placeholder="Nueva llave criptográfica"
                                                    className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium font-mono"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Actions */}
                                    <motion.div variants={itemVariants} className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4 border-t border-white/5">
                                        <button
                                            type="button"
                                            onClick={() => logout()}
                                            className="w-full sm:w-auto px-6 h-14 rounded-2xl text-rose-400 font-bold uppercase tracking-widest text-xs hover:bg-rose-500/10 transition-colors"
                                        >
                                            Desconectar Nodo
                                        </button>
                                        <Button
                                            type="submit"
                                            isLoading={isSaving}
                                            className="w-full sm:w-auto !h-14 !px-10 rounded-2xl shadow-xl shadow-primary-500/20 text-sm tracking-widest uppercase font-black"
                                        >
                                            {!isSaving && <Save className="w-5 h-5 mr-3" />}
                                            Inicializar Cambios
                                        </Button>
                                    </motion.div>

                                </motion.div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
