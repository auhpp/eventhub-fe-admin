import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getRevenueCharts } from '@/services/statsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const RevenueChartWidget = ({ filters, refresh }) => {
    const [chartData, setChartData] = useState([]);
    const [revenueSource, setRevenueSource] = useState('EVENT_TICKET');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        fetchChartData();
    }, [filters, revenueSource, refresh]);

    const fetchChartData = async () => {
        try {
            const data = await getRevenueCharts({ ...filters, revenueSource });
            setChartData(data.result || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu biểu đồ:", error);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { notation: "compact", compactDisplay: "short" }).format(value) + ' ₫';
    };

    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle>Biểu Đồ Doanh Thu & Phí dịch vụ</CardTitle>
                    <CardDescription>Theo dõi biến động dòng tiền theo chu kỳ</CardDescription>
                </div>
                <Select
                    className="text-sm border rounded-md px-2 py-1 outline-none"
                    value={revenueSource}
                    onValueChange={(val) => setRevenueSource(val)}
                >
                    <SelectTrigger className="w-[140px] bg-card">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="EVENT_TICKET">Bán vé sự kiện</SelectItem>
                        <SelectItem value="RESALE">Bán lại vé</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full mt-4
                 [&_.recharts-wrapper]:outline-none 
                [&_.recharts-surface]:outline-none [&_*:focus]:outline-none
                ">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                            style={{ outline: 'none' }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />

                            <XAxis dataKey="timeLabel" axisLine={false} tickLine={false}
                                tick={{ fill: '#000000', fontSize: 12 }} dy={10} />

                            <YAxis yAxisId="left" tickFormatter={formatCurrency} axisLine={false}
                                tickLine={false} tick={{ fill: '#000000', fontSize: 12 }} />

                            <YAxis yAxisId="right" orientation="right" tickFormatter={formatCurrency}
                                axisLine={false} tickLine={false} tick={{ fill: '#000000', fontSize: 12 }} />

                            <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN',
                                { style: 'currency', currency: 'VND' }).format(value)}
                                contentStyle={{
                                    borderRadius: '8px', border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }} />

                            <Legend wrapperStyle={{ paddingTop: '20px' }} />

                            <Bar yAxisId="left" dataKey="gmv" name="Tổng doanh thu"
                                fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />

                            <Line yAxisId="right" type="monotone" dataKey="commission"
                                name="Tổng phí dịch vụ" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};