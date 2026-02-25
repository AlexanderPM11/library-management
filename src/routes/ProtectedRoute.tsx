import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, isAdmin, needsBranchSetup, _hasHydrated } = useAuthStore();
    const location = useLocation();

    if (!_hasHydrated) {
        return <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-white">Cargando sesión...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to branch setup if needed, unless already there
    if (needsBranchSetup && location.pathname !== '/branch-setup') {
        return <Navigate to="/branch-setup" replace />;
    }

    // Prevent access to branch setup if NOT needed
    if (!needsBranchSetup && location.pathname === '/branch-setup') {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
