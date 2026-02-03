import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical,
    Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { routes } from "@/config/routes.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { getEvents } from "@/services/eventService";
import { HttpStatusCode } from "axios";
import DefaultPagination from "@/components/DefaultPagination";

const EventManagement = () => {
    const [events, setEvents] = useState(null)
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 4;
    
    useEffect(
        () => {
            const fetchEvents = async () => {
                try {
                    const response = await getEvents({ page: currentPage, size: pageSize })
                    if (response.code == HttpStatusCode.Ok) {
                        setEvents(response.result.data)
                        setTotalPages(response.result.totalPage);
                        setTotalElements(response.result.totalElements);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchEvents()
        }, [currentPage]
    )
    

    if (!events) {
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
                        Quản lý sự kiện
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét và phê duyệt các sự kiện của các đơn vị tổ chức sự kiện.
                    </p>
                </div>
                <Button variant="outline" className="gap-2 shadow-sm">
                    <Download size={16} />
                    Xuất dữ liệu
                </Button>
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

                            <TableHead className="uppercase text-xs font-semibold">Thông tin sự kiện</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Người tổ chức</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Địa điểm</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((item) => (
                            <TableRow key={item.id} className="group hover:bg-muted/50">

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.thumbnail}
                                            alt="Photo by Drew Beamer"
                                            fill
                                            className="w-40 rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
                                        />
                                        <div>
                                            <p className="font-medium mb-1 text-foreground">{item.name}</p>
                                            <span className="text-sm text-muted-foreground bg-gray-100
                                            p-1 rounded-sm 
                                            ">{item.category.name}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={item.appUser?.avatar} alt={item.representativeFullName} />
                                            <AvatarFallback>{item.appUser.fullName ? item.appUser?.fullName?.charAt(0) : "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-foreground">{item.appUser.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{item.appUser.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm text">
                                        {item.location}
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
                                                        navigate(routes.eventDetail.replace(":id", item.id))
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
            <DefaultPagination
                currentPage={currentPage}
                setSearchParams={setSearchParams}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={pageSize}
            />

        </div>
    );
};

export default EventManagement;