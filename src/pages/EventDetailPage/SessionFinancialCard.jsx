import React, { useEffect, useState } from "react";
import {
    Loader2,
    PieChart,
    ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HttpStatusCode } from "axios";
import { formatCurrency, formatDate } from "@/utils/format";
import { EventStatus } from "@/utils/constant";
import { toast } from "sonner";
import { releaseFundManually } from "@/services/eventSessionService";
import { getEventStats } from "@/services/statsService";
import { isExpiredEventSession } from "@/utils/eventUtils";
import ConfirmDialog from "@/components/ConfirmDialog";

const SessionFinancialCard = ({ session, eventStatus }) => {
    const [stats, setStats] = useState(null);
    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isReleasing, setIsReleasing] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const isApproved = eventStatus === EventStatus.APPROVED;
    const isSessionEnded = isExpiredEventSession({ endDateTime: session.endDateTime });
    useEffect(() => {
        if (!isApproved) return;

        const fetchStats = async () => {
            setIsLoadingStats(true);
            try {
                const response = await getEventStats({ eventSessionId: session.id });
                if (response.code === HttpStatusCode.Ok || response.result) {
                    setStats(response.result );
                }
            } catch (error) {
                console.error("Lỗi khi tải thống kê session:", error);
            } finally {
                setIsLoadingStats(false);
            }
        };
        fetchStats();
    }, [session.id, isApproved]);

    const handleReleaseFund = async () => {
        setIsReleasing(true);
        try {
            const response = await releaseFundManually({ id: session.id });
            if (response.code === HttpStatusCode.Ok || response.status === 200 || response.result) {
                toast.success(`Đã đối soát & nhả tiền thành công cho phiên ${formatDate(session.startDateTime)}!`);
            } else {
                toast.error("Có lỗi xảy ra hoặc tiền đã được nhả trước đó.");
            }
        } catch (error) {
            console.error(error);
            if (error.response.data.code == 1011) {
                toast.error("Lỗi khi nhả tiền: Không có tiền để nhả");
            }
            else {
                toast.error("Lỗi khi nhả tiền: " + error.response.data.message);
            }
        } finally {
            setIsReleasing(false);
            setIsConfirmOpen(false);
        }
    };

    if (!isApproved) return null;

    return (
        <div className="border rounded-lg p-4 mt-4 bg-slate-50 dark:bg-slate-800/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h5 className="font-semibold text-sm flex items-center gap-2 text-slate-700 dark:text-slate-200">
                    <PieChart className="w-4 h-4 text-primary" />
                    Báo cáo & Đối soát dòng tiền
                </h5>

                <Button
                    size="sm"
                    variant={isSessionEnded ? "default" : "secondary"}
                    disabled={!isSessionEnded || isReleasing}
                    onClick={() => setIsConfirmOpen(true)}
                    className="gap-2"
                >
                    {isReleasing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRightLeft className="w-4 h-4" />}
                    {isSessionEnded ? "Thực hiện Đối soát & Nhả tiền" :
                        "Chưa thể nhả tiền (Sự kiện chưa kết thúc)"}
                </Button>
            </div>

            {isLoadingStats ? (
                <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
            ) : stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border">
                        <p className="text-sm text-muted-foreground mb-1">Tổng doanh thu bán vé</p>
                        <p className="font-bold text-green-600">{formatCurrency(stats.totalRevenue || 0)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border">
                        <p className="text-sm text-muted-foreground mb-1">Doanh thu bán lại</p>
                        <p className="font-bold text-blue-600">{formatCurrency(stats.totalResaleRevenue || 0)}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border">
                        <p className="text-sm text-muted-foreground mb-1">Phí dịch vụ thu được</p>
                        <p className="font-bold text-orange-600">
                            {formatCurrency((stats.totalFee || 0) + (stats.totalFeeFromResale || 0))}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded border">
                        <p className="text-sm text-muted-foreground mb-1">Vé đã bán / Sức chứa</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                            {stats.totalTicketsSold || 0} / {stats.totalCapacity || 0}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-muted-foreground italic">Chưa có dữ liệu thống kê.</p>
            )}
            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                onConfirm={handleReleaseFund}
                title="Xác nhận nhả tiền"
                description={`Bạn có chắc chắn muốn CHUYỂN TIỀN cho phiên sự kiện ngày ${formatDate(session.startDateTime)}? Hành động này sẽ chuyển tiền từ Pending sang Available cho Ban tổ chức và không thể hoàn tác.`}
                confirmLabel="Chuyển tiền"
                cancelLabel="Hủy bỏ"
                variant="default"
                isLoading={isReleasing}
            />
        </div>
    );
};

export default SessionFinancialCard;