import axiosInstance from '../axiosInstance';
import { ApiResponse, AuditLog } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const auditLogService = {
    getAll: async (): Promise<WrappedResponse<AuditLog[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<AuditLog[]>>('/AuditLogs'));
    },

    getById: async (id: number): Promise<WrappedResponse<AuditLog>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<AuditLog>>(`/AuditLogs/${id}`));
    },

    getByTable: async (tableName: string): Promise<WrappedResponse<AuditLog[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<AuditLog[]>>(`/AuditLogs/table/${tableName}`));
    }
};
