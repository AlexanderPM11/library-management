import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, RefreshCw, Eye, Code, Sparkles, AlertCircle, Maximize2, Monitor } from 'lucide-react';
import { emailTemplatesService } from '../api/services/emailTemplatesService';
import { branchService } from '../api/services/branchService';
import { CreateEmailTemplateDto, EmailTemplateType, UpdateEmailTemplateDto } from '../api/types';
import { motion, AnimatePresence } from 'framer-motion';

const EmailTemplateEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new' || !id;
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [branches, setBranches] = useState<any[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const [formData, setFormData] = useState<CreateEmailTemplateDto>({
    branchId: null,
    subject: '',
    htmlContent: '',
    type: EmailTemplateType.Welcome,
    isActive: true
  });

  const [previewVars, setPreviewVars] = useState<string>(
    JSON.stringify({
      UserName: "Juan Perez",
      ConfirmLink: "http://localhost:5173/auth/confirm",
      ResetLink: "http://localhost:5173/auth/reset",
      LibraryName: "Central Library"
    }, null, 2)
  );

  useEffect(() => {
    loadBranches();
    if (!isNew) {
      loadTemplate(parseInt(id!, 10));
    }
  }, [id, isNew]);

  const loadBranches = async () => {
    try {
      const resp = await branchService.getAll();
      if (!resp.error && resp.data) {
        setBranches(resp.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadTemplate = async (templateId: number) => {
    try {
      const resp = await emailTemplatesService.getById(templateId);
      if (!resp.error && resp.data) {
        setFormData({
          branchId: resp.data.branchId,
          subject: resp.data.subject,
          htmlContent: resp.data.htmlContent,
          type: resp.data.type,
          isActive: resp.data.isActive
        });
        generatePreview(resp.data.htmlContent);
      } else {
        setError(resp.error || 'Error al cargar plantilla');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: name === 'type' || name === 'branchId' 
          ? (value === '' ? null : parseInt(value, 10)) 
          : value 
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (isNew) {
        const resp = await emailTemplatesService.create(formData);
        if (!resp.error) navigate('/email-templates');
        else setError(resp.error);
      } else {
        const updateDto: UpdateEmailTemplateDto = {
            subject: formData.subject,
            htmlContent: formData.htmlContent,
            type: formData.type,
            isActive: formData.isActive || false
        };
        const resp = await emailTemplatesService.update(parseInt(id!, 10), updateDto);
        if (!resp.error) navigate('/email-templates');
        else setError(resp.error);
      }
    } catch (err) {
      setError('Error al guardar la plantilla.');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePreview = async (htmlToRender = formData.htmlContent) => {
    setIsPreviewLoading(true);
    try {
      let vars = {};
      try { vars = JSON.parse(previewVars); } catch { /* ignore */ }
      
      const resp = await emailTemplatesService.preview({
        htmlContent: htmlToRender,
        variables: vars
      });
      if (!resp.error && resp.data) {
        setPreviewHtml(resp.data.html);
      } else {
        setPreviewHtml(`<div style="color:#f87171; padding:20px; font-family:sans-serif;">Error al procesar preview: ${resp.error}</div>`);
      }
    } catch (e) {
      setPreviewHtml('<div style="color:#f87171; padding:20px; font-family:sans-serif;">Connection Error</div>');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderInput = (label: string, name: string, type: string, value: any, options?: React.ReactNode) => (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold tracking-wide text-slate-400 uppercase">{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={value === null ? '' : value}
          onChange={handleChange}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm appearance-none"
        >
          {options}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={handleChange}
          rows={16}
          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-emerald-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all custom-scrollbar resize-none"
          placeholder="<html>...</html>"
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder="Ej. Bienvenido a {{LibraryName}}, {{UserName}}"
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all text-sm"
        />
      )}
    </div>
  );

  return (
    <div className="relative min-h-[80vh] w-full max-w-[1600px] mx-auto flex flex-col items-stretch">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 relative z-10"
      >
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate('/email-templates')}
            className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-md rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3 h-3" /> Editor Maestro
            </div>
            <h1 className="text-3xl font-display font-bold text-white tracking-tight">
              {isNew ? 'Diseñar Plantilla' : 'Refinar Edición'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button
             type="button"
             onClick={() => setViewMode(viewMode === 'edit' ? 'preview' : 'edit')}
             className="md:hidden flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-bold text-sm"
           >
             {viewMode === 'edit' ? <Eye className="w-4 h-4 text-primary-400"/> : <Code className="w-4 h-4 text-fuchsia-400"/>}
             {viewMode === 'edit' ? 'Ver Resultado' : 'Ver Código'}
           </button>

           <button
             onClick={handleSave}
             disabled={isSaving || isLoading}
             className="group relative flex items-center gap-2 bg-gradient-to-r from-primary-600 to-fuchsia-600 hover:from-primary-500 hover:to-fuchsia-500 disabled:from-slate-700 disabled:to-slate-800 text-white px-6 py-2.5 rounded-xl transition-all font-bold shadow-lg shadow-primary-500/20 overflow-hidden"
           >
             <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
             {isSaving ? <RefreshCw className="h-4 w-4 animate-spin relative z-10" /> : <Save className="h-4 w-4 relative z-10" />}
             <span className="relative z-10">Guardar Cambios</span>
           </button>
        </div>
      </motion.header>

      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 flex items-start gap-4 backdrop-blur-md"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </motion.div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 relative z-10 min-h-0">
        
        {/* LEFT PANEL: EDICIÓN */}
        <AnimatePresence mode="wait">
          {(!isLoading && (viewMode === 'edit' || window.innerWidth >= 768)) && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex-1 flex flex-col gap-6 md:max-w-xl lg:max-w-2xl ${viewMode === 'preview' ? 'hidden md:flex' : 'flex'}`}
            >
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {renderInput('Tipo de Evento', 'type', 'select', formData.type, (
                    <>
                      <option value={EmailTemplateType.Welcome} className="bg-slate-900">Bienvenida</option>
                      <option value={EmailTemplateType.PasswordReset} className="bg-slate-900">Recuperación de Contraseña</option>
                      <option value={EmailTemplateType.EmailConfirmation} className="bg-slate-900">Confirmación de Correo</option>
                    </>
                  ))}
                  {renderInput('Asignación de Sucursal', 'branchId', 'select', formData.branchId, (
                    <>
                      <option value="" className="bg-slate-900">-- Nivel Global --</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id} className="bg-slate-900">{b.name}</option>
                      ))}
                    </>
                  ))}
                </div>
                
                <div className="mb-5">
                  {renderInput('Asunto del Mensaje', 'subject', 'text', formData.subject)}
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="relative flex items-center justify-center w-10 h-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </div>
                  <label htmlFor="isActive" className="text-sm font-bold text-white cursor-pointer select-none">
                    Plantilla Operativa
                  </label>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[400px]">
                <div className="bg-white/5 border-b border-white/10 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-fuchsia-400" />
                    <span className="text-xs font-bold tracking-widest uppercase text-white">Estructura HTML</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => generatePreview()}
                    className="text-xs font-bold text-primary-400 hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-primary-500/10 rounded-lg hover:bg-primary-500/20"
                  >
                    <RefreshCw className={`w-3 h-3 ${isPreviewLoading ? 'animate-spin' : ''}`} /> 
                    Compilar
                  </button>
                </div>
                <div className="flex-1 p-0 relative">
                   <textarea
                    name="htmlContent"
                    value={formData.htmlContent}
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full bg-transparent border-0 px-6 py-5 text-emerald-400 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-0 custom-scrollbar resize-none selection:bg-emerald-500/30"
                    placeholder="<!DOCTYPE html>&#10;<html>&#10;<body>...</body>&#10;</html>"
                  />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* RIGHT PANEL: PREVIEW */}
        <AnimatePresence mode="wait">
          {(!isLoading && (viewMode === 'preview' || window.innerWidth >= 768)) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex-1 flex flex-col gap-6 ${viewMode === 'edit' ? 'hidden md:flex' : 'flex'}`}
            >
              {/* Browser Window Mockup */}
              <div className="flex-1 bg-[#1a1c23] rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden min-h-[500px]">
                 {/* Top Bar */}
                 <div className="bg-[#2d303b] px-4 py-3 flex items-center gap-4 select-none shrink-0">
                   <div className="flex gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-sm border border-black/10"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-500/80 shadow-sm border border-black/10"></div>
                     <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-sm border border-black/10"></div>
                   </div>
                   
                   <div className="flex-1 max-w-sm mx-auto">
                     <div className="bg-[#1a1c23] rounded-md px-3 py-1.5 flex items-center justify-center gap-2 border border-black/20 shadow-inner">
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-xs font-medium text-slate-300 truncate font-mono">
                          {formData.subject || 'Asunto del mensaje'}
                        </span>
                     </div>
                   </div>

                   <button className="text-slate-500 hover:text-white transition-colors">
                     <Maximize2 className="w-4 h-4" />
                   </button>
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 bg-white relative">
                   {isPreviewLoading && (
                     <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center mb-3 border border-primary-500/20">
                          <RefreshCw className="w-6 h-6 text-primary-600 animate-spin" />
                       </div>
                       <span className="text-xs font-bold text-primary-600 tracking-widest uppercase">Renderizando...</span>
                     </div>
                   )}
                   <iframe 
                     srcDoc={previewHtml} 
                     title="Email Preview"
                     className="w-full h-full border-0 bg-white"
                   />
                 </div>
              </div>

              {/* Variable Injector */}
              <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-xl flex-shrink-0">
                 <div className="flex justify-between items-center mb-3">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                      Inyección de Variables (JSON)
                   </h3>
                 </div>
                 <textarea
                    value={previewVars}
                    onChange={(e) => setPreviewVars(e.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-fuchsia-400 font-mono text-[13px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 custom-scrollbar resize-none selection:bg-fuchsia-500/30"
                  />
                  <p className="text-[10px] text-slate-500 mt-2 font-medium">Modifica el JSON y haz click en "Compilar" para simular reemplazos en tiempo real.</p>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default EmailTemplateEditor;
