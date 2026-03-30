import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { getCategoryDistribution } from '@/services/statsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EventStatus } from '@/utils/constant';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const CategoryDistributionChart = ({ filters, refresh }) => {
    const [data, setData] = useState([]);
    const [status, setStatus] = useState('ALL');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCategoryDistribution({ ...filters, status: status == "ALL" ? null : status });
                setData(response.result || response || []);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu danh mục:", error);
            }
        };
        fetchData();
    }, [filters, status, refresh]);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base">Phân Bổ Danh Mục Sự Kiện</CardTitle>
                    <CardDescription>Tỷ trọng các loại hình sự kiện</CardDescription>
                </div>
                <Select
                    className="text-sm border rounded-md px-2 py-1 outline-none mt-0"
                    value={status}
                    onValueChange={(val) => setStatus(val)}
                >
                    <SelectTrigger className="w-[150px] bg-card">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                        <SelectItem value={EventStatus.APPROVED}>Đã duyệt</SelectItem>
                        <SelectItem value={EventStatus.PENDING}>Chờ duyệt</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4 
                [&_.recharts-wrapper]:outline-none 
                [&_.recharts-surface]:outline-none [&_*:focus]:outline-none
                ">
                    {data.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart style={{ outline: 'none' }}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="eventCount"
                                    nameKey="categoryName"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip
                                    formatter={(value) => [`${value} sự kiện`, 'Số lượng']}
                                    contentStyle={{
                                        borderRadius: '8px', border: 'none',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Legend layout="vertical" verticalAlign="middle" align="right"
                                    wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm text-gray-500">
                            Không có dữ liệu danh mục
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CategoryDistributionChart