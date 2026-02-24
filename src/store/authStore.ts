import { create } from 'zustand';
import { User, UserLoginDto } from '../api/types';
import { authService } from '../api/services';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    email?: string;
    sub?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
    exp: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (credentials: UserLoginDto) => Promise<{ success: boolean; error: string | null }>;
    logout: () => void;
    initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,

    initialize: () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.exp * 1000 < Date.now()) {
                    get().logout();
                    return;
                }
                const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as 'Admin' | 'User' || "User";
                set({
                    token,
                    user: { email: decoded.email || decoded.sub || '', role: userRole },
                    isAuthenticated: true,
                    isAdmin: userRole === 'Admin',
                });
            } catch (error) {
                get().logout();
            }
        }
    },

    login: async (credentials: UserLoginDto) => {
        const { data, error } = await authService.login(credentials);

        if (data && data.isSuccess && data.token) {
            localStorage.setItem('token', data.token);

            const decoded = jwtDecode<DecodedToken>(data.token);
            const userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] as 'Admin' | 'User' || "User";

            set({
                token: data.token,
                user: { email: decoded.email || decoded.sub || '', role: userRole },
                isAuthenticated: true,
                isAdmin: userRole === 'Admin',
            });
            return { success: true, error: null };
        }

        return { success: false, error: error || "Login failed" };
    },

    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
    },
}));
