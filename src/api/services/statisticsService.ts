import axiosInstance from '../axiosInstance';
import { ApiResponse, DashboardStats } from '../types';
import { handleApiRequest, WrappedResponse } from '../apiWrapper';

export const statisticsService = {
    getDashboardStats: async (): Promise<WrappedResponse<DashboardStats>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<DashboardStats>>('/Statistics/dashboard'));
    },
};
