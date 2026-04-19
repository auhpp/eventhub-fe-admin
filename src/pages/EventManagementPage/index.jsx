import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical,
    Loader2, X 
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
import { EventStatus, SortType } from "@/utils/constant";
import { getCategoris } from "@/services/categoryService";
import { isValidEmail } from "@/utils/validate";
import RefreshButton from "@/components/RefreshButton";
import DatePicker from "@/components/DatePicker";
import { toast } from "sonner"; 
import { exportEvent } from "@/services/eventService";

const EventManagement = () => {
    const [events, setEvents] = useState(null)
    const navigate = useNavigate()
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();

    // get filter params from URL
    const currentPage = parseInt(searchParams.get("page") || "1");
    const categoryIdFilter = searchParams.get("categoryId") || 'ALL';
    const statusFilter = searchParams.get("status") || 'ALL';
    const sortTypeFilter = searchParams.get("sortType") || SortType.NEWEST;
    const query = searchParams.get("query") || "";
    const fromDateFilter = searchParams.get("fromDate") || null;
    const toDateFilter = searchParams.get("toDate") || null;

    const [isLoading, setIsLoding] = useState(true);
    const pageSize = 4;
    const [categories, setCategories] = useState(null);
    const [searchValue, setSearchValue] = useState(query);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        setSearchValue(query || "");
    }, [query]
    )

    const hasActiveFilters =
        categoryIdFilter !== 'ALL' ||
        statusFilter !== 'ALL' ||
        sortTypeFilter !== SortType.NEWEST ||
        query !== "" ||
        fromDateFilter !== null ||
        toDateFilter !== null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoryRes = await getCategoris()

                if (categoryRes.code === HttpStatusCode.Ok) {
                    setCategories(categoryRes.result);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, []);

    const fetchEvents = async () => {
        try {
            var request = {
                status: statusFilter == "ALL" ? null : statusFilter,
                categoryIds: categoryIdFilter == "ALL" ? null : [categoryIdFilter],
                sortType: sortTypeFilter,
                fromDate: fromDateFilter,
                toDate: toDateFilter
            }
            if (fromDateFilter) {
                request.fromDate = `${fromDateFilter}T00:00:00`;
            }

            if (toDateFilter) {
                request.toDate = `${toDateFilter}T23:59:59`;
            }
            if (isValidEmail(query)) {
                request.email = query
            }
            else {
                request.name = query
            }
            const response = await getEvents({
                request,
                page: currentPage, size: pageSize
            })
            if (response.code == HttpStatusCode.Ok) {
                setEvents(response.result.data)
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
            fetchEvents()
        }, [currentPage, statusFilter, categoryIdFilter, sortTypeFilter, query, fromDateFilter, toDateFilter]
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

    if (!events || !categories || isLoading) {
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

            const request = {
                status: statusFilter === "ALL" ? null : statusFilter,
                categoryIds: categoryIdFilter === "ALL" ? null : [categoryIdFilter],
                sortType: sortTypeFilter,
                fromDate: fromDateFilter ? `${fromDateFilter}T00:00:00` : null,
                toDate: toDateFilter ? `${toDateFilter}T23:59:59` : null,
            };

            if (isValidEmail(query)) {
                request.email = query;
            } else {
                request.name = query;
            }

            const blobData = await exportEvent({ request });

            const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('download', `Danh_Sach_Su_Kien_${timestamp}.xlsx`);

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
                        Quản lý sự kiện
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem xét và phê duyệt các sự kiện của các đơn vị tổ chức sự kiện.
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
                        onClick={fetchEvents}
                    />
                </div>
            </div>

            {/* Search Input */}
            <div className="relative flex-1 max-w-sm mb-0 lg:mb-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Tìm kiếm theo tên sự kiện, email nhà tổ chức..."
                    className="pl-9 bg-card"
                    onKeyDown={handleSearchByName}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
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
                    <Select value={categoryIdFilter} onValueChange={(e) => handleFilterChange(e, "categoryId")}
                        defaultValue="ALL">
                        <SelectTrigger className="w-[160px] bg-card">
                            <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả danh mục</SelectItem>
                            {categories.map(item => (
                                <SelectItem key={item.id}
                                    value={String(item.id)}>{item.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-0 lg:mb-1">
                    <Select value={statusFilter} onValueChange={(e) => handleFilterChange(e, "status")} defaultValue="ALL">
                        <SelectTrigger className="w-[150px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value={EventStatus.PENDING}>Chờ duyệt</SelectItem>
                            <SelectItem value={EventStatus.APPROVED}>Đã phê duyệt</SelectItem>
                            <SelectItem value={EventStatus.REJECTED}>Từ chối</SelectItem>
                            <SelectItem value={EventStatus.CANCELLED}>Đã hủy</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="mb-0 lg:mb-1">
                    <Select value={sortTypeFilter} onValueChange={(e) => handleFilterChange(e, "sortType")}
                        defaultValue={SortType.NEWEST}>
                        <SelectTrigger className="w-[130px] bg-card">
                            <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SortType.NEWEST}>Mới nhất</SelectItem>
                            <SelectItem value={SortType.OLDEST}>Cũ nhất</SelectItem>
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
                                    <p className="text-sm text font-bold">
                                        {item.address}
                                    </p>
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