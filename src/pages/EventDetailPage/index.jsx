import React, { useEffect, useState } from "react";
import {
    Calendar, MapPin, Users, Building, Mail, Phone,
    CheckCircle, XCircle, AlertCircle, ExternalLink, ArrowLeft,
    Gavel,
    Loader2,
    Ticket,
    CalendarClock,
    ChartBarStacked
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ApproveEventModal } from "@/features/event/ApproveEventModal";
import { useLocation, useNavigate } from "react-router-dom";
import { approveEvent, getEventById, rejectEvent } from "@/services/eventService";
import { HttpStatusCode } from "axios";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, formatDateTime, formatTime, getDayInWeek } from "@/utils/format";
import { EventStatus, EventType, SystemConfigurationKey } from "@/utils/constant";
import Map from "@/components/Map";
import RejectReasonModal from "@/components/RejectReasonModal";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSystemConfigByKey } from "@/services/systemConfigurationService";
import { toast } from "sonner";

const EventDetailPage = () => {
    const [event, setEvent] = useState(null);
    const location = useLocation();
    const eventId = location.pathname.substring(location.pathname.lastIndexOf("/") + 1)
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRefresh, setIsRefresh] = useState(false)
    const navigate = useNavigate()
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [eventCommissionRate, setEventCommissionRate] = useState(null)
    const [eventCommissionFixed, setEventCommissionFixed] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    useEffect(
        () => {
            const fetchEventById = async () => {
                try {
                    const response = await getEventById({ id: eventId })
                    if (response.code == HttpStatusCode.Ok) {
                        setEvent(response.result)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchEventById()
        }, [isRefresh, eventId]
    )

    useEffect(
        () => {
            const fetchEventCommissionRate = async () => {
                try {
                    const response = await getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_RATE })
                    if (response.code == HttpStatusCode.Ok) {
                        setEventCommissionRate(response.result)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchEventCommissionRate()
        }, [isRefresh, eventId]
    )

    useEffect(
        () => {
            const fetchEventCommissionFixed = async () => {
                try {
                    const response = await getSystemConfigByKey({ key: SystemConfigurationKey.COMMISSION_FIXED_PER_TICKET })
                    if (response.code == HttpStatusCode.Ok) {
                        setEventCommissionFixed(response.result)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchEventCommissionFixed()
        }, [isRefresh, eventId]
    )



    if (!event || !eventCommissionFixed || !eventCommissionRate) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const isOnline = event.type === EventType.ONLINE.key

    // Calculate earliest start date  from sessions
    const earliestStart = event.eventSessions?.length > 0
        ? event.eventSessions.reduce((min, session) => session.startDateTime < min ? session.startDateTime : min, event.eventSessions[0].startDateTime)
        : null;

    const totalTickets = event.eventSessions?.reduce((acc, session) => {
        return acc + session.tickets.reduce((tAcc, ticket) => tAcc + ticket.quantity, 0);
    }, 0);


    const handleRejectSubmit = async (reason) => {
        console.log("Đã từ chối với lý do:", reason);
        try {
            const response = await rejectEvent({ id: eventId, reason: reason });
            if (response.code == HttpStatusCode.Ok) {
                setIsRefresh(prev => !prev);
                setRejectModalOpen(false);
            }
        } catch (error) {
            console.log(error)
        }
    };

    const handleApproveSubmit = async (newCommissionRate, newCommissionFixed) => {
        try {
            setIsLoading(true)
            const response = await approveEvent({
                id: eventId, commissionRate: newCommissionRate,
                commissionFixedPerTicket: newCommissionFixed
            });
            if (response.code == HttpStatusCode.Ok) {
                setIsRefresh(prev => !prev);
                toast.success("Duyệt sự kiện thành công")
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsApproveModalOpen(false);
            setIsLoading(false)
        }

    };
    return (
        <div className="flex-1 overflow-y-auto p-2 md:p-2 dark:bg-slate-950">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                                {event.name}
                            </h1>
                            <StatusBadge status={event.status} />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Được tạo ngày {formatDateTime(event.createdAt)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm"
                            onClick={() => navigate(-1)}
                            className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Quay lại
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" /> Xem trang public
                        </Button>
                    </div>
                </div>

                {/* Main */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN (Content) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Banner Image */}
                        <div className="rounded-xl overflow-hidden border shadow-sm relative group aspect-video">
                            <img
                                src={event.thumbnail}
                                alt="Event Banner"
                                className="w-full h-full object-cover"
                            />
                            {/* <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">
                                Banner sự kiện
                            </div> */}
                        </div>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Building className="w-5 h-5 text-primary" />
                                    Mô tả sự kiện
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300"
                                    dangerouslySetInnerHTML={{ __html: event.description }}
                                />
                            </CardContent>
                        </Card>

                        {/* Tickets Information*/}
                        <Card>
                            <CardHeader className="px-4">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Ticket className="w-5 h-5 text-primary" />
                                    Thông tin vé
                                </CardTitle>
                                <CardDescription>Danh sách các loại vé trong sự kiện này</CardDescription>
                            </CardHeader>
                            <CardContent className="px-4">
                                {event.eventSessions?.map((session) => (
                                    <div key={session.id} className="mb-6 last:mb-0">
                                        <h4 className=" text-sm mb-3 flex items-center gap-2">
                                            <div className="flex items-center gap-3">
                                                <CalendarClock className="w-4 h-4 text-primary" />
                                                <div>
                                                    <p>
                                                        {formatTime(session.startDateTime)} - {formatTime(session.endDateTime)},
                                                        {formatDate(session.startDateTime) == formatDate(session.endDateTime) ?
                                                            getDayInWeek(session.startDateTime) :
                                                            getDayInWeek(session.startDateTime) - getDayInWeek(session.endDateTime)
                                                        } </p>
                                                    <p className="text-primary font-semibold">
                                                        {
                                                            formatDate(session.startDateTime) == formatDate(session.endDateTime) ?
                                                                formatDate(session.startDateTime) :
                                                                formatDate(session.startDateTime) - formatDate(session.endDateTime)
                                                        }
                                                    </p>

                                                </div>
                                            </div>
                                        </h4>
                                        <div className="border rounded-lg overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
                                                    <TableRow>
                                                        <TableHead>Loại vé</TableHead>
                                                        <TableHead>Giá vé</TableHead>
                                                        <TableHead>Số lượng</TableHead>
                                                        <TableHead>Thời gian mở bán</TableHead>
                                                        <TableHead className="text-right">Trạng thái</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {session.tickets?.map((ticket) => (
                                                        <TableRow key={ticket.id}>
                                                            <TableCell className="font-medium">{ticket.name}</TableCell>
                                                            <TableCell className="text-red-600 font-semibold">
                                                                {formatCurrency(ticket.price)}
                                                            </TableCell>
                                                            <TableCell>{ticket.quantity}</TableCell>
                                                            <TableCell>
                                                                {formatDateTime(ticket.openAt)} - {formatDateTime(ticket.endAt)}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                                                    Đang mở bán
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Location */}
                        {
                            !isOnline &&
                            <Card >
                                <CardHeader className="px-4">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        {isOnline ? 'Thông tin phòng họp' : 'Địa điểm tổ chức'}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="px-4">

                                    <div
                                        className="bg-slate-100 dark:bg-slate-800 h-64 rounded-lg flex items-center 
                                justify-center relative overflow-hidden"
                                    >
                                        <Map
                                            lat={event.locationCoordinates.latitude}
                                            lng={event.locationCoordinates.longitude}
                                            address={event.location}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        }
                    </div>

                    {/* RIGHT COLUMN (Sidebar/Sticky) */}
                    <div className="space-y-6 lg:sticky lg:top-6">

                        {/* Moderation Actions Card */}
                        <Card className="border-slate-200 shadow-lg ring-1 ring-slate-900/5">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Gavel className="w-5 h-5 text-orange-500" />
                                    Kiểm duyệt sự kiện
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {event.status === EventStatus.APPROVED
                                    && (
                                        <Alert variant="default" className="bg-green-50 dark:bg-green-900/10 border-green-200">
                                            <AlertTitle className="text-green-700">Sự kiện này đã được duyệt</AlertTitle>
                                        </Alert>
                                    )}
                                {event.status === EventStatus.REJECTED
                                    && event.rejectionReason && (
                                        <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/10 border-red-200">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Sự kiện này đã bị từ chối</AlertTitle>
                                            <AlertDescription>
                                                Lý do: {event.rejectionReason}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                {
                                    event.status == EventStatus.PENDING && (
                                        <>
                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-sm text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-800 flex gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <p>Sự kiện này đang chờ duyệt. Vui lòng kiểm tra kỹ thông tin.</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <Button variant="destructive"
                                                    onClick={() => setRejectModalOpen(true)}
                                                    className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200 border shadow-none">
                                                    <XCircle className="w-4 h-4 mr-2" /> Từ chối
                                                </Button>
                                                <Button
                                                    onClick={() => setIsApproveModalOpen(true)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 shadow-lg">
                                                    <CheckCircle className="w-4 h-4 mr-2" /> Duyệt ngay
                                                </Button>
                                                <ApproveEventModal
                                                    isOpen={isApproveModalOpen}
                                                    onClose={() => setIsApproveModalOpen(false)}
                                                    defaultCommission={eventCommissionRate.value}
                                                    defaultFixedFee={eventCommissionFixed.value}
                                                    onConfirm={handleApproveSubmit}
                                                    isLoading={isLoading}
                                                />
                                                <RejectReasonModal
                                                    isOpen={rejectModalOpen}
                                                    onClose={() => setRejectModalOpen(false)}
                                                    onConfirm={handleRejectSubmit}
                                                    title={"Từ chối sự kiện"}
                                                />
                                            </div>
                                        </>
                                    )
                                }
                            </CardContent>
                        </Card>

                        {/* Summary Info Card */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">Thông tin tóm tắt</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Thời gian bắt đầu</p>
                                        <p className="text-sm font-semibold mt-0.5">
                                            {earliestStart ? formatDateTime(earliestStart) : 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                </div>


                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Tổng vé dự kiến</p>
                                        <p className="text-sm font-semibold mt-0.5">{totalTickets} vé</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        <ChartBarStacked className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Danh mục</p>
                                        <p className="text-sm font-semibold mt-0.5">{event.category?.name}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Organizer Info Card */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-base">Ban tổ chức</h3>
                                    <a href="#" className="text-xs text-primary hover:underline">Xem hồ sơ</a>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <Avatar className="w-12 h-12 border">
                                        <AvatarImage src={event.appUser?.avatar} />
                                        <AvatarFallback>{event.appUser.fullName ? event.appUser?.fullName.charAt(0) :
                                            "U"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-bold">{event.appUser?.fullName}</p>
                                        {/* <p className="text-xs text-muted-foreground">Organizer</p> */}
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="truncate">{event.appUser?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <span>{event.appUser?.phoneNumber}</span>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;