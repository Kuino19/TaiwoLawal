import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { ClipboardList, User, Trophy, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';

export const dynamic = 'force-dynamic';

async function getResults() {
    try {
        const r = await adminDatabases.listDocuments(
            DB_ID, 
            'attempts', 
            [Query.orderDesc('$createdAt'), Query.limit(100)]
        );
        return r.documents;
    } catch (error) {
        console.error('Failed to fetch results:', error);
        return [];
    }
}

export default async function AdminResultsPage() {
    const results = await getResults();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-serif font-bold text-3xl text-gray-900">Quiz Results</h1>
                    <p className="text-gray-500 text-sm font-sans mt-1">
                        Track student performance across all active competitions
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-royal-50 rounded-xl border border-royal-100">
                    <Trophy className="w-4 h-4 text-royal-600" />
                    <span className="text-sm font-bold text-royal-700">{results.length} Total Attempts</span>
                </div>
            </div>

            {results.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center shadow-sm">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-gray-50 border border-gray-100">
                        <ClipboardList className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-xl mb-2">No results yet</h3>
                    <p className="text-gray-400 text-sm font-sans">Once students start taking quizzes, their scores will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Student / Quiz</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Score</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Performance</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {results.map((result: any) => {
                                    const percent = result.percentage || 0;
                                    const statusColor = percent >= 70 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                                                       percent >= 40 ? 'text-amber-700 bg-amber-50 border-amber-100' : 
                                                       'text-rose-700 bg-rose-50 border-rose-100';

                                    return (
                                        <tr key={result.$id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-royal-50 flex items-center justify-center text-royal-600">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{result.participant_name}</p>
                                                        <p className="text-gray-500 text-xs mt-0.5">{result.quiz_title}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono font-bold text-gray-900">{result.score}</span>
                                                    <span className="text-gray-400 text-xs">/ {result.total}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{ 
                                                                width: `${percent}%`,
                                                                background: percent >= 70 ? '#10b981' : percent >= 40 ? '#f59e0b' : '#ef4444'
                                                            }}
                                                        />
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${statusColor}`}>
                                                        {percent}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="text-xs font-sans">{formatDate(result.$createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={`/admin/results/${result.$id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-royal-600 hover:text-royal-700 bg-royal-50 px-3 py-1.5 rounded-lg border border-royal-100 transition-colors"
                                                >
                                                    Review <ChevronRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
