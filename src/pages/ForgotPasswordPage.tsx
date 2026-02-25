import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../api/services/authService';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        if (!email) {
            setError('Por favor increse su correo electrónico.');
            setIsLoading(false);
            return;
        }

        try {
            const resp = await authService.forgotPassword(email);
            if (!resp.error) {
                setSuccessMessage('Si tu correo está registrado, recibirás un enlace mágico para restaurar tu contraseña.');
                setEmail('');
            } else {
                setError(resp.error);
            }
        } catch (err: any) {
            setError('Hubo un problema de conexión. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex font-sans selection:bg-primary-500/30">
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] relative z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[#0f1117] -z-10 lg:bg-transparent" />
                
                <div className="w-full max-w-sm mx-auto p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-blur-none lg:p-0">
                    <div className="mb-10 lg:text-left text-center">
                        <div className="flex justify-center lg:justify-start items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                                <span className="text-white font-bold text-xl font-display">L</span>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">LibraryApp</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-3">Recuperar Acceso</h2>
                        <p className="text-slate-400 text-sm">
                            Ingresa el correo electrónico asociado a tu cuenta y te enviaremos instrucciones para restaurar tu contraseña.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-primary-500/10 border border-primary-500/20 text-primary-400 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {!successMessage && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-xs font-bold tracking-wide text-slate-400 uppercase">
                                        Correo Electrónico
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-primary-400 transition-colors">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all sm:text-sm"
                                            placeholder="tu@correo.com"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-primary-500/25 text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1117] focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative z-10 shrink-0">
                                        {isLoading ? 'Enviando enlace...' : 'Enviar Enlace de Recuperación'}
                                    </span>
                                    {!isLoading && <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </>
                        )}

                        <div className="text-center mt-6">
                            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors group">
                                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c23] to-[#0f1117] z-0" />
                <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-primary-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
                <div className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[70%] bg-fuchsia-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
                
                <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
                    <div className="max-w-xl text-center">
                        <h2 className="text-4xl font-display font-bold text-white mb-6 leading-tight">
                            Recupera el control de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-fuchsia-400">seguridad</span>.
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed font-light">
                            Te proporcionaremos acceso seguro de inmediato empleando confirmación tokenizada a tu correo.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
