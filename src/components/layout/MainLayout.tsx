import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../store/authStore';

const MainLayout: React.FC = () => {
    const { user } = useAuthStore();

    return (
        <div className="flex h-screen bg-slate-50 w-full overflow-hidden">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <div className="text-slate-500 font-medium">
                        Welcome back, <span className="text-slate-900 font-semibold">{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className={user?.role === 'Admin' ? 'bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold' : 'bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold'}>
                            {user?.role}
                        </span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
