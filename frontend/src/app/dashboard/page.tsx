'use client';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const [stats, setStats] = useState({ employees: 0, pendingLeaves: 0 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadDashboard() {
            try {
                const employees = await fetchAPI('/employees');
                const leaves = await fetchAPI('/time-off');

                setStats({
                    employees: employees.length,
                    pendingLeaves: leaves.filter((l: any) => l.status === 'pending').length
                });
            } catch (err) {
                // If unauthorized, redirect to login
                router.push('/login');
            } finally {
                setLoading(false);
            }
        }
        loadDashboard();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading workspace...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Nexus HR</h1>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-6">
                            <Link href="/employees" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-blue-50 inline-flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                <span className="hidden sm:inline">Directory</span>
                            </Link>

                            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-700 px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Overview</h2>
                    <p className="mt-2 text-slate-500 font-medium">Welcome back to your workspace. Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Employee Stat Card */}
                    <div className="group relative bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-100 p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 group-hover:text-blue-600">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-700">Total Workforce</h3>
                            </div>
                            <div className="flex items-baseline">
                                <p className="text-5xl font-extrabold text-slate-900 tracking-tight">{stats.employees}</p>
                                <p className="ml-2 text-sm font-medium text-slate-500">active</p>
                            </div>
                            <div className="mt-4">
                                <Link
                                    href="/employees"
                                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800"
                                >
                                    Manage Directory
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Pending Leaves Stat Card */}
                    <div className="group relative overflow-hidden shadow-sm sm:rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-orange-400 to-rose-500">
                        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500 text-white">
                            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="relative z-10 text-white">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-bold">Pending Leaves</h3>
                            </div>
                            <div className="flex items-baseline">
                                <p className="text-5xl font-extrabold tracking-tight drop-shadow-sm">{stats.pendingLeaves}</p>
                                <p className="ml-2 text-sm font-medium opacity-80">awaiting review</p>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => router.push('/time-off')} className="inline-flex items-center text-sm font-semibold bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-1.5 rounded-full transition-colors">
                                    Review Requests
                                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions (Static placeholder for premium feel) */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-slate-100 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Quick Actions</h3>
                        <div className="space-y-3">
                            <button onClick={() => router.push('/employees')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 font-medium transition-colors flex items-center justify-between group">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                                    Add New Employee (Directory)
                                </span>
                            </button>
                            <button onClick={() => router.push('/time-off')} className="w-full text-left px-4 py-3 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-medium transition-colors flex items-center justify-between group">
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-slate-400 group-hover:text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    Review Pending Leaves
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
