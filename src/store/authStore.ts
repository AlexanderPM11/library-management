import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, UserLoginDto } from '../api/types';
import { authService } from '../api/services';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    email?: string;
    sub?: string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
    BranchId?: string;
    exp: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    isEmpleado: boolean;
    needsBranchSetup: boolean;
    branchId: number | null;
    login: (credentials: UserLoginDto) => Promise<{ success: boolean; error: string | null }>;
    updateToken: (newToken: string) => void;
    logout: () => void;
    initialize: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isAdmin: false,
            isSuperAdmin: false,
            isEmpleado: false,
            needsBranchSetup: false,
            branchId: null,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),

            initialize: () => {
                const state = get();
                if (state.token) {
                    try {
                        const decoded = jwtDecode<DecodedToken>(state.token);
                        if (decoded.exp * 1000 < Date.now()) {
                            get().logout();
                            return;
                        }
                        // Re-sync logic if needed
                    } catch (error) {
                        get().logout();
                    }
                }
            },

            login: async (credentials: UserLoginDto) => {
                const { data, error } = await authService.login(credentials);

                if (data && data.isSuccess && data.token) {
                    const decoded = jwtDecode<DecodedToken>(data.token);

                    const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                    const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim || "User"];

                    const isSuperAdmin = roles.includes("SuperAdmin");
                    const isAdmin = roles.includes("Admin");
                    const isEmpleado = roles.includes("Empleado");
                    const branchId = decoded.BranchId ? parseInt(decoded.BranchId) : null;

                    set({
                        token: data.token,
                        user: {
                            email: decoded.email || decoded.sub || '',
                            role: roles[0],
                            branchId: branchId
                        },
                        isAuthenticated: true,
                        isAdmin: isSuperAdmin || isAdmin,
                        isSuperAdmin: isSuperAdmin,
                        isEmpleado: isEmpleado,
                        needsBranchSetup: isAdmin && branchId === null,
                        branchId: branchId
                    });
                    return { success: true, error: null };
                }

                return { success: false, error: error || "Login failed" };
            },

            updateToken: (newToken: string) => {
                const decoded = jwtDecode<DecodedToken>(newToken);
                const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
                const roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim || "User"];

                const isSuperAdmin = roles.includes("SuperAdmin");
                const isAdmin = roles.includes("Admin");
                const isEmpleado = roles.includes("Empleado");
                const branchId = decoded.BranchId ? parseInt(decoded.BranchId) : null;

                set({
                    token: newToken,
                    user: {
                        email: decoded.email || decoded.sub || '',
                        role: roles[0],
                        branchId: branchId
                    },
                    isAuthenticated: true,
                    isAdmin: isSuperAdmin || isAdmin,
                    isSuperAdmin: isSuperAdmin,
                    isEmpleado: isEmpleado,
                    needsBranchSetup: isAdmin && branchId === null,
                    branchId: branchId
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isAdmin: false,
                    isSuperAdmin: false,
                    isEmpleado: false,
                    needsBranchSetup: false,
                    branchId: null
                });
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
