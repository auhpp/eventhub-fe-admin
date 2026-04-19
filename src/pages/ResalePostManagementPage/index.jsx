import React, { useEffect, useState } from "react";
import {
    Search, MoreVertical, Loader2, X 
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
import { routes } from "@/config/routes.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { filterResalePosts } from "@/services/resalePostService";
import DefaultPagination from "@/components/DefaultPagination";
import { formatCurrency, formatDateTime } from "@/utils/format";
import DefaultAvatar from "@/components/DefaultAvatar";
import { isValidEmail } from "@/utils/validate";
import { ResalePostStatus } from "@/utils/constant";
import RefreshButton from "@/components/RefreshButton";
import ResalePostStatusBadge from "@/components/ResalePostStatusBadge";
import DatePicker from "@/components/DatePicker"; 

const ResalePostManagementPage = () => {
    const [posts, setPosts] = useState(null);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    // Pagination & Filters State 
    const currentPage = parseInt(searchParams.get("page") || "1");
    const statusFilter = searchParams.get("status") || 'ALL';
    const query = searchParams.get("query") || "";
    const fromDateFilter = searchParams.get("fromDate") || null;
    const toDateFilter = searchParams.get("toDate") || null;

    const pageSize = 10;
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

    const fetchPosts = async () => {
        try {
            const requestPayload = {
                email: isValidEmail(query) ? query : null,
                name: !isValidEmail(query) ? query : null,
                statuses: statusFilter === "ALL" ? ["ALL"] : [statusFilter],
                page: currentPage,
                size: pageSize
            };

            if (fromDateFilter) {
                requestPayload.fromDate = `${fromDateFilter}T00:00:00`;
            }
            if (toDateFilter) {
                requestPayload.toDate = `${toDateFilter}T23:59:59`;
            }

            const response = await filterResalePosts(requestPayload);
            const resData = response.result;

            if (resData) {
                setPosts(resData.data || []);
                setTotalPages(resData.totalPage || 1);
                setTotalElements(resData.totalElements || 0);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách bài đăng:", error);
        }
        finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        fetchPosts();
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


    if (!posts || isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-2 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-end">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black tracking-tight">
                        Quản lý bài đăng bán lại
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét, phê duyệt và quản lý các bài đăng bán lại vé từ người dùng.
                    </p>
                </div>
                <div className="flex gap-2">
                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchPosts}
                    />
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-end justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg mb-0 lg:mb-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo tên, email người bán..."
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
                        <Select value={statusFilter} onValueChange={(e) => handleFilterChange(e, "status")}>
                            <SelectTrigger className="w-[180px] bg-card">
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                                <SelectItem value={ResalePostStatus.PENDING}>Chờ duyệt</SelectItem>
                                <SelectItem value={ResalePostStatus.APPROVED}>Đã duyệt</SelectItem>
                                <SelectItem value={ResalePostStatus.REJECTED}>Từ chối</SelectItem>
                                <SelectItem value={ResalePostStatus.CANCELLED_BY_ADMIN}>Admin hủy</SelectItem>
                                <SelectItem value={ResalePostStatus.CANCELLED_BY_USER}>Người dùng hủy</SelectItem>
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
                            <TableHead className="uppercase text-xs font-semibold">Người bán</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Thông tin vé</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Giá bán / Vé</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Ngày đăng</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Trạng thái</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {posts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    Không tìm thấy bài đăng nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            posts.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-muted/50">
                                    {/* seller */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <DefaultAvatar user={item.appUser} />
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-foreground">{item.appUser?.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{item.appUser?.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* ticket info */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div>
                                                <p className="font-medium mb-1 
                                                text-foreground max-w-[200px] truncate"
                                                    title={item.attendees?.[0]?.ticket?.name}>
                                                    {item.attendees?.[0]?.ticket?.name || "Vé sự kiện"}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm bg-gray-100
                                                     dark:bg-gray-800 px-2 py-0.5 rounded-sm">
                                                        SL: {item.attendees?.length || 0}
                                                    </span>
                                                    <span className={`text-sm px-2 py-0.5 rounded-sm 
                                                        ${item.hasRetail ?
                                                            "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                                            "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"}`}>
                                                        {item.hasRetail ? "Bán lẻ" : "Không bán lẻ"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* price / ticket */}
                                    <TableCell>
                                        <p className="font-semibold text-red-600">
                                            {formatCurrency(item.pricePerTicket)}
                                        </p>
                                    </TableCell>

                                    {/* created at */}
                                    <TableCell>
                                        <p className="text-sm text-foreground">
                                            {formatDateTime(item.createdAt)}
                                        </p>
                                    </TableCell>

                                    {/* status */}
                                    <TableCell>
                                        <ResalePostStatusBadge status={item.status} />
                                    </TableCell>

                                    {/* action */}
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
                                                            navigate(routes.resalePostDetail.replace(":id", item.id));
                                                        }}
                                                    >
                                                        Xem chi tiết
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {posts.length > 0 && (
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

export default ResalePostManagementPage;