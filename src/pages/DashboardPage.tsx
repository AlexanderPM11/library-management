import React, { useEffect, useState } from 'react';
import { Book, Users, Tag, ArrowUpRight } from 'lucide-react';
import { bookService, authorService, categoryService } from '../api/services';

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState([
        { name: 'Total Books', value: '0', icon: Book, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Total Authors', value: '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
        { name: 'Total Categories', value: '0', icon: Tag, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [books, authors, categories] = await Promise.all([
                    bookService.getAll(1, 1),
                    authorService.getAll(),
                    categoryService.getAll(),
                ]);

                setStats([
                    { ...stats[0], value: books.data?.length.toString() || '0' },
                    { ...stats[1], value: authors.data?.length.toString() || '0' },
                    { ...stats[2], value: categories.data?.length.toString() || '0' },
                ]);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
                <p className="text-slate-500">Global statistics for your library management system.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-slate-300" />
                        </div>
                        <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                        <div className="text-slate-500 text-sm font-medium">{stat.name}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        {/* Placeholder for activity log */}
                        <div className="flex items-center text-sm text-slate-500">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3 text-[10px] font-bold">INFO</div>
                            <span>System checked for updates and all database migrations are complete.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
