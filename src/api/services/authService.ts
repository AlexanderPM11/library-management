import axiosInstance from '../axiosInstance';
import { AuthResponse, UserLoginDto, UserRegisterDto, UserProfileDto, UpdateProfileDto, ApiResponse } from '../types';
import { handleAuthRequest, handleApiRequest, WrappedResponse } from '../apiWrapper';

export const authService = {
    login: async (loginDto: UserLoginDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/auth/login', loginDto));
    },
    register: async (registerDto: UserRegisterDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/auth/register', registerDto));
    },
    getProfile: async (): Promise<WrappedResponse<UserProfileDto>> => {
        return handleApiRequest(axiosInstance.get<ApiResponse<UserProfileDto>>('/auth/profile'));
    },
    updateProfile: async (updateDto: UpdateProfileDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.put<AuthResponse>('/auth/profile', updateDto));
    },
    forgotPassword: async (email: string): Promise<WrappedResponse<any>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<any>>('/auth/forgot-password', { email }));
    },
    resetPassword: async (data: { email: string; token: string; newPassword: string }): Promise<WrappedResponse<any>> => {
        return handleApiRequest(axiosInstance.post<ApiResponse<any>>('/auth/reset-password', data));
    }
};
