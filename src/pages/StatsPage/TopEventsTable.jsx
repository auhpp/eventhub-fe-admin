import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTopEventRevenue } from '@/services/statsService';
import { formatCurrency } from '@/utils/format';

 const TopEventsTable = ({ filters, refresh }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchTopEvents = async () => {
            try {
                const data = await getTopEventRevenue({ ...filters, limit: 5 });
                setEvents(data.result || data || []);
            } catch (error) { console.error(error); }
        };
        fetchTopEvents();
    }, [filters, refresh]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Top Sự Kiện Mang Lại Doanh Thu</CardTitle>
                <CardDescription>5 sự kiện có hoa hồng cao nhất</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm text-gray-500 bg-gray-50 border-y">
                            <tr>
                                <th className="px-4 py-3">Sự Kiện</th>
                                <th className="px-4 py-3 text-right">Vé Đã Bán</th>
                                <th className="px-4 py-3 text-right">Hoa Hồng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {events.map((evt) => (
                                <tr key={evt.eventId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 truncate max-w-[300px]">{evt.eventName}</p>
                                        <p className="text-sm text-gray-500">{evt.organizerName}</p>
                                    </td>
                                    <td className="px-4 py-3 text-right">{evt.totalTicketsSold}</td>
                                    <td className="px-4 py-3 text-right font-medium text-red-600">
                                        {formatCurrency(evt.totalCommission)}
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && (
                                <tr><td colSpan="3" className="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopEventsTable