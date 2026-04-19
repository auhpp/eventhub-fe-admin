import React, { useEffect, useState } from "react";
import {
    ArrowLeft, Check, X, Mail, Phone, 
    AlertCircle, 
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApproveConfirmModal } from "@/components/ApproveConfirmModal";
import RejectReasonModal from "@/components/RejectReasonModal";
import { useLocation, useNavigate } from "react-router-dom";
import { approveOrganizerRegistrationRequest, getOrganizerRegistrationById, rejectOrganizerRegistration } from "@/services/organizerRegistrationService";
import { HttpStatusCode } from "axios";
import { OrganizerType, RegistrationStatus } from "@/utils/constant";
import { StatusBadge } from "@/components/StatusBadge";
import DefaultAvatar from "@/components/DefaultAvatar";


const OrganizerRequestDetail = () => {
    const [organizerRegistration, setOrganizerRegistration] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isRejectModalOpen, setRejectModalOpen] = useState(false);
    const location = useLocation();
    const organizerRegistrationId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
    const [isRefresh, setIsRefresh] = useState(false)
    const navigate = useNavigate()

    const handleRejectSubmit = async (reason) => {
        console.log("Đã từ chối với lý do:", reason);
        try {
            const response = await rejectOrganizerRegistration({ id: organizerRegistrationId, reason: reason });
            if (response.code == HttpStatusCode.Ok) {
                setIsRefresh(prev => !prev);
                setRejectModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleApprove = async () => {

        try {
            const response = await approveOrganizerRegistrationRequest({ id: organizerRegistrationId });
            if (response.code == HttpStatusCode.Ok) {
                setIsRefresh(prev => !prev);
                setShowConfirmModal(false);
            }
        } catch (error) {
            console.log(error)
        }
    };


    useEffect(
        () => {
            const fetchorganizerRegistration = async () => {
                try {
                    const response = await getOrganizerRegistrationById({ id: organizerRegistrationId })
                    setOrganizerRegistration(response.result)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchorganizerRegistration()
        }, [isRefresh, organizerRegistrationId]
    )


    if (!organizerRegistration) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="pt-4 pb-4 space-y-6">

            {/* --- PAGE HEADER --- */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="outline" size="icon"
                        onClick={() => navigate(-1)}
                        className="h-9 w-9 shrink-0">
                        <ArrowLeft size={16} />
                    </Button>
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-foreground tracking-tight leading-none">
                                {organizerRegistration.businessName}
                            </h1>
                            <StatusBadge status={organizerRegistration.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                ID: <span className="font-mono">#{organizerRegistration.id}</span>
                            </span>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="flex items-center">
                                Gửi ngày: {new Date(organizerRegistration.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons  */}
                {organizerRegistration.status === RegistrationStatus.PENDING && (
                    <div className="flex items-center gap-3 shrink-0">
                        <Button
                            onClick={() => setRejectModalOpen(true)}
                            variant="destructive" className="bg-red-50 text-destructive hover:bg-red-100 border border-red-200 shadow-sm">
                            <X size={16} className="mr-2" /> Từ chối
                        </Button>
                        <Button
                            onClick={() => setShowConfirmModal(true)}
                            className="bg-brand hover:bg-brand/90 text-white shadow-sm">
                            <Check size={16} className="mr-2" /> Phê duyệt
                        </Button>
                    </div>
                )}
            </div>

            {/* --- STATUS ALERT  --- */}
            {organizerRegistration.status === RegistrationStatus.REJECTED && organizerRegistration.rejectionReason && (
                <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Yêu cầu này đã bị từ chối</AlertTitle>
                    <AlertDescription>
                        Lý do: {organizerRegistration.rejectionReason}
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ORGANIZER INFO */}
                <div className="lg:col-span-2 space-y-6">

                    <Card>
                        <CardHeader className="pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <div>
                                    <CardTitle className="text-lg">Hồ sơ đăng ký</CardTitle>
                                    <CardDescription>Thông tin chi tiết đăng ký</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-6 mb-8">
                                {/* Business Avatar */}
                                <div className="shrink-0">
                                    <img
                                        src={organizerRegistration.businessAvatarUrl}
                                        alt="Business Logo"
                                        className="w-32 h-32 rounded-xl object-cover border shadow-sm bg-muted"
                                    />
                                </div>
                                {/* Basic Fields */}
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Người đại diện</label>
                                        <p className="text-sm font-medium ">
                                            {organizerRegistration.representativeFullName}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Email liên hệ</label>
                                        <p className="text-sm font-medium ">

                                            {organizerRegistration.email}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Loại hình</label>
                                        <p className="text-sm font-medium">
                                            {organizerRegistration.type == OrganizerType.PERSONAL ? "Cá nhân" : "Tổ chức"}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">Mã số thuế</label>
                                        <p className="text-sm font-medium">
                                            {organizerRegistration.taxCode}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Số điện thoại</label>
                                        <p className="text-sm font-medium ">
                                            {organizerRegistration.phoneNumber}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-muted-foreground uppercase">
                                            Địa chỉ trụ sở</label>
                                        <div className="text-sm font-medium">
                                            {organizerRegistration.contactAddress}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-6" />

                            {/* Biography Section */}
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase">
                                    Giới thiệu (Biography)</label>
                                <div className="bg-muted/30 p-4 rounded-lg text-sm text-foreground/90 leading-relaxed border">
                                    {organizerRegistration.biography}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* APP USER INFO  */}
                <div className="lg:col-span-1 space-y-6">

                    <Card>
                        <CardHeader className="pb-4 border-b bg-muted/30">
                            <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                Tài khoản đăng ký</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="relative">
                                    <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                                        <DefaultAvatar user={organizerRegistration.appUser} />
                                    </Avatar>

                                </div>
                                <div>
                                    <h4 className="font-bold text-lg leading-tight">{organizerRegistration.appUser.fullName}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">Tham gia: {new Date(organizerRegistration.appUser.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center shrink-0 text-muted-foreground">
                                        <Mail size={14} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium truncate" title={organizerRegistration.appUser.email}>{organizerRegistration.appUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                                    <div className="h-8 w-8 rounded-full bg-background border flex items-center justify-center shrink-0 text-muted-foreground">
                                        <Phone size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{organizerRegistration.appUser.phoneNumber || "Chưa cập nhật"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Alert variant="default" className="bg-blue-50 text-blue-900 border-blue-100 
                                dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800 py-3">
                                    <AlertCircle className="h-4 w-4 stroke-blue-600 dark:stroke-blue-400" />
                                    <AlertDescription className="text-sm ml-2">
                                        Hãy đối chiếu thông tin doanh nghiệp và tài khoản cá nhân trước khi duyệt.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>

            <ApproveConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleApprove}
                orgName="Công ty Sự kiện Xanh"
            />
            <RejectReasonModal
                isOpen={isRejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleRejectSubmit}
                title={"Từ chối yêu cầu đăng ký"}
            />
        </div>
    );
};

export default OrganizerRequestDetail;