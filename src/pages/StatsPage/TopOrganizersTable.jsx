import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getTopOrganizer } from '@/services/statsService';
import { formatCurrency } from '@/utils/format';

const TopOrganizersTable = ({ filters, refresh }) => {
    const [organizers, setOrganizers] = useState([]);

    useEffect(() => {
        const fetchTopOrganizers = async () => {
            try {
                const data = await getTopOrganizer({ ...filters, limit: 5 });
                setOrganizers(data.result || data || []);
            } catch (error) { console.error(error); }
        };
        fetchTopOrganizers();
    }, [filters, refresh]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Top Nhà Tổ Chức</CardTitle>
                <CardDescription>5 đối tác tạo nhiều hoa hồng nhất</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-sm text-gray-500 bg-gray-50 border-y">
                            <tr>
                                <th className="px-4 py-3">Nhà Tổ Chức</th>
                                <th className="px-4 py-3 text-right">Sự Kiện</th>
                                <th className="px-4 py-3 text-right">Tổng Hoa Hồng</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {organizers.map((org) => (
                                <tr key={org.organizerId} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{org.organizerName}</td>
                                    <td className="px-4 py-3 text-right">{org.eventCount}</td>
                                    <td className="px-4 py-3 text-right font-medium text-red-600">
                                        {formatCurrency(org.totalCommissionGenerated)}
                                    </td>
                                </tr>
                            ))}
                            {organizers.length === 0 && (
                                <tr><td colSpan="3" className="text-center py-4 text-gray-500">Không có dữ liệu</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopOrganizersTable