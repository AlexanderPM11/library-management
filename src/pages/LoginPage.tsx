import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Library, ArrowRight, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';

const loginSchema = z.object({
    email: z.string().min(1, 'El correo es requerido').email('Debe ser un correo electrónico válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
    const [globalError, setGlobalError] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (data: LoginFormValues) => {
        setGlobalError('');
        const result = await login(data);

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            setGlobalError(result.error || 'Credenciales inválidas o error de conexión');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans overflow-hidden relative selection:bg-primary-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 -left-64 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-64 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-64 left-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] relative z-10 w-full mx-auto lg:h-screen lg:overflow-y-auto lg:border-r border-slate-800/50 bg-slate-950/60 backdrop-blur-3xl shadow-2xl shadow-black">
                <div className="mx-auto w-full max-w-sm lg:w-[400px]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-primary-500/20 ring-1 ring-white/10">
                                <Library className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold tracking-tight text-white">LibraryApp</span>
                        </div>

                        <h2 className="text-4xl font-display font-semibold text-white tracking-tight mb-3">
                            Bienvenido<br />de nuevo.
                        </h2>
                        <p className="text-slate-400 mb-8 text-lg font-light">
                            Accede para gestionar tu repositorio literario con precisión editorial.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {globalError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium backdrop-blur-md">
                                {globalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-300">Correo Electrónico</label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        {...register('email')}
                                        className={`w-full px-4 py-3.5 bg-slate-900/50 border ${errors.email ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-800 focus:border-primary-500/50 focus:ring-primary-500/20'} rounded-xl text-white placeholder-slate-500 focus:ring-4 outline-none transition-all`}
                                        placeholder="admin@library.com"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-red-400 font-medium">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-slate-300">Contraseña</label>
                                    <a href="#" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">¿Olvidaste tu contraseña?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type="password"
                                        {...register('password')}
                                        className={`w-full px-4 py-3.5 bg-slate-900/50 border ${errors.password ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-800 focus:border-primary-500/50 focus:ring-primary-500/20'} rounded-xl text-white placeholder-slate-500 focus:ring-4 outline-none transition-all`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && <p className="mt-2 text-sm text-red-400 font-medium">{errors.password.message}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-2 group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/40 to-fuchsia-600/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <span className="relative z-10 flex items-center">
                                            Iniciar Sesión
                                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="mt-12 pt-8 border-t border-slate-800/50 text-center"
                    >
                        <p className="text-slate-500 text-sm flex flex-col gap-2 items-center justify-center">
                            <Sparkles className="w-4 h-4 text-primary-500/50" />
                            <span>Credenciales por defecto: <br /><strong className="text-slate-300 font-medium">admin@library.com</strong> / <strong className="text-slate-300 font-medium">Admin123!</strong></span>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side artistic feature */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-950 p-8">
                <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2790&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-0"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 max-w-2xl text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                        <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">Sistema de Gestión Avanzado</span>
                    </div>
                    <h1 className="text-6xl font-display font-medium text-white leading-[1.1] mb-6 tracking-tight">
                        La sabiduría del mundo, organizada con <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-400 italic">elegancia</span>.
                    </h1>
                    <p className="text-xl text-slate-400 font-light max-w-xl mx-auto leading-relaxed">
                        Control de inventario, gestión de autores y catalogación fluida con una interfaz moderna y audaz diseñada para curadores exigentes.
                    </p>
                </motion.div>

                {/* Decorative floating elements */}
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl -rotate-12 shadow-2xl flex items-center justify-center"
                >
                    <BookOpen className="w-10 h-10 text-white/30" />
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
