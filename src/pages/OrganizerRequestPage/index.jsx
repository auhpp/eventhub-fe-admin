import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical,
    Loader2, X 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
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
import { HttpStatusCode } from "axios";
import DefaultPagination from "@/components/DefaultPagination";
import DefaultAvatar from "@/components/DefaultAvatar";
import { OrganizerType, RegistrationStatus } from "@/utils/constant";
import { isValidEmail } from "@/utils/validate";
import RefreshButton from "@/components/RefreshButton";
import DatePicker from "@/components/DatePicker"; 
import { toast } from "sonner";
import { getOrganizerRegistrations, exportOrganizerRegistration } from "@/services/organizerRegistrationService.js";

const OrganizerRequestPage = () => {
    const [organizerRegistrations, setOrganizerRegistration] = useState(null)
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);

    // URL Params
    const currentPage = parseInt(searchParams.get("page") || "1");
    const statusFilter = searchParams.get("status") || 'ALL';
    const query = searchParams.get("query") || "";
    const fromDateFilter = searchParams.get("fromDate") || null;
    const toDateFilter = searchParams.get("toDate") || null;

    const pageSize = 10;
    const [isLoading, setIsLoding] = useState(true);

    const [searchValue, setSearchValue] = useState(query);

    useEffect(() => {
        setSearchValue(query || "");
    }, [query]);

    const hasActiveFilters =
        statusFilter !== 'ALL' ||
        query !== "" ||
        fromDateFilter !== null ||
        toDateFilter !== null;

    const fetchorganizerRegistrations = async () => {
        try {
            var requestPayload = {
                email: isValidEmail(query) ? query : null,
                organizerName: !isValidEmail(query) ? query : null,
                status: statusFilter == "ALL" ? null : statusFilter,
                page: currentPage,
                size: pageSize
            }

            if (fromDateFilter) {
                requestPayload.fromDate = `${fromDateFilter}T00:00:00`;
            }
            if (toDateFilter) {
                requestPayload.toDate = `${toDateFilter}T23:59:59`;
            }

            const response = await getOrganizerRegistrations(requestPayload)

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
        }, [currentPage, query, statusFilter, fromDateFilter, toDateFilter]
    )

    const handleFilterChange = (value, param) => {
        setSearchParams(params => {
            if (value) {
                params.set(param, value);
            } else {
                params.delete(param);
            }
            params.set("page", "1");
            return params;
        });
    }

    const handleSearchByName = (e) => {
        if (e.key === 'Enter') {
            setSearchParams(params => {
                if (searchValue.trim()) {
                    params.set('query', searchValue.trim());
                } else {
                    params.delete('query');
                }
                params.set("page", "1");
                return params;
            });
        }
    };

    const handleClearFilters = () => {
        setSearchParams({ page: "1" });
    };

    if (!organizerRegistrations || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const handleExport = async () => {
        try {
            setIsExporting(true);
            toast.info("Hệ thống đang chuẩn bị báo cáo, vui lòng đợi...");

            const payload = {
                status: statusFilter === "ALL" ? null : statusFilter,
                email: isValidEmail(query) ? query : null,
                organizerName: !isValidEmail(query) ? query : null,
                userId: null, 
                fromDate: fromDateFilter ? `${fromDateFilter}T00:00:00` : null,
                toDate: toDateFilter ? `${toDateFilter}T23:59:59` : null,
            };

            const blobData = await exportOrganizerRegistration(payload);

            const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('download', `Danh_Sach_Ho_So_BTC_${timestamp}.xlsx`);

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            toast.success("Xuất báo cáo Excel thành công!");

        } catch (error) {
            console.error("Lỗi xuất báo cáo:", error);
            toast.error("Không thể xuất file lúc này, vui lòng thử lại sau!");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="p-2 space-y-6">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">
                        Quản lý hồ sơ đăng ký của nhà tổ chức
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét và phê duyệt hồ sơ đăng ký của các đơn vị tổ chức sự kiện.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2 shadow-sm"
                        onClick={handleExport}
                        disabled={isExporting}
                    >
                        {isExporting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Download size={16} />
                        )}
                        {isExporting ? "Đang xuất..." : "Xuất dữ liệu"}
                    </Button>
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchorganizerRegistrations}
                    />
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-between">

                {/* Search Input (Controlled Component) */}
                <div className="relative flex-1 max-w-lg mb-0 lg:mb-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo email người đăng ký hoặc tên tổ chức..."
                        className="pl-9 bg-card"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearchByName}
                    />
                </div>

                {/* Filters Select & DatePicker */}
                <div className="flex flex-wrap items-end gap-3">

                    <div className="w-[140px]">
                        <DatePicker
                            label="Từ ngày"
                            value={fromDateFilter}
                            onChange={(date) => handleFilterChange(date, "fromDate")}
                        />
                    </div>

                    <div className="w-[140px]">
                        <DatePicker
                            label="Đến ngày"
                            value={toDateFilter}
                            onChange={(date) => handleFilterChange(date, "toDate")}
                        />
                    </div>

                    <div className="mb-0 lg:mb-1">
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

                    {/* clear filters */}
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            onClick={handleClearFilters}
                            className="h-10 px-3 text-muted-foreground hover:text-foreground mb-0 lg:mb-1"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Xóa bộ lọc
                        </Button>
                    )}
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="uppercase text-xs font-semibold">Tài khoản đăng ký</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Nhà tổ chức</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Loại hình</TableHead>
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
                                    <span>{item.type == OrganizerType.PERSONAL ? "Cá nhân" : "Tổ chức"}
                                    </span>
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