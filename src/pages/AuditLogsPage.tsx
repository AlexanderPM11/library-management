import React, { useEffect, useState } from 'react';
import { Search, Filter, ShieldAlert, Activity, ArrowRight, Clock, User, FileText, ChevronRight } from 'lucide-react';
import { auditLogService } from '../api/services/auditLogService';
import { AuditLog, AuditType } from '../api/types';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const getAuditTheme = (type: AuditType) => {
    switch (type) {
        case AuditType.Create: return { label: 'Creación', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
        case AuditType.Update: return { label: 'Actualización', color: 'text-amber-400', bg: 'bg-amber-400/10' };
        case AuditType.Delete: return { label: 'Eliminación', color: 'text-rose-400', bg: 'bg-rose-400/10' };
        default: return { label: 'Desconocido', color: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
};

const parseJsonSafe = (jsonString: string | null) => {
    if (!jsonString) return null;
    try {
        return JSON.parse(jsonString);
    } catch {
        return null;
    }
};

const DiffViewer: React.FC<{ oldData: any, newData: any }> = ({ oldData, newData }) => {
    if (!oldData && !newData) return <div className="text-slate-500 text-sm italic py-2">Sin datos registrados.</div>;

    const allKeys = Array.from(new Set([...Object.keys(oldData || {}), ...Object.keys(newData || {})]));
    const changes = allKeys.filter(key => JSON.stringify((oldData || {})[key]) !== JSON.stringify((newData || {})[key]));
    const keysToShow = changes.length > 0 ? changes : allKeys;

    return (
        <div className="mt-4 bg-black/20 rounded-2xl border border-white/5 p-4 overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <tbody>
                    {keysToShow.map(key => {
                        const oldVal = (oldData || {})[key];
                        const newVal = (newData || {})[key];
                        const isChanged = JSON.stringify(oldVal) !== JSON.stringify(newVal);

                        return (
                            <tr key={key} className="group border-b border-white/[0.02] last:border-0 hover:bg-white/[0.02] transition-colors">
                                <td className="py-2.5 pr-4 align-top w-1/4">
                                    <span className="text-xs text-slate-400 font-mono">{key}</span>
                                </td>
                                <td className="py-2.5 px-4 align-top w-full">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 font-mono text-xs">
                                        {oldVal !== undefined && (
                                            <span className={`${isChanged ? 'text-rose-400/70 line-through' : 'text-slate-500'}`}>
                                                {typeof oldVal === 'object' ? JSON.stringify(oldVal) : String(oldVal)}
                                            </span>
                                        )}
                                        {isChanged && oldVal !== undefined && newVal !== undefined && (
                                            <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />
                                        )}
                                        {newVal !== undefined && (
                                            <span className={`${isChanged ? 'text-emerald-400' : 'text-slate-300'}`}>
                                                {typeof newVal === 'object' ? JSON.stringify(newVal) : String(newVal)}
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export const AuditLogsPage: React.FC = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterTable, setFilterTable] = useState('All');

    useEffect(() => {
        const fetchLogs = async () => {
            setIsLoading(true);
            try {
                const response = await auditLogService.getAll();
                if (response.data) setLogs(response.data);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.tableName.toLowerCase().includes(search.toLowerCase()) ||
            log.userName?.toLowerCase().includes(search.toLowerCase()) ||
            log.userId?.toLowerCase().includes(search.toLowerCase());
        const matchesTable = filterTable === 'All' || log.tableName === filterTable;
        return matchesSearch && matchesTable;
    }).sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    const tableNames = Array.from(new Set(logs.map(l => l.tableName)));

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
                        Seguridad y Auditoría
                    </motion.div>
                    <h2 className="text-4xl font-display font-bold text-white tracking-tight">Registro de <span className="text-slate-500">Actividad</span></h2>
                    <p className="text-slate-400 max-w-lg text-sm leading-relaxed">Monitorea y analiza los cambios estructurales e históricos realizados por los usuarios en todo el sistema.</p>
                </div>
            </div>

            {/* Content Card (Matches perfectly with Authors/Books pages) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col xl:flex-row"
            >
                {/* Left Sidebar embedded filter */}
                <div className="w-full xl:w-72 shrink-0 border-b xl:border-b-0 xl:border-r border-white/5 bg-black/10 p-6 lg:p-8 space-y-8">

                    {/* Search Component */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 ml-2">Buscar</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Usuario, tabla, ID..."
                                className="w-full pl-12 pr-4 h-12 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:bg-white/[0.05] focus:border-primary-500/30 transition-all text-sm text-white placeholder:text-slate-600"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filters List */}
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.15em] font-bold text-slate-500 ml-2">Filtro de Entidades</label>
                        <div className="flex flex-col gap-1">
                            <button
                                onClick={() => setFilterTable('All')}
                                className={`text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${filterTable === 'All' ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                            >
                                Registro Global
                            </button>
                            {tableNames.map(name => (
                                <button
                                    key={name}
                                    onClick={() => setFilterTable(name)}
                                    className={`text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${filterTable === name ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Log List Area */}
                <div className="flex-1 p-6 lg:p-8 min-h-[500px]">
                    <AnimatePresence mode="popLayout">
                        {isLoading ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[300px] gap-3">
                                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Analizando registros...</span>
                            </motion.div>
                        ) : filteredLogs.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                                <FileText className="w-12 h-12 text-slate-700 mb-4" />
                                <h3 className="text-xl text-slate-300 font-display font-medium mb-2">No hay resultados</h3>
                                <p className="text-slate-500 text-sm max-w-sm">
                                    No se encontraron auditorías que coincidan con tus filtros actuales. Prueba eliminando la búsqueda o cambiando de entidad.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {filteredLogs.map((log, index) => {
                                    const oldVals = parseJsonSafe(log.oldValues);
                                    const newVals = parseJsonSafe(log.newValues);
                                    const keys = parseJsonSafe(log.primaryKey);
                                    const theme = getAuditTheme(log.type);

                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                            className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-3xl p-6 transition-colors shadow-sm"
                                        >
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                {/* Left side: Entity & Action */}
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${theme.bg.replace('bg-', 'border-').replace('/10', '/20')} ${theme.bg}`}>
                                                        <Activity className={`w-5 h-5 ${theme.color}`} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-lg font-bold text-white leading-tight font-display">{log.tableName}</h3>
                                                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-md ${theme.bg} ${theme.color}`}>
                                                                {theme.label}
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 uppercase tracking-wide font-mono mt-1">
                                                            ID_REF: {keys ? JSON.stringify(keys).replace(/[{""}]/g, '') : log.id}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right side: Metadata */}
                                                <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1 text-xs text-slate-400 bg-black/20 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5 text-slate-500" />
                                                        <span className="truncate max-w-[150px] font-medium text-slate-300">
                                                            {log.userName ? log.userName : log.userId ? log.userId.split('-')[0] : 'Sistema'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 font-mono text-[11px]">
                                                        <Clock className="w-3 h-3 text-slate-500" />
                                                        {new Date(log.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, {new Date(log.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Diff Data Viewer */}
                                            <div className="mt-2 pl-[4.5rem]">
                                                <DiffViewer oldData={oldVals} newData={newVals} />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default AuditLogsPage;
