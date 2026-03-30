import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getEventApprovalStat } from '@/services/statsService';

const EventApprovalStatWidget = ({ filters }) => {
    const [stats, setStats] = useState({ approvedCount: 0, rejectedCount: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getEventApprovalStat(filters);
                const resultData = response.result || response || { approvedCount: 0, rejectedCount: 0 };
                setStats(resultData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu duyệt sự kiện:", error);
            }
        };
        fetchData();
    }, [filters]);

    const total = (stats.approvedCount || 0) + (stats.rejectedCount || 0);
    const approvedPercent = total === 0 ? 0 : Math.round((stats.approvedCount / total) * 100);
    const rejectedPercent = total === 0 ? 0 : 100 - approvedPercent;

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-base">Tỷ Lệ Duyệt Sự Kiện</CardTitle>
                <CardDescription>Đánh giá chất lượng sự kiện được tạo</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-6 mt-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="space-y-1">
                            <span className="text-gray-500 block">Tổng đã xử lý</span>
                            <span className="text-2xl font-bold">{total}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {/* process bar */}
                        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex">
                            {total > 0 ? (
                                <>
                                    <div
                                        className="h-full bg-green-500 transition-all duration-500"
                                        style={{ width: `${approvedPercent}%` }}
                                    ></div>
                                    <div
                                        className="h-full bg-red-400 transition-all duration-500"
                                        style={{ width: `${rejectedPercent}%` }}
                                    ></div>
                                </>
                            ) : (
                                <div className="h-full w-full bg-gray-200"></div>
                            )}
                        </div>

                        {/* note */}
                        <div className="flex justify-between text-sm pt-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Đã duyệt ({approvedPercent}%)</span>
                                <span className="font-semibold">{stats.approvedCount || 0}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <span>Từ chối ({rejectedPercent}%)</span>
                                <span className="font-semibold">{stats.rejectedCount || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default EventApprovalStatWidget