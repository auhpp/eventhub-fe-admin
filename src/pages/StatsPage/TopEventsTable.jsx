import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTopEventRevenue } from '@/services/statsService';
import { formatCurrency } from '@/utils/format';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TopEventsTable = ({ filters, refresh }) => {
    const [events, setEvents] = useState([]);
    const [limit, setLimit] = useState("5");

    useEffect(() => {
        const fetchTopEvents = async () => {
            try {
                const data = await getTopEventRevenue({ ...filters, limit: 5 });
                setEvents(data.result || data || []);
            } catch (error) { console.error(error); }
        };
        fetchTopEvents();
    }, [filters, refresh, limit]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-base">Top Sự Kiện Mang Lại Doanh Thu</CardTitle>
                    <CardDescription>5 sự kiện có tổng phí dịch vụ cao nhất</CardDescription>
                </div>
                <Select value={limit} onValueChange={setLimit}>
                    <SelectTrigger className="w-[120px] bg-card h-9 text-sm">
                        <SelectValue placeholder="Số lượng" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">Top 5</SelectItem>
                        <SelectItem value="10">Top 10</SelectItem>
                        <SelectItem value="20">Top 20</SelectItem>
                        <SelectItem value="50">Top 50</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm text-gray-500 bg-gray-50 border-y">
                            <tr>
                                <th className="px-4 py-3">Sự kiện</th>
                                <th className="px-4 py-3 text-right">Vé đã bán</th>
                                <th className="px-4 py-3 text-right">Tổng phí dịch vụ</th>
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