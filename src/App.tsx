import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import AuthorsPage from './pages/AuthorsPage';
import CategoriesPage from './pages/CategoriesPage';
import AuditLogsPage from './pages/AuditLogsPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';
import BranchesPage from './pages/BranchesPage';
import BranchSetupPage from './pages/BranchSetupPage';
import EmailTemplatesPage from './pages/EmailTemplatesPage';
import EmailTemplateEditor from './pages/EmailTemplateEditor';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { useAuthStore } from './store/authStore';

const App: React.FC = () => {
    const initialize = useAuthStore((state) => state.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route
                    path="/branch-setup"
                    element={
                        <ProtectedRoute>
                            <BranchSetupPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<DashboardPage />} />
                    <Route path="books" element={<BooksPage />} />
                    <Route path="authors" element={<AuthorsPage />} />
                    <Route path="categories" element={<CategoriesPage />} />
                    <Route path="audit-logs" element={<AuditLogsPage />} />
                    <Route
                        path="users"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <UsersPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="email-templates"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <EmailTemplatesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="email-templates/:id"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <EmailTemplateEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="email-templates/new"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <EmailTemplateEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="branches"
                        element={
                            <ProtectedRoute requireAdmin={true}>
                                <BranchesPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="profile" element={<ProfilePage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;
