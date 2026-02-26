import axiosInstance from '../axiosInstance';
import { ApiResponse, DashboardStats, SuperAdminStats } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const statisticsService = {
    getDashboardStats: async (): Promise<WrappedResponse<DashboardStats>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<DashboardStats>>('/Statistics/dashboard'));
    },
    getSuperAdminStats: async (): Promise<WrappedResponse<SuperAdminStats>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<SuperAdminStats>>('/Statistics/super-admin'));
    },
};
