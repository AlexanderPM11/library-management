import React, { useState, useEffect } from 'react';
import { X, ShieldPlus, ShieldAlert, KeyRound, UserPlus, Save, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreateUserDto, UpdateUserDto, UserDto, Branch } from '../../api/types';
import { Button } from '../ui/Button';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Building2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (user: CreateUserDto | UpdateUserDto) => Promise<void>;
    userToEdit?: UserDto;
    branches: Branch[];
}

export const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    onSave,
    userToEdit,
    branches
}) => {
    const { isSuperAdmin } = useAuthStore();
    const isEditMode = !!userToEdit;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [isActive, setIsActive] = useState(true);
    const [branchId, setBranchId] = useState<number | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && userToEdit) {
                setFirstName(userToEdit.firstName);
                setLastName(userToEdit.lastName);
                setEmail(userToEdit.email);
                setRole(userToEdit.roles[0] || 'User');
                setPassword(''); // Don't pre-fill password for editing
                setIsActive(userToEdit.isActive !== undefined ? userToEdit.isActive : true);
                setBranchId(userToEdit.branchId);
            } else {
                setFirstName('');
                setLastName('');
                setEmail('');
                setRole('Employee');
                setPassword('');
                setIsActive(true);
                setBranchId(null);
            }
            setError(null);
        }
    }, [isOpen, userToEdit, isEditMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            let userData: CreateUserDto | UpdateUserDto;
            if (isEditMode) {
                userData = {
                    firstName,
                    lastName,
                    email: email || undefined,
                    role: role || undefined,
                    password: password || undefined,
                    isActive,
                    branchId
                } as UpdateUserDto;
            } else {
                userData = {
                    firstName,
                    lastName,
                    email,
                    password,
                    role,
                    isActive,
                    branchId
                } as CreateUserDto;
            }

            await onSave(userData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Error inesperado');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto pt-20 pb-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative w-full max-w-2xl bg-[#0f1115] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
                >
                    {/* Decorative Background */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-primary-500/20 to-fuchsia-600/10 blur-[50px] pointer-events-none" />

                    <div className="relative p-8 md:p-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent z-0" />
                                    {isEditMode ? <ShieldAlert className="w-6 h-6 text-amber-400 z-10" /> : <UserPlus className="w-6 h-6 text-emerald-400 z-10" />}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                                        {isEditMode ? 'Editar Operador' : 'Nuevo Operador'}
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-widest">
                                        Administración de Nodos
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {error && (
                            <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                <span className="text-sm font-medium text-rose-300">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Nombres y Apellidos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Nombres</label>
                                    <input
                                        required
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium"
                                        placeholder="Ej. Ana María"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Apellidos</label>
                                    <input
                                        required
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium"
                                        placeholder="Ej. González"
                                    />
                                </div>
                            </div>

                            {/* Correo Electrónico */}
                            <div className="space-y-2 relative z-10">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2">Correo Electrónico</label>
                                <input
                                    required={!isEditMode}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium"
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>

                            {/* Rol y Clave */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20 bg-black/40 p-6 rounded-[2rem] border border-white/5">
                                <div className="space-y-2">
                                    <SearchableSelect
                                        label="Asignación de Rol"
                                        icon={ShieldPlus}
                                        placeholder="Seleccionar Rol..."
                                        options={[
                                            { label: 'Super Administrador', value: 'SuperAdmin' },
                                            { label: 'Administrador (Sucursal)', value: 'Admin' },
                                            { label: 'Empleado', value: 'Empleado' }
                                        ]}
                                        value={role}
                                        onChange={(val) => setRole(val as string)}
                                    />
                                </div>
                                {isSuperAdmin && (
                                    <div className="space-y-2 mt-4 md:mt-0">
                                        <SearchableSelect
                                            label="Sucursal Asignada"
                                            icon={Building2}
                                            placeholder="Seleccionar Sucursal..."
                                            options={[
                                                { label: 'Acceso Global', value: 'null' },
                                                ...branches.map(b => ({ label: b.name, value: b.id.toString() }))
                                            ]}
                                            value={branchId?.toString() || 'null'}
                                            onChange={(val) => setBranchId(val === 'null' ? null : parseInt(val as string))}
                                        />
                                    </div>
                                )}
                                <div className="space-y-2 mt-4 md:mt-0">
                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 ml-2 flex items-center gap-1.5"><KeyRound className="w-3 h-3" /> Llave Criptográfica</label>
                                    <input
                                        required={!isEditMode}
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-5 h-14 bg-white/[0.02] border border-white/10 rounded-2xl outline-none focus:bg-white/[0.04] focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all text-base text-white placeholder:text-slate-700 font-medium font-mono"
                                        placeholder={isEditMode ? "Tipea para sobrescribir la actual..." : "Obligatorio (mín 6 caracteres)"}
                                    />
                                </div>
                            </div>

                            {/* Estado del Usuario */}
                            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/10 rounded-2xl relative z-10 transition-colors hover:bg-white/[0.04]">
                                <div>
                                    <h4 className="text-sm font-bold text-white tracking-wide">Estado del Acceso</h4>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                                        Permite o bloquea el inicio de sesión
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-rose-500/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                                </label>
                            </div>

                            <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-6 h-14 rounded-2xl text-slate-400 font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <Button
                                    type="submit"
                                    isLoading={isLoading}
                                    className="w-full sm:w-auto !h-14 !px-8 rounded-2xl shadow-xl shadow-primary-500/20 text-sm tracking-widest uppercase font-black"
                                >
                                    {!isLoading && <Save className="w-5 h-5 mr-2" />}
                                    {isEditMode ? 'Guardar Cambios' : 'Generar Sesión'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
