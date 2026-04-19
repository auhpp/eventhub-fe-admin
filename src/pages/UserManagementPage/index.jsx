import React, { useEffect, useState } from "react";
import {
    Search, Download, MoreVertical, Loader2,
    PlusCircle
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
import DefaultPagination from "@/components/DefaultPagination";
import { formatDateTime } from "@/utils/format";
import DefaultAvatar from "@/components/DefaultAvatar";
import { exportUser, getUsers } from "@/services/userService";
import { RoleName } from "@/utils/constant";
import RoleNameBadge from "@/components/RoleNameBadge";
import UserStatusBadge from "@/components/UserStatusBadge";
import { HttpStatusCode } from "axios";
import CreateAdminDialog from "./CreateAdminDialog";
import RefreshButton from "@/components/RefreshButton";
import { toast } from "sonner";


const UserManagementPage = () => {
    const [users, setUsers] = useState(null);
    const navigate = useNavigate();
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [isExporting, setIsExporting] = useState(false);

    // Pagination & Filters State
    const currentPage = parseInt(searchParams.get("page") || "1");
    const pageSize = 10;
    const statusFilter = searchParams.get("status") || 'ALL';
    const roleFilter = searchParams.get("role") || 'ALL';

    const [isLoading, setIsLoading] = useState(true);
    const emailFilter = searchParams.get("query") || null;

    const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);

    const fetchUsers = async () => {
        try {

            const response = await getUsers({
                roleName: roleFilter === "ALL" ? null : roleFilter,
                status: statusFilter === "ALL" ? null : statusFilter,
                email: emailFilter,
                page: currentPage,
                size: pageSize
            });

            if (response.code == HttpStatusCode.Ok) {
                const resData = response.result;
                setUsers(resData.data || []);
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
        fetchUsers();
    }, [currentPage, statusFilter, roleFilter, emailFilter]);

    const handleFilterChange = (e, param) => {
        setSearchParams(params => {
            params.set(param, e);
            params.set("page", "1");
            return params;
        });
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearchParams(params => {
                params.set('query', e.target.value);
                params.set("page", "1");
                return params;
            });
        }
    };

    if (isLoading || !users) {
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

            const blobData = await exportUser({
                roleName: roleFilter === "ALL" ? null : roleFilter,
                status: statusFilter === "ALL" ? null : statusFilter,
                email: emailFilter
            });

            const blob = new Blob([blobData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const downloadUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = downloadUrl;

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            link.setAttribute('download', `Danh_sach_tai_khoan_${timestamp}.xlsx`);

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
                        Quản lý tài khoản người dùng
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Xem danh sách các tài khoản người dùng và tạo tài khoản admin
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

                    <Button onClick={() => setIsCreateAdminOpen(true)} className="gap-2 shadow-sm">
                        <PlusCircle size={16} />
                        Tạo Admin
                    </Button>

                    <RefreshButton
                        isLoading={isLoading}
                        onClick={fetchUsers}
                    />
                </div>
            </div>

            {/* Filters & Actions Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search Input */}
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Tìm kiếm theo email..."
                        className="pl-9 bg-card"
                        onKeyDown={handleSearch}
                        defaultValue={emailFilter}

                    />
                </div>

                {/* Filters Select */}
                <div className="flex gap-3">
                    <Select value={statusFilter} onValueChange={(e) => handleFilterChange(e, "status")}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
                            <SelectItem value={'true'}>Hoạt động</SelectItem>
                            <SelectItem value={'false'}>Không hoạt động</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={roleFilter} onValueChange={(e) => handleFilterChange(e, "role")}>
                        <SelectTrigger className="w-[180px] bg-card">
                            <SelectValue placeholder="Vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tất cả vai trò</SelectItem>
                            <SelectItem value={RoleName.ADMIN}>Quản trị viên</SelectItem>
                            <SelectItem value={RoleName.ORGANIZER}>Nhà tổ chức</SelectItem>
                            <SelectItem value={RoleName.USER}>Người dùng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Data Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden auto-cols-max overflow-x-auto">
                <Table className="min-w-max">
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="uppercase text-xs font-semibold">Tài khoản</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Vai trò</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Trạng thái</TableHead>
                            <TableHead className="uppercase text-xs font-semibold">Ngày tạo</TableHead>
                            <TableHead className="uppercase text-xs font-semibold text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    Không tìm thấy tài khoản nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-muted/50">
                                    {/* info user */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <DefaultAvatar user={item} />
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-foreground">{item?.fullName}</p>
                                                <p className="text-sm text-muted-foreground">{item?.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* role */}
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <RoleNameBadge roleName={item.role.name} />
                                        </div>
                                    </TableCell>

                                    {/*status*/}
                                    <TableCell>
                                        <UserStatusBadge status={item.status} />
                                    </TableCell>

                                    {/* created at */}
                                    <TableCell>
                                        <p className="text-sm text-foreground">
                                            {formatDateTime(item.createdAt)}
                                        </p>
                                    </TableCell>

                                    {/* Actions */}
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
                                                            navigate(routes.userDetail.replace(":id", item.id));
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
            {users.length > 0 && (
                <DefaultPagination
                    currentPage={currentPage}
                    setSearchParams={setSearchParams}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    pageSize={pageSize}
                />
            )}
            <CreateAdminDialog
                open={isCreateAdminOpen}
                onOpenChange={setIsCreateAdminOpen}
                onSuccess={() => {
                    setSearchParams(params => {
                        params.set("page", "1");
                        return params;
                    });
                    fetchUsers();
                }}
            />
        </div>
    );
};

export default UserManagementPage;