import axiosInstance from '../axiosInstance';
import { AuthResponse, UserLoginDto, UserRegisterDto } from '../types';
import { handleAuthRequest, WrappedResponse } from '../apiWrapper';

export const authService = {
    login: async (loginDto: UserLoginDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/auth/login', loginDto));
    },
    register: async (registerDto: UserRegisterDto): Promise<WrappedResponse<AuthResponse>> => {
        return handleAuthRequest(axiosInstance.post<AuthResponse>('/auth/register', registerDto));
    },
};
