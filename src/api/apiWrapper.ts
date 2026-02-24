import { AxiosResponse, AxiosError } from 'axios';
import { ApiResponse, AuthResponse } from './types';

export interface WrappedResponse<T> {
    data: T | null;
    error: string | null;
    errors: string[] | null;
}

export const handleApiRequest = async <T>(
    request: Promise<AxiosResponse<ApiResponse<T>>>
): Promise<WrappedResponse<T>> => {
    try {
        const response = await request;
        const apiResponse = response.data;

        // ASP.NET Core Backend usually sets success flag
        if (apiResponse.success) {
            return { data: apiResponse.data, error: null, errors: null };
        }

        return {
            data: null,
            error: apiResponse.message || 'Operation failed',
            errors: apiResponse.errors || []
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiResponse = error.response?.data as ApiResponse<T>;
            if (apiResponse) {
                return {
                    data: null,
                    error: apiResponse.message || 'Request failed',
                    errors: apiResponse.errors || []
                };
            }
            return { data: null, error: error.message, errors: null };
        }
        return { data: null, error: 'An unexpected error occurred', errors: null };
    }
};

export const handleAuthRequest = async (
    request: Promise<AxiosResponse<AuthResponse>>
): Promise<WrappedResponse<AuthResponse>> => {
    try {
        const response = await request;
        const apiResponse = response.data;

        if (apiResponse.isSuccess) {
            return { data: apiResponse, error: null, errors: null };
        }

        return {
            data: null,
            error: apiResponse.message || 'Authentication failed',
            errors: apiResponse.errors || []
        };
    } catch (error) {
        if (error instanceof AxiosError) {
            const apiResponse = error.response?.data as AuthResponse;
            if (apiResponse) {
                return {
                    data: null,
                    error: apiResponse.message || 'Authentication error',
                    errors: apiResponse.errors || []
                };
            }
            return { data: null, error: error.message, errors: null };
        }
        return { data: null, error: 'An unexpected error occurred', errors: null };
    }
};
