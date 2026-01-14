import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical,
    Clock, CheckCircle2, XCircle,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getOrganizerRegistrations } from "@/services/organizerRegistrationService.js";
import { routes } from "@/config/routes.jsx";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";


// Stats Card Component 
// eslint-disable-next-line no-unused-vars


const OrganizerRequestPage = () => {
    const [organizerRegistrations, setOrganizerRegistration] = useState(null)
    const navigate = useNavigate()

    useEffect(
        () => {
            const fetchorganizerRegistrations = async () => {
                try {
                    const response = await getOrganizerRegistrations()
                    setOrganizerRegistration(response.result.data)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchorganizerRegistrations()
        }, []
    )

    if (!organizerRegistrations) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    return (

        <div className="p-2 md:p-6 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-tight">
                        Quản lý Yêu cầu Ban Tổ chức
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét và phê duyệt hồ sơ đăng ký của các đơn vị tổ chức sự kiện.
                    </p>
                </div>
                <Button variant="outline" className="gap-2 shadow-sm">
                    <Download size={16} />
                    Xuất dữ liệu
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Yêu cầu chờ duyệt"
                    count="15"
                    badgeText=""
                    badgeColorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                    icon={Clock}
                    iconColorClass="text-yellow-500"
                />
                <StatCard
                    title="Đã phê duyệt"
                    count="124"
                    badgeText=""
                    badgeColorClass="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                    icon={CheckCircle2}
                    iconColorClass="text-green-500"
                />
                <StatCard
                    title="Đã từ chối"
                    count="32"
                    badgeText=""
                    badgeColorClass="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    icon={XCircle}
                    iconColorClass="text-red-500"
                />
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên, email hoặc tổ chức..."
                        className="pl-9 bg-card"
                    />
                </div>

                {/* Filters Select */}
                <div className="flex gap-3">
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã phê duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[160px] bg-card">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Mới nhất</SelectItem>
                            <SelectItem value="oldest">Cũ nhất</SelectItem>
                            <SelectItem value="az">A-Z</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">

                            <TableHead className="uppercase text-xs font-semibold">Người đăng ký</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Tổ chức / Doanh nghiệp</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Ngày gửi</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Trạng thái</TableHead>
                            {/* <TableHead className="text-right uppercase text-xs font-semibold">Hành động</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {organizerRegistrations.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/50">

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={item.appUser?.avatar} alt={item.representativeFullName} />
                                            <AvatarFallback>{item.representativeFullName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-foreground">{item.representativeFullName}</p>
                                            <p className="text-sm text-muted-foreground">{item.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium flex items-center gap-2">
                                            {item.businessName}
                                        </span>
                                        {/* <span className="text-sm text-muted-foreground">ID: #{item.id.toString().padStart(6, '0')}</span> */}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={item.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        navigate(routes.organizerRegistrationDetail.replace(":id", item.id))
                                                    }}
                                                >Xem chi tiết</DropdownMenuItem>
                                                {/* <DropdownMenuItem>Gửi email</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">Xóa yêu cầu</DropdownMenuItem> */}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Hiển thị <span className="font-medium text-foreground">1</span> đến
                    <span className="font-medium text-foreground">5</span> trong số
                    <span className="font-medium text-foreground">15</span> kết quả
                </p>
                <Pagination className="w-auto m-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

        </div>
    );
};

export default OrganizerRequestPage;