import React, { useEffect, useState } from 'react';
import { emailTemplatesService } from '../api/services/emailTemplatesService';
import { EmailTemplateDto, EmailTemplateType } from '../api/types';
import { Mail, Edit2, Plus, RefreshCw, Trash2, CheckCircle, XCircle, Globe, LayoutTemplate, Sparkles, AlertCircle, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { emailTemplatesExamples } from '../utils/emailTemplatesExamples';

const EmailTemplatesPage: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplateDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resp = await emailTemplatesService.getAll();
      if (!resp.error && resp.data) {
        setTemplates(resp.data);
      } else {
        setError(resp.error || 'Error al cargar plantillas.');
      }
    } catch (err) {
      setError('Error de conexión al cargar las plantillas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta plantilla luminosa?')) return;
    try {
      const resp = await emailTemplatesService.delete(id);
      if (!resp.error) {
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        alert(resp.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error(error);
      alert('Error de conexión al eliminar la plantilla');
    }
  };

  const getTypeLabel = (type: EmailTemplateType) => {
    switch (type) {
      case EmailTemplateType.Welcome: return 'Bienvenida';
      case EmailTemplateType.PasswordReset: return 'Recuperación';
      case EmailTemplateType.EmailConfirmation: return 'Confirmación';
      default: return 'Desconocido';
    }
  };

  const handleDownloadExamples = () => {
    const textContent = `=== PLANTILLA DE BIENVENIDA ===\n\n${emailTemplatesExamples.welcome}\n\n\n=== PLANTILLA DE RECUPERACIÓN DE CONTRASEÑA ===\n\n${emailTemplatesExamples.passwordReset}\n\n\n=== PLANTILLA DE CONFIRMACIÓN DE CORREO ===\n\n${emailTemplatesExamples.emailConfirmation}`;
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejemplos_plantillas_correo.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="relative min-h-[80vh] w-full">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="space-y-8 relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <div className="space-y-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-primary-400 uppercase tracking-widest mb-2"
            >
              <Sparkles className="w-3 h-3" />
              <span>Studio de Comunicaciones</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
            >
              Plantillas de Correo
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 max-w-xl text-sm leading-relaxed"
            >
              Diseña y orquesta correos automatizados con precisión. Administra plantillas globales y ecosistemas de sucursales con herramientas fluidas.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={handleDownloadExamples}
              className="p-3 text-fuchsia-400 hover:text-white transition-all bg-fuchsia-500/10 hover:bg-fuchsia-500/20 rounded-xl border border-fuchsia-500/20 backdrop-blur-md flex items-center gap-2"
              title="Descargar ejemplos base"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline text-sm font-bold">Ejemplos</span>
            </button>
            <button
              onClick={loadTemplates}
              className="p-3 text-slate-400 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-white/20 backdrop-blur-md"
              title="Sincronizar"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin text-primary-400' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/email-templates/new')}
              className="group relative flex items-center gap-2 bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-500 hover:to-fuchsia-500 text-white px-6 py-3 rounded-xl transition-all font-bold shadow-lg shadow-primary-500/25 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <Plus className="h-5 w-5 relative z-10" />
              <span className="relative z-10">Nueva Plantilla</span>
            </button>
          </motion.div>
        </header>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-start gap-4 backdrop-blur-md"
          >
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-white/5 border border-white/5 animate-pulse" />
              ))}
            </motion.div>
          ) : templates.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center p-20 rounded-3xl bg-white/5 border border-white/5 border-dashed backdrop-blur-sm text-center"
            >
              <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-white/10 flex items-center justify-center mb-6">
                <LayoutTemplate className="h-10 w-10 text-slate-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lienzo en Blanco</h3>
              <p className="text-slate-400 max-w-sm mb-6">El sistema no detectó plantillas. Comienza a diseñar tu primer formato de comunicación.</p>
              <button 
                onClick={() => navigate('/email-templates/new')}
                className="text-primary-400 hover:text-primary-300 font-bold border-b border-primary-400/30 hover:border-primary-400 transition-colors pb-1"
              >
                Crear primera plantilla
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {templates.map((template) => (
                <motion.div 
                  key={template.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group relative flex flex-col p-6 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 hover:border-primary-500/50 transition-all duration-300 shadow-xl shadow-black/40 overflow-hidden"
                >
                  {/* Card Glow Reveal */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                  
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${template.isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                        {template.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Estado</div>
                        <div className={`text-xs font-bold ${template.isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {template.isActive ? 'Activo' : 'Inactivo'}
                        </div>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300 group-hover:bg-primary-500/10 group-hover:text-primary-300 group-hover:border-primary-500/30 transition-colors">
                      {getTypeLabel(template.type)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
                    {template.subject || 'Sin asunto'}
                  </h3>
                  
                  <div className="mb-8 flex items-center gap-2">
                    {template.branchId ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-fuchsia-400 font-medium bg-fuchsia-400/10 px-2.5 py-1 rounded-lg border border-fuchsia-400/20">
                        Sucursal #{template.branchId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium bg-blue-400/10 px-2.5 py-1 rounded-lg border border-blue-400/20">
                        <Globe className="h-3.5 w-3.5" /> Global
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between gap-3">
                    <button
                      onClick={() => navigate(`/email-templates/${template.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-primary-500 text-white rounded-xl transition-colors font-medium text-sm border border-white/5 hover:border-transparent"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="p-2.5 text-slate-400 hover:text-white bg-white/5 hover:bg-red-500 rounded-xl transition-colors border border-white/5 hover:border-transparent"
                      title="Eliminar plantilla"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EmailTemplatesPage;
