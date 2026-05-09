import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical, Loader2,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useNavigate, useSearchParams } from "react-router-dom";
import DefaultPagination from "@/components/DefaultPagination";
import { formatDateTime, formatCurrency } from "@/utils/format";
import DefaultAvatar from "@/components/DefaultAvatar";
import RefreshButton from "@/components/RefreshButton";
import { toast } from "sonner";
import { filterWithdrawalRequests, exportWithdrawal }
    from "@/services/withdrawalRequestService";
import DatePicker from "@/components/DatePicker";
import { routes } from "@/config/routes";
import WithdrawalStatusBadge from "@/components/WithdrawalStatusBadge";
import { WithdrawalStatus } from "@/utils/constant";

const WithdrawalManagementPage = () => {
    const [requests, setRequests] = useState(null);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    // Pagination & Filters State
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const statusFilter = searchParams.get("status") || 'ALL';
    const query = searchParams.get("query") || "";
    const fromDateFilter = searchParams.get("fromDate") || null;
    const toDateFilter = searchParams.get("toDate") || null;
    const [isExporting, setIsExporting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [searchValue, setSearchValue] = useState(query);

    useEffect(() => {
        setSearchValue(query || "");
    }, [query]);

    const hasActiveFilters =
        statusFilter !== 'ALL' ||
        query !== "" ||
        fromDateFilter !== null ||
        toDateFilter !== null;

    const fetchWithdrawalRequests = async () => {
        try {

            const filterData = {};
            if (query) filterData.userEmail = query;
            if (statusFilter !== 'ALL') filterData.status = statusFilter;

            if (fromDateFilter) filterData.fromDate = `${fromDateFilter}T00:00:00`;
            if (toDateFilter) filterData.toDate = `${toDateFilter}T23:59:59`;

            const response = await filterWithdrawalRequests({
                data: filterData,
                page: currentPage,
                size: pageSize
            });

            const resData = response.result || response;

            setRequests(resData.data || []);
            setTotalPages(resData.totalPage || 1);
            setTotalElements(resData.totalElements || 0);

        } catch (error) {
            console.error("Lỗi khi tải danh sách yêu cầu rút tiền:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawalRequests();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, statusFilter, query, fromDateFilter, toDateFilter]);

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
    };

    const handleSearch = (e) => {
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

    if (isLoading && !requests) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    const handleExport = async () => {
        try {
            setIsExporting(true);
            toast.info("Hệ thống đang chuẩn bị báo cáo, vui lòng đợi...");

            const filterData = {};
            if (query) filterData.userEmail = query;
            if (statusFilter !== 'ALL') filterData.status = statusFilter;
            if (fromDateFilter) filterData.fromDate = `${fromDateFilter}T00:00:00`;
            if (toDateFilter) filterData.toDate = `${toDateFilter}T23:59:59`;

            const blobData = await exportWithdrawal({ data: filterData });

            const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('download', `Yeu_Cau_Rut_Tien_${timestamp}.xlsx`);

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
                        Yêu cầu rút tiền
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Quản lý và xét duyệt các yêu cầu rút tiền từ ví người dùng
                    </p>
                </div>
                <div className="flex items-center gap-3">
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
                        {isExporting ? "Đang xuất..." : "Xuất báo cáo"}
                    </Button>
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchWithdrawalRequests}
                    />
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-between">

                {/* Search Input */}
                <div className="relative flex-1 max-w-lg mb-0 lg:mb-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo email người rút..."
                        className="pl-9 bg-card"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyDown={handleSearch}
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
                        <Select value={statusFilter} onValueChange={(e) => handleFilterChange(e, "status")}>
                            <SelectTrigger className="w-[180px] bg-card">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                <SelectItem value={WithdrawalStatus.PENDING}>Chờ duyệt</SelectItem>
                                <SelectItem value={WithdrawalStatus.PROCESSING}>Đang xử lý</SelectItem>
                                <SelectItem value={WithdrawalStatus.COMPLETED}>Thành công</SelectItem>
                                <SelectItem value={WithdrawalStatus.REJECTED}>Bị từ chối</SelectItem>
                                <SelectItem value={WithdrawalStatus.CANCELLED}>Đã hủy</SelectItem>
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
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden auto-cols-max overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="uppercase text-xs font-semibold">Mã yêu cầu</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Ngày tạo</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Người yêu cầu</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Số tiền</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Thông tin nhận</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Trạng thái</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {!requests || requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Không tìm thấy yêu cầu rút tiền nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-muted/50">

                                    {/* transaction id and created at */}
                                    <TableCell>
                                        <div className="space-y-1 ms-2">
                                            <span className="text-sm font-semibold">{item.id}</span>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm">
                                                {formatDateTime(item.createdAt)}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Info User */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <DefaultAvatar user={item.wallet?.appUser} />
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-sm text-foreground">
                                                    {item.wallet?.appUser?.fullName || "Người dùng"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.wallet?.appUser?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* amount */}
                                    <TableCell>
                                        <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                                            {formatCurrency(item.amount)}
                                        </div>
                                    </TableCell>

                                    {/* bank */}
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-foreground">
                                                {item.bankCode} <span className="font-normal ml-1">
                                                    ({item.bankAccountNo})</span>
                                            </p>
                                            <p className="text-xs font-medium uppercase">
                                                {item.bankAccountName}
                                            </p>
                                        </div>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <WithdrawalStatusBadge status={item.status} />
                                    </TableCell>

                                    {/* Actions */}
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        navigate(routes.withdrawalRequestDetail.replace(":id", item.id));
                                                    }}
                                                >
                                                    {item.status === 'PENDING' ? "Xem & Xử lý" : "Xem chi tiết"}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {requests && requests.length > 0 && (
                <DefaultPagination
                    currentPage={currentPage}
                    setSearchParams={setSearchParams}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                />
            )}
        </div>
    );
};

export default WithdrawalManagementPage;