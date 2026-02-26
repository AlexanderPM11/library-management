import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authService } from '../api/services/authService';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Extraer email y token desde los query parameters de la URL (Ej: /reset-password?email=abc&token=123)
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('email');
        const tokenParam = params.get('token');

        if (emailParam && tokenParam) {
            setEmail(emailParam);
            // Replace spaces with + safely for base64 tokens that might have been mangled in URL encoding
            setToken(tokenParam.replace(/ /g, '+'));
        } else {
            setError('Enlace inválido o expirado. Por favor solicita uno nuevo.');
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                email,
                token,
                newPassword
            };
            const resp = await authService.resetPassword(payload);
            
            if (!resp.error) {
                setSuccessMessage('¡Contraseña restablecida exitosamente! Serás redirigido al inicio.');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(resp.error);
            }
        } catch (err: any) {
            setError('Error de conexión o el enlace ya fue utilizado.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] flex font-sans selection:bg-fuchsia-500/30">
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] relative z-10">
                <div className="absolute top-0 left-0 w-full h-full bg-[#0f1117] -z-10 lg:bg-transparent" />
                
                <div className="w-full max-w-sm mx-auto p-8 rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] lg:bg-transparent lg:border-none lg:shadow-none lg:backdrop-blur-none lg:p-0">
                    <div className="mb-10 lg:text-left text-center">
                        <div className="flex justify-center lg:justify-start items-center gap-3 mb-8">
                            <div className="h-10 w-10 bg-fuchsia-500 rounded-xl flex items-center justify-center shadow-lg shadow-fuchsia-500/25">
                                <span className="text-white font-bold text-xl font-display">L</span>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">LibraryApp</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-3">Nueva Contraseña</h2>
                        <p className="text-slate-400 text-sm">
                            Elige una nueva contraseña segura para tu cuenta de <strong>{email || 'usuario'}</strong>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        {!successMessage && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="block text-xs font-bold tracking-wide text-slate-400 uppercase">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-fuchsia-400 transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            required
                                            disabled={!token}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all sm:text-sm disabled:opacity-50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="confirmPassword" className="block text-xs font-bold tracking-wide text-slate-400 uppercase">
                                        Confirmar Contraseña
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-fuchsia-400 transition-colors">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            disabled={!token}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500/50 transition-all sm:text-sm disabled:opacity-50"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !token}
                                    className="w-full mt-2 flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-fuchsia-500/25 text-sm font-bold text-white bg-gradient-to-r from-fuchsia-600 to-primary-600 hover:from-fuchsia-500 hover:to-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0f1117] focus:ring-fuchsia-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    <span className="relative z-10 shrink-0">
                                        {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
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

            {/* Right side artistic feature */}
            <div className="hidden lg:flex flex-1 relative items-center justify-center bg-slate-950 p-8">
                <div className="absolute inset-0 z-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2790&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-luminosity"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent z-0"></div>

                <div
                    className="relative z-10 max-w-2xl text-center transform transition-all duration-1000 ease-out translate-y-0 opacity-100"
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
                </div>

                {/* Decorative floating elements */}
                <div
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl -rotate-12 shadow-2xl flex items-center justify-center animate-[float_6s_ease-in-out_infinite]"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open text-white/30"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
