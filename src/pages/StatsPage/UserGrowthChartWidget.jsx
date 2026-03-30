import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { getUserGrowthChart } from '@/services/statsService';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const UserGrowthChartWidget = ({ filters, refresh }) => {
    const [chartData, setChartData] = useState([]);
    const [roleName, setRoleName] = useState('ALL'); 

    useEffect(() => {
        const fetchGrowth = async () => {
            try {
                const data = await getUserGrowthChart({ ...filters, roleName: roleName == "ALL" ? null : roleName });
                setChartData(data.result || data || []);
            } catch (error) { console.error("Lỗi lấy dữ liệu user mới:", error); }
        };
        fetchGrowth();
    }, [filters, roleName, refresh]);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base">Tăng Trưởng Người Dùng Mới</CardTitle>
                    <CardDescription>Số lượng tài khoản đăng ký theo chu kỳ</CardDescription>
                </div>
                <Select
                    className="text-sm border rounded-md px-2 py-1 outline-none mt-0"
                    value={roleName}
                    onValueChange={(val) => setRoleName(val)}
                >
                    <SelectTrigger className="w-[150px] bg-card">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tất cả</SelectItem>
                        <SelectItem value="USER">Khách hàng</SelectItem>
                        <SelectItem value="ORGANIZER">Nhà tổ chức</SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full mt-4
                             [&_.recharts-wrapper]:outline-none 
                [&_.recharts-surface]:outline-none [&_*:focus]:outline-none
                ">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            style={{ outline: 'none' }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#808080" />
                            <XAxis
                                dataKey="timeLabel"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#000000', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#000000', fontSize: 12 }}
                            />
                            <RechartsTooltip
                                formatter={(value) => [value, 'Người dùng mới']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="newUsersCount"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserGrowthChartWidget