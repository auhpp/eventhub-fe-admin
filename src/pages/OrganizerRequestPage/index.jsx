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
import { getOrganizerRegistrations } from "@/services/organizerRegistrationService.js";
import { routes } from "@/config/routes.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { HttpStatusCode } from "axios";
import DefaultPagination from "@/components/DefaultPagination";
import DefaultAvatar from "@/components/DefaultAvatar";
import { RegistrationStatus } from "@/utils/constant";
import { isValidEmail } from "@/utils/validate";
import RefreshButton from "@/components/RefreshButton";

const OrganizerRequestPage = () => {
    const [organizerRegistrations, setOrganizerRegistration] = useState(null)
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 2;
    const statusFilter = searchParams.get("status") || 'ALL';
    const query = searchParams.get("query") || "";
    const [isLoading, setIsLoding] = useState(false);

    const fetchorganizerRegistrations = async () => {
        try {
            setIsLoding(true)
            const response = await getOrganizerRegistrations({
                email: isValidEmail(query) ? query : null,
                organizerName: !isValidEmail(query) ? query : null,
                status: statusFilter == "ALL" ? null : statusFilter,
                page: currentPage, size: pageSize
            })
            if (response.code == HttpStatusCode.Ok) {
                setOrganizerRegistration(response.result.data)
                setTotalPages(response.result.totalPage);
                setTotalElements(response.result.totalElements);
            }
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoding(false)
        }
    }

    useEffect(
        () => {
            fetchorganizerRegistrations()
        }, [currentPage, query, statusFilter]
    )

    const handleFilterChange = (e, param) => {
        setSearchParams(params => {
            params.set(param, e);
            params.set("page", "1");
            return params;
        });
    }

    const handleSearchByName = (e) => {
        if (e.key === 'Enter') {
            setSearchParams(params => {
                params.set('query', e.target.value);
                params.set("page", "1");
                return params;
            });
        }
    };
    if (!organizerRegistrations || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }
    return (

        <div className="p-2  space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">
                        Quản lý Yêu cầu Ban Tổ chức
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét và phê duyệt hồ sơ đăng ký của các đơn vị tổ chức sự kiện.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2 shadow-sm">
                        <Download size={16} />
                        Xuất dữ liệu
                    </Button>
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchorganizerRegistrations}
                    />
                </div>
            </div>



            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo email người đăng ký hoặc tên tổ chức..."
                        className="pl-9 bg-card"
                        onKeyDown={handleSearchByName}
                        defaultValue={query}
                    />
                </div>

                {/* Filters Select */}
                <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={(e) => handleFilterChange(e, "status")} defaultValue="ALL">
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value={RegistrationStatus.PENDING}>Chờ duyệt</SelectItem>
                            <SelectItem value={RegistrationStatus.APPROVED}>Đã phê duyệt</SelectItem>
                            <SelectItem value={RegistrationStatus.REJECTED}>Từ chối</SelectItem>
                            <SelectItem value={RegistrationStatus.CANCELLED}>Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">

                            <TableHead className="uppercase text-xs font-semibold">Tài khoản đăng ký</TableHead>
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
                                            <DefaultAvatar user={item.appUser} />
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-foreground">{item.appUser.fullName}</p>
                                            <p className="text-sm text-muted-foreground">{item.appUser.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Avatar className="rounded-lg h-10 w-10">
                                            <AvatarImage
                                                src={item.businessAvatarUrl}
                                                alt={item.name} className="object-cover" />
                                        </Avatar>
                                        <span className="font-medium flex items-center gap-2">
                                            {item.businessName}
                                        </span>
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

export default OrganizerRequestPage;