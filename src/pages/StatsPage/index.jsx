import React, { useState, useEffect } from 'react';
import { getKpiOverview } from '@/services/statsService';
import { KpiCard } from './KpiCard';
import { DashboardFilters } from './DashboardFilters';
import {
    DollarSign,
    Wallet,
    CalendarCheck,
    Clock,
    XCircle,
    Ban,
    Ticket,
    Users,
    Loader2
} from 'lucide-react';

import RefreshButton from '@/components/RefreshButton';
import { RevenueChartWidget } from './RevenueChartWidget';
import TopEventsTable from './TopEventsTable';
import TopOrganizersTable from './TopOrganizersTable';
import CategoryDistributionChart from './CategoryDistributionChart';
import EventApprovalStatWidget from './EventApprovalStatWidget';
import TopResaleEventsTable from './TopResaleEventsTable';
import UserGrowthChartWidget from './UserGrowthChartWidget';
import { formatCurrency } from '@/utils/format';

export default function StatsPage() {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        timeUnit: 'MONTH'
    });
    const [kpiData, setKpiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetchKpiData();
    }, [filters, refresh]);

    const fetchKpiData = async () => {
        try {
            const data = await getKpiOverview(filters);
            setKpiData(data.result);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu KPI:", error);
        } finally {
            setLoading(false);
        }
    };


    const formatNumber = (value) => value?.toLocaleString('vi-VN') || '0';

    return (
        <div className="p-2 pb-6 space-y-6">
            <div className='flex justify-between'>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Thống kê</h1>
                    <p className="text-muted-foreground mt-2">
                        Theo dõi doanh thu, trạng thái sự kiện và người dùng trên nền tảng.
                    </p>
                </div>
                <RefreshButton isLoading={loading} onClick={() => setRefresh(!refresh)} />
            </div>

            <DashboardFilters filters={filters} onFilterChange={setFilters} />

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : kpiData ? (
                <div className="space-y-6">
                    {/* Session 1: Tài chính & Doanh thu */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Tài chính & Doanh thu</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <KpiCard
                                title="Tổng doanh thu"
                                value={formatCurrency(kpiData.totalFmv)}
                                icon={DollarSign}
                                iconColor="bg-green-100 text-green-600"
                                description="Tổng dòng tiền giao dịch"
                            />
                            <KpiCard
                                title="Phí dịch vụ từ sự kiện"
                                value={formatCurrency(kpiData.commissionFromEvents)}
                                icon={Wallet}
                                iconColor="bg-blue-100 text-blue-600"
                            />
                            <KpiCard
                                title="Phí dịch vụ từ bán Lại Vé"
                                value={formatCurrency(kpiData.commissionFomResales)}
                                icon={Ticket}
                                iconColor="bg-purple-100 text-purple-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Chart */}
                        <RevenueChartWidget refresh={refresh} filters={filters} />

                        {/* Top event and organizer */}
                        <div className="col-span-1">
                            <TopEventsTable refresh={refresh} filters={filters} />
                        </div>
                        <div className="col-span-1">
                            <TopOrganizersTable refresh={refresh} filters={filters} />
                        </div>
                    </div>
                    {/* Session 2: Vận hành Sự kiện*/}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Vận hành Sự kiện</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <KpiCard
                                title="Đang hoạt động"
                                value={formatNumber(kpiData.activeEventsCount)}
                                icon={CalendarCheck}
                                iconColor="bg-green-100 text-green-600"
                            />
                            <KpiCard
                                title="Đang chờ duyệt"
                                value={formatNumber(kpiData.pendingEventsCount)}
                                icon={Clock}
                                iconColor="bg-yellow-100 text-yellow-600"
                            />
                            <KpiCard
                                title="Bị từ chối"
                                value={formatNumber(kpiData.rejectEventsCount)}
                                icon={Ban}
                                iconColor="bg-red-100 text-red-600"
                            />
                            <KpiCard
                                title="Đã hủy"
                                value={formatNumber(kpiData.cancelEventsCount)}
                                icon={XCircle}
                                iconColor="bg-gray-100 text-gray-600"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="col-span-1">
                                {/*Category chart */}
                                <CategoryDistributionChart refresh={refresh} filters={filters} />
                            </div>
                            <div className="col-span-1">
                                <EventApprovalStatWidget refresh={refresh} filters={filters} />
                            </div>
                        </div>
                    </div>

                    {/* Session 3: Bán lại vé và người dùng */}
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Bán lại vé và người dùng</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <KpiCard
                                title="Bài bán lại chờ duyệt"
                                value={formatNumber(kpiData.pendingResalesCount)}
                                icon={Ticket}
                                iconColor="bg-yellow-100 text-yellow-600"
                                description="Cần được xử lý sớm"
                            />
                            <KpiCard
                                title="Người dùng mới"
                                value={formatNumber(kpiData.newUsersCount)}
                                icon={Users}
                                iconColor="bg-indigo-100 text-indigo-600"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="col-span-1">
                                {/* Top resale events */}
                                <TopResaleEventsTable refresh={refresh} filters={filters} />
                            </div>
                            <div className="col-span-1">
                                {/* User chart */}
                                <UserGrowthChartWidget refresh={refresh} filters={filters} />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-10">Không có dữ liệu</div>
            )}
        </div>
    );
}