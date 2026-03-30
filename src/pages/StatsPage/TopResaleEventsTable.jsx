import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTopResaleEvent } from '@/services/statsService';

const TopResaleEventsTable = ({ filters, refresh }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchTopResales = async () => {
            try {
                const data = await getTopResaleEvent({ ...filters, limit: 5 });
                setEvents(data.result || data || []);
            } catch (error) { console.error("Lỗi lấy top bán lại:", error); }
        };
        fetchTopResales();
    }, [filters, refresh]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base">Top sự kiện có vé bán lại</CardTitle>
                <CardDescription>Các sự kiện có nhu cầu pass vé cao nhất</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm text-gray-500 bg-gray-50 border-y">
                            <tr>
                                <th className="px-4 py-3">Sự Kiện</th>
                                <th className="px-4 py-3 text-right">Bài Đăng</th>
                                <th className="px-4 py-3 text-right">Thành Công</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {events.map((evt) => (
                                <tr key={evt.eventId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900 truncate max-w-[300px]" title={evt.eventName}>
                                            {evt.eventName}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-right text-yellow-600 font-medium">
                                        {evt.resalePostCount}
                                    </td>
                                    <td className="px-4 py-3 text-right text-green-600 font-medium">
                                        {evt.completedTransactionCount}
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

export default TopResaleEventsTable

