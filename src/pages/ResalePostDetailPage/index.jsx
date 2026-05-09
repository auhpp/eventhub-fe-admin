import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ConfirmDialog";
import RejectReasonModal from "@/components/RejectReasonModal";
import { getSystemConfigByKey } from "@/services/systemConfigurationService";
import { getResalePostById, approveResalePost, rejectResalePost, cancelResalePostByAdmin } from "@/services/resalePostService";
import { getEventById } from "@/services/eventService";
import { getEventSessionById } from "@/services/eventSessionService";
import { PostHeader } from "./PostHeader";
import { ModerationActions } from "./ModerationActions";
import { ResaleTicketList } from "./ResaleTicketList";
import { OriginalTicketInfo } from "./OriginalTicketInfo";
import { PricingAnalysis } from "./PricingAnalysis";
import { SellerInfo } from "./SellerInfo";

const ResalePostDetailPage = () => {
    const location = useLocation();
    const postId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);

    const [post, setPost] = useState(null);
    const [event, setEvent] = useState(null);
    const [eventSession, setEventSession] = useState(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false);

    const [configs, setConfigs] = useState({ minRate: 0, maxRate: 0, commissionRate: 0 });

    // Modals state
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const postRes = await getResalePostById({ id: postId });
                const postData = postRes.result;
                setPost(postData);

                const eventRes = await getEventById({ id: postData.attendees?.[0]?.ticket.eventId });
                setEvent(eventRes.result);

                const eventSessionRes = await getEventSessionById({ id: postData.attendees?.[0]?.ticket.eventSessionId });
                setEventSession(eventSessionRes.result);

                const [minRes, maxRes, comRes] = await Promise.all([
                    getSystemConfigByKey({ key: 'MIN_RESALE_RATE' }),
                    getSystemConfigByKey({ key: 'MAX_RESALE_RATE' }),
                    getSystemConfigByKey({ key: 'RESALE_COMMISSION_RATE' })
                ]);

                setConfigs({
                    minRate: Number(minRes?.result?.value || 0),
                    maxRate: Number(maxRes?.result?.value || 0),
                    commissionRate: Number(comRes?.result?.value || 0)
                });

            } catch (error) {
                console.error(error);
                toast.error("Không thể tải thông tin bài đăng.");
            } finally {
                setIsLoading(false);
            }
        };

        if (postId) fetchInitialData();
    }, [postId, isRefresh]);

    if (isLoading || !post) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Calculations
    const ticketInfo = post.attendees?.[0]?.ticket;
    const originalPrice = ticketInfo?.price || 0;
    const minAllowedPrice = (originalPrice * configs.minRate) / 100;
    const maxAllowedPrice = (originalPrice * configs.maxRate) / 100;
    const isPriceValid = post.pricePerTicket >= minAllowedPrice && post.pricePerTicket <= maxAllowedPrice;

    // Handlers
    const handleApprove = async () => {
        try {
            setIsProcessing(true);
            await approveResalePost({ id: postId });
            toast.success("Đã phê duyệt bài đăng bán lại vé.");
            setIsRefresh(prev => !prev);
        } catch (error) {
            console.log(error)
            toast.error("Phê duyệt thất bại.");
        } finally {
            setIsProcessing(false);
            setIsApproveModalOpen(false);
        }
    };

    const handleReject = async (reason) => {
        try {
            setIsProcessing(true);
            await rejectResalePost({ id: postId, reason });
            toast.success("Đã từ chối bài đăng.");
            setIsRefresh(prev => !prev);
        } catch (error) {
            console.log(error)
            toast.error("Từ chối thất bại.");
        } finally {
            setIsProcessing(false);
            setIsRejectModalOpen(false);
        }
    };

    const handleCancel = async (reason) => {
        try {
            setIsProcessing(true);
            await cancelResalePostByAdmin({ id: postId, reason });
            toast.success("Đã hủy bài đăng thành công.");
            setIsRefresh(prev => !prev);
        } catch (error) {
            console.log(error)
            toast.error("Hủy bài đăng thất bại.");
        } finally {
            setIsProcessing(false);
            setIsCancelModalOpen(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto dark:bg-slate-950">
            <div className=" space-y-6">

                {/* Header */}
                <PostHeader post={post} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* content left */}
                    <div className="lg:col-span-2 space-y-6">
                        <OriginalTicketInfo
                            ticketInfo={ticketInfo}
                            event={event}
                            eventSession={eventSession}
                        />
                        <ResaleTicketList post={post} />
                    </div>

                    {/* content right */}
                    <div className="space-y-6 lg:sticky lg:top-6">
                        <ModerationActions
                            post={post}
                            isPriceValid={isPriceValid}
                            isProcessing={isProcessing}
                            onApproveClick={() => setIsApproveModalOpen(true)}
                            onRejectClick={() => setIsRejectModalOpen(true)}
                            onCancelClick={() => setIsCancelModalOpen(true)}
                        />
                        <PricingAnalysis
                            pricePerTicket={post.pricePerTicket}
                            configs={configs}
                            minAllowedPrice={minAllowedPrice}
                            maxAllowedPrice={maxAllowedPrice}
                            isPriceValid={isPriceValid}
                        />
                        <SellerInfo user={post.appUser} />
                    </div>
                </div>
            </div>

            {/* Modals */}
            <ConfirmDialog
                open={isApproveModalOpen}
                onOpenChange={setIsApproveModalOpen}
                onConfirm={handleApprove}
                title="Xác nhận phê duyệt"
                description="Bạn có chắc chắn muốn phê duyệt bài đăng bán lại vé này? Sau khi duyệt, bài đăng sẽ được hiển thị trên hệ thống."
                isLoading={isProcessing}
                confirmLabel="Phê duyệt"
            />
            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleReject}
                title="Từ chối bài đăng bán vé"
            />
            <RejectReasonModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancel}
                title="Hủy bài đăng đang mở"
            />
        </div>
    );
};

export default ResalePostDetailPage;