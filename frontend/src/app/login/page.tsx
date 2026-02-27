'use client';
import { useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const res = await fetchAPI('/auth/login', {
                method: 'POST',
                body: formData
            });

            localStorage.setItem('token', res.access_token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || "Failed to authenticate.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-gray-900 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[100px] pointer-events-none" />

            {/* Left side: Branding */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gradient-to-br from-blue-700 to-indigo-900 relative z-10 p-12 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">Nexus HR</h1>
                <p className="text-blue-100 text-lg max-w-md text-center font-medium leading-relaxed">
                    Streamline your workforce, elevate your management, and empower your team beautifully.
                </p>
            </div>

            {/* Right side: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8 bg-white/70 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">

                    <div className="text-center">
                        <div className="lg:hidden mb-6 flex justify-center">
                            <span className="text-4xl font-extrabold text-blue-700 tracking-tight drop-shadow-sm">Nexus HR</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 font-medium">
                            Please sign in to your employee portal
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-xl bg-red-50/50 backdrop-blur-sm shadow-sm relative overflow-hidden">
                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></span>
                                <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
                                </svg>
                                <div>{error}</div>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 bg-white/50 text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 sm:text-sm shadow-sm"
                                    placeholder="admin@hrms.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-slate-200 bg-white/50 text-slate-900 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all duration-200 sm:text-sm shadow-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 shadow-[0_4px_14px_0_rgb(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Sign in to account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-slate-500">
                        <p>© {new Date().getFullYear()} Nexus HR. All rights reserved.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
