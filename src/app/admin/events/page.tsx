import { adminDatabases } from '@/lib/server/appwrite';
import { Query } from 'node-appwrite';
import { Users, Mail, Phone, CheckCircle2, XCircle, Calendar } from 'lucide-react';
import DownloadCsvButton from './DownloadCsvButton';

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'main-db';
const EVENTS_COLLECTION_ID = 'events';

// Next.js config to ensure the admin page is always fresh
export const dynamic = 'force-dynamic';

export function LoadingEvents() {
    return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        </div>
    );
}

export default async function AdminEventsPage() {
    let events = [];
    let totalEvents = 0;
    let freeBooksCount = 0;

    try {
        // Fetch all registered users from newest to oldest
        const response = await adminDatabases.listDocuments(
            DB_ID,
            EVENTS_COLLECTION_ID,
            [
                Query.orderDesc('$createdAt'),
                Query.limit(100) // Adjust limit as needed
            ]
        );

        events = response.documents;
        totalEvents = response.total;

        // Count how many people got the free book
        const freeBooksResponse = await adminDatabases.listDocuments(
            DB_ID,
            EVENTS_COLLECTION_ID,
            [
                Query.equal('gets_free_book', true),
                Query.limit(1) // We only care about the total here
            ]
        );
        freeBooksCount = freeBooksResponse.total;

    } catch (error) {
        console.error("Failed to fetch events:", error);
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-6 flex flex-col items-center">
                <XCircle className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">Error Loading Registrations</h3>
                <p>Unable to connect to the database to retrieve event data. Please check your Appwrite configuration.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-serif">Event Registrations</h1>
                    <p className="text-gray-500 mt-1">Manage attendees for the upcoming book release.</p>
                </div>
                <DownloadCsvButton events={JSON.parse(JSON.stringify(events))} />
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
                        <Users className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Total Registrations</p>
                        <p className="text-3xl font-bold text-gray-900">{totalEvents}</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-5">
                    <div className="p-4 bg-green-50 text-green-600 rounded-xl">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Free Books Claimed</p>
                        <p className="text-3xl font-bold text-gray-900">
                            {freeBooksCount} <span className="text-sm font-normal text-gray-400">/ 50</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4">Registration Date</th>
                                <th className="px-6 py-4">Free Book Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Users className="w-10 h-10 text-gray-300 mb-3" />
                                            <p className="text-lg font-medium text-gray-900">No registrations yet</p>
                                            <p className="text-gray-500 mt-1">When users sign up, they will appear here.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                events.map((event) => (
                                    <tr key={event.$id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{event.name}</p>
                                        </td>
                                        <td className="px-6 py-4 space-y-1">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <a href={`mailto:${event.email}`} className="hover:text-amber-600 hover:underline">{event.email}</a>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                <a href={`tel:${event.whatsapp}`} className="hover:text-amber-600 hover:underline">{event.whatsapp}</a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar className="w-4 h-4" />
                                                <span>
                                                    {new Date(event.$createdAt).toLocaleDateString("en-US", {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {event.gets_free_book ? (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Won Free Book
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    Standard Reg.
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
