'use client';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TimeOff() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [newRequest, setNewRequest] = useState({
        type: 'vacation', start_date: '', end_date: '', reason: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    async function loadRequests() {
        try {
            const data = await fetchAPI('/time-off');
            // Sort by most recent first
            data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setRequests(data);
        } catch (err) {
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, [router]);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await fetchAPI('/time-off', {
                method: 'POST',
                body: JSON.stringify(newRequest)
            });
            setIsRequestModalOpen(false);
            setNewRequest({ type: 'vacation', start_date: '', end_date: '', reason: '' });
            await loadRequests();
        } catch (err: any) {
            alert(err.message || 'Failed to submit request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        try {
            await fetchAPI(`/time-off/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status: action })
            });
            await loadRequests();
        } catch (err: any) {
            alert(err.message || `Failed to ${action} request`);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading leave requests...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Time Off</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href="/dashboard" className="text-slate-600 hover:text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-rose-50 inline-flex items-center gap-2 border border-transparent">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                                <span>Back</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leave Requests</h2>
                        <p className="mt-2 text-slate-500 font-medium">Manage and review employee time off requests.</p>
                    </div>
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="inline-flex justify-center items-center gap-2 px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors shadow-sm whitespace-nowrap"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                        Request Time Off
                    </button>
                </div>

                <div className="bg-white shadow-sm sm:rounded-2xl border border-slate-200 overflow-hidden">
                    <ul className="divide-y divide-slate-100">
                        {requests.length === 0 ? (
                            <li className="px-6 py-16 text-center">
                                <p className="text-sm text-slate-500">No leave requests found.</p>
                            </li>
                        ) : (
                            requests.map((req) => (
                                <li key={req.id} className="p-6 transition-colors hover:bg-slate-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
                                                {req.type}
                                                <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${req.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                                                    req.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1">
                                                From <span className="font-semibold">{req.start_date}</span> to <span className="font-semibold">{req.end_date}</span>
                                            </p>
                                            {req.reason && <p className="text-sm text-slate-600 mt-2 bg-slate-100 p-2 rounded-lg inline-block">{req.reason}</p>}
                                        </div>

                                        {/* Actions for Pending Requests */}
                                        {req.status === 'pending' && (
                                            <div className="flex flex-col sm:flex-row gap-2">
                                                <button onClick={() => handleAction(req.id, 'approved')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-sm font-semibold transition-colors">
                                                    Approve
                                                </button>
                                                <button onClick={() => handleAction(req.id, 'rejected')} className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-semibold transition-colors">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </main>

            {/* Request Modal */}
            {isRequestModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-slate-900 bg-opacity-50 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsRequestModalOpen(false)}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-200">
                            <form onSubmit={handleRequestSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 text-slate-900">
                                    <h3 className="text-xl leading-6 font-bold text-slate-900 mb-5" id="modal-title">
                                        Request Time Off
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Leave Type</label>
                                            <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500" value={newRequest.type} onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}>
                                                <option value="vacation">Vacation</option>
                                                <option value="sick">Sick Leave</option>
                                                <option value="personal">Personal Leave</option>
                                                <option value="unpaid">Unpaid Time Off</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">Start Date</label>
                                                <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500" value={newRequest.start_date} onChange={(e) => setNewRequest({ ...newRequest, start_date: e.target.value })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1">End Date</label>
                                                <input type="date" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500" value={newRequest.end_date} onChange={(e) => setNewRequest({ ...newRequest, end_date: e.target.value })} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Reason (Optional)</label>
                                            <textarea className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500" rows={3} value={newRequest.reason} onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-slate-200">
                                    <button type="submit" disabled={submitting} className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-rose-500 text-base font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50">
                                        {submitting ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                    <button type="button" onClick={() => setIsRequestModalOpen(false)} className="mt-3 w-full inline-flex justify-center rounded-xl border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
