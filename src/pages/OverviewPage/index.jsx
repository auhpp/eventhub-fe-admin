import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    CalendarClock,
    Ticket,
    DollarSign,
    Users,
    ArrowRight,
    TrendingUp,
    Notebook
} from 'lucide-react';

import { getKpiOverview } from '@/services/statsService';
import { countEvent } from '@/services/eventService';
import { countResalePost } from '@/services/resalePostService';
import { countOrganizerRegistration } from '@/services/organizerRegistrationService';
import { routes } from '@/config/routes';
import { formatCurrency } from '@/utils/format';
import { countWithdrawalRequest } from '@/services/withdrawalRequestService';

export default function OverviewPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        pendingEvents: 0,
        pendingResales: 0,
        pendingOrganizerRequest: 0,
        pendingWithdrawalRequests: 0,
        todayRevenue: 0,
        todayNewUsers: 0
    });

    const fetchTodayOverview = async () => {
        setLoading(true);
        try {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const dateString = `${year}-${month}-${day}`;

            const startOfDay = `${dateString}T00:00:00`;
            const endOfDay = `${dateString}T23:59:59`;

            const [kpiData, eventsData, resalesData, organizerData, withdrawalData] = await Promise.all([
                getKpiOverview({ startDate: startOfDay, endDate: endOfDay }),
                countEvent({ statuses: ['PENDING'] }),
                countResalePost({ status: 'PENDING' }),
                countOrganizerRegistration({ status: "PENDING" }),
                countWithdrawalRequest({ status: "PENDING" })

            ]);

            setStats({
                todayRevenue: kpiData?.result?.totalFmv || 0,
                todayNewUsers: kpiData?.result?.newUsersCount || 0,
                pendingEvents: eventsData?.result || 0,
                pendingResales: resalesData?.result || 0,
                pendingOrganizerRequest: organizerData?.result || 0,
                pendingWithdrawalRequests: withdrawalData?.result || 0
            });
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu tổng quan:", error);
        } finally {
            setLoading(false);
        }
    };

    const currentDateString = new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date());

    useEffect(() => {
        fetchTodayOverview();
    }, []);

    return (
        <div className="p-2 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tổng quan</h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <CalendarClock className="w-4 h-4" />
                        Hôm nay: <span className="font-medium text-gray-900">{currentDateString}</span>
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
            ) : (
                <>
                    {/* session 1 */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Cần Xử Lý Ngay
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                            {/* Card: pending events */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Sự kiện chờ duyệt</p>
                                            <p className="text-4xl font-bold text-gray-900">{stats.pendingEvents}</p>
                                        </div>
                                        <div className="p-4 bg-amber-50 rounded-full text-amber-600">
                                            <CalendarClock className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            asChild
                                            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                                            disabled={stats.pendingEvents === 0}
                                        >
                                            <Link to={routes.eventManagement + "?status=PENDING"}>
                                                Đi tới duyệt ngay <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card: pending resale posts */}
                            <Card >
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">
                                                Bài bán lại vé chờ duyệt</p>
                                            <p className="text-4xl font-bold text-gray-900">{stats.pendingResales}</p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-full text-green-600">
                                            <Ticket className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            asChild
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            disabled={stats.pendingResales === 0}
                                        >
                                            <Link to={routes.resalePost + "?status=PENDING"}>
                                                Đi tới duyệt ngay <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Card: pending organizer request  */}
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Yêu cầu thành nhà tổ chức</p>
                                            <p className="text-4xl font-bold text-gray-900">{stats.pendingOrganizerRequest}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                                            <Notebook className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            asChild
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            disabled={stats.pendingOrganizerRequest === 0}
                                        >
                                            <Link to={routes.organizerRegistration + "?status=PENDING"}>
                                                Đi tới duyệt ngay <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-muted-foreground">Yêu cầu rút tiền</p>
                                            <p className="text-4xl font-bold text-gray-900">{stats.pendingWithdrawalRequests}</p>
                                        </div>
                                        <div className="p-4 bg-orange-50 rounded-full text-orange-600">
                                            <DollarSign className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <Button
                                            asChild
                                            className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                                            disabled={stats.pendingWithdrawalRequests === 0}
                                        >
                                            <Link to={routes.withdrawalRequest + "?status=PENDING"}>
                                                Đi tới duyệt ngay <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Session 2 */}
                    <div className="pt-4 border-t border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            Thông Số Hôm Nay (24h qua)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card: revenue today */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Doanh thu trong ngày
                                    </CardTitle>
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(stats.todayRevenue)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Đã tính từ 00:00 hôm nay
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Card: new users */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        Tài khoản đăng ký mới
                                    </CardTitle>
                                    <Users className="w-4 h-4 text-indigo-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        +{stats.todayNewUsers}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Người dùng và nhà tổ chức mới
                                    </p>
                                </CardContent>
                            </Card>

                        </div>
                    </div>
                </>
            )}
        </div>
    );
}