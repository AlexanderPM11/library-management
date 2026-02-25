import axiosInstance from '../axiosInstance';
import { handleApiRequest, handleAuthRequest, WrappedResponse } from '../apiWrapper';
import { Branch, ApiResponse, AuthResponse } from '../types';

export const branchService = {
    getAll: async (): Promise<WrappedResponse<Branch[]>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Branch[]>>('/branches'));
    },
    getById: async (id: number): Promise<WrappedResponse<Branch>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<Branch>>(`/branches/${id}`));
    },
    create: async (branch: Partial<Branch>): Promise<WrappedResponse<Branch>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<Branch>>('/branches', branch));
    },
    update: async (id: number, branch: Partial<Branch>): Promise<WrappedResponse<Branch>> => {
        return handleApiRequest(axiosInstance.put<ApiResponse<Branch>>(`/branches/${id}`, branch));
    },
    delete: async (id: number): Promise<WrappedResponse<boolean>> => {
        return handleApiRequest(axiosInstance.delete<ApiResponse<boolean>>(`/branches/${id}`));
    },
    setup: async (branch: Partial<Branch>): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/branches/setup', branch));
    }
};
