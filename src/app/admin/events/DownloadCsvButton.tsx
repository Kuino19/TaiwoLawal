'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface EventData {
    $id: string;
    $createdAt: string;
    name: string;
    email: string;
    whatsapp: string;
    gets_free_book: boolean;
}

interface DownloadCsvButtonProps {
    events: EventData[];
}

export default function DownloadCsvButton({ events }: DownloadCsvButtonProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        try {
            setIsDownloading(true);

            if (!events || events.length === 0) {
                toast.error("No registrations to download.");
                setIsDownloading(false);
                return;
            }

            // 1. Create CSV Header
            const headers = ['Registration Date', 'Name', 'Email Address', 'WhatsApp Number', 'Free Book Winner'];

            // 2. Map data to rows
            const rows = events.map(event => {
                const date = new Date(event.$createdAt).toLocaleString("en-US", {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });

                // Escape strings containing quotes or commas
                const escapeCsv = (val: string) => `"${val.replace(/"/g, '""')}"`;

                return [
                    escapeCsv(date),
                    escapeCsv(event.name),
                    escapeCsv(event.email),
                    escapeCsv(event.whatsapp),
                    event.gets_free_book ? 'Yes' : 'No'
                ].join(',');
            });

            // 3. Combine header and rows
            const csvContent = [headers.join(','), ...rows].join('\n');

            // 4. Create Blob and Download Link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `event_registrations_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download started successfully");

        } catch (error) {
            console.error("Failed to generate CSV:", error);
            toast.error("Failed to generate the download file.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading || events.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isDownloading ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
                <Download className="w-4 h-4" />
            )}
            Download CSV
        </button>
    );
}
